/* AgriTRUST data layer: Supabase auth, storage and tables in the agritrust schema. */
(function () {
  'use strict';
  var SUPABASE_URL = 'https://inwsyhopzbuvqjipvuhg.supabase.co';
  var SUPABASE_KEY = 'sb_publishable_uWgKYkHD5uTybweHXMZlFQ_20fmeXIN';
  var LOGIN_DOMAIN = 'phone.agritrusthub.com';

  var sb = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY, {
    db: { schema: 'agritrust' },
    auth: { persistSession: true, autoRefreshToken: true, storageKey: 'agritrust-auth' },
  });

  function phoneDigits(raw) {
    var d = String(raw || '').replace(/\D/g, '');
    if (d.indexOf('00') === 0) d = d.slice(2);
    if (d.length === 10 && d[0] === '0') d = '264' + d.slice(1);
    if (d.length === 9 && d[0] === '8') d = '264' + d;
    return d.length >= 9 && d.length <= 15 ? d : null;
  }
  function prettyPhone(d) {
    if (!d) return '';
    if (d.indexOf('264') === 0 && d.length === 12) return '+264 ' + d.slice(3, 5) + ' ' + d.slice(5, 8) + ' ' + d.slice(8);
    return '+' + d;
  }
  function fail(error, fallback) {
    if (!error) return;
    console.warn('[AgriTRUST]', error);
    var msg = (error && error.message) || '';
    if (/no longer available|own listing|Cannot open/i.test(msg)) throw new Error(msg);
    throw new Error(fallback || 'Something went wrong. Please check your connection and try again.');
  }

  async function session() {
    var r = await sb.auth.getSession();
    return r.data ? r.data.session : null;
  }
  function onAuth(cb) {
    sb.auth.onAuthStateChange(function (event, s) { cb(event, s); });
  }
  async function signIn(phone, password) {
    var p = phoneDigits(phone);
    if (!p) throw new Error('Please enter a valid phone number.');
    var r = await sb.auth.signInWithPassword({ email: p + '@' + LOGIN_DOMAIN, password: password });
    if (r.error) throw new Error(/invalid/i.test(r.error.message) ? 'That phone number and password do not match.' : 'We could not sign you in. Please try again.');
    return r.data.session;
  }
  async function signUp(f) {
    var res = await fetch(SUPABASE_URL + '/functions/v1/agritrust-signup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', apikey: SUPABASE_KEY, Authorization: 'Bearer ' + SUPABASE_KEY },
      body: JSON.stringify({ name: f.name, phone: f.phone, password: f.password, region: f.region, roles: f.roles }),
    });
    var j = {};
    try { j = await res.json(); } catch (e) {}
    if (!res.ok) throw new Error(j.error || 'We could not create your account. Please try again.');
    return signIn(f.phone, f.password);
  }
  async function signOut() { await sb.auth.signOut(); }
  async function changePassword(pw) {
    var r = await sb.auth.updateUser({ password: pw });
    fail(r.error, 'We could not change your password. Please try again.');
  }

  // Shrink photos before upload so they are quick on mobile data.
  function shrink(file, max) {
    return new Promise(function (resolve) {
      if (!file || !/^image\//.test(file.type) || /gif/.test(file.type)) return resolve(file);
      var img = new Image(), url = URL.createObjectURL(file);
      img.onload = function () {
        var s = Math.min(1, max / Math.max(img.width, img.height));
        var c = document.createElement('canvas');
        c.width = Math.round(img.width * s); c.height = Math.round(img.height * s);
        c.getContext('2d').drawImage(img, 0, 0, c.width, c.height);
        URL.revokeObjectURL(url);
        c.toBlob(function (b) { resolve(b || file); }, 'image/jpeg', 0.82);
      };
      img.onerror = function () { URL.revokeObjectURL(url); resolve(file); };
      img.src = url;
    });
  }
  async function upload(uid, folder, file) {
    var blob = await shrink(file, 1400);
    var path = uid + '/' + folder + '/' + Date.now() + '-' + Math.random().toString(36).slice(2, 8) + '.jpg';
    var r = await sb.storage.from('agritrust').upload(path, blob, { contentType: 'image/jpeg', upsert: false });
    fail(r.error, 'The photo did not upload. Please try a smaller photo.');
    return sb.storage.from('agritrust').getPublicUrl(path).data.publicUrl;
  }

  var P = 'full_name,region,roles,avatar_url,created_at';

  async function publicData() {
    var res = await Promise.all([
      sb.from('listings').select('*, seller:profiles!listings_owner_fkey(' + P + ')').eq('status', 'active').order('created_at', { ascending: false }).limit(300),
      sb.from('posts').select('*, who:profiles!posts_author_fkey(' + P + ')').order('created_at', { ascending: false }).limit(100),
      sb.from('barters').select('*, who:profiles!barters_owner_fkey(' + P + ')').eq('status', 'open').order('created_at', { ascending: false }).limit(100),
      sb.from('lands').select('*, who:profiles!lands_owner_fkey(' + P + ')').eq('status', 'open').order('created_at', { ascending: false }).limit(100),
      sb.rpc('counts'),
    ]);
    res.forEach(function (r) { fail(r.error); });
    var listings = res[0].data || [];
    var ids = Array.from(new Set(listings.map(function (l) { return l.owner; })));
    var stats = {};
    if (ids.length) {
      var st = await sb.rpc('public_stats', { p_users: ids });
      (st.data || []).forEach(function (s) { stats[s.id] = Number(s.trades) || 0; });
    }
    var counts = {};
    (res[4].data || []).forEach(function (c) { counts[c.kind + ':' + c.ref] = Number(c.n); });
    return { listings: listings, posts: res[1].data || [], barters: res[2].data || [], lands: res[3].data || [], counts: counts, stats: stats };
  }

  async function myData(uid) {
    var res = await Promise.all([
      sb.from('profiles').select('*').eq('id', uid).maybeSingle(),
      sb.from('profile_private').select('*').eq('id', uid).maybeSingle(),
      sb.from('saved_listings').select('listing_id'),
      sb.from('post_likes').select('post_id').eq('user_id', uid),
      sb.from('barter_offers').select('barter_id').eq('user_id', uid),
      sb.from('land_requests').select('land_id').eq('user_id', uid),
      sb.from('theft_alerts').select('*').order('created_at', { ascending: false }).limit(100),
      sb.from('theft_sightings').select('alert_id').eq('user_id', uid),
      sb.from('disputes').select('*').order('created_at', { ascending: false }),
      sb.from('loan_applications').select('*').order('created_at', { ascending: false }),
      sb.from('haul_requests').select('*').order('created_at', { ascending: false }),
      sb.from('entries').select('*').order('entry_date', { ascending: false }).order('created_at', { ascending: false }).limit(500),
      sb.from('scan_requests').select('*').order('created_at', { ascending: false }),
      sb.from('course_interest').select('course_id'),
      sb.from('offers').select('*, listing:listings(id,name,unit,region,img,price,qty,cat,status), buyerP:profiles!offers_buyer_fkey(' + P + '), sellerP:profiles!offers_seller_fkey(' + P + ')').order('updated_at', { ascending: false }),
      sb.from('threads').select('*, pa:profiles!threads_a_fkey(' + P + '), pb:profiles!threads_b_fkey(' + P + ')').order('last_at', { ascending: false }),
      sb.from('messages').select('*').order('created_at', { ascending: false }).limit(2000),
      sb.from('notifications').select('*').eq('user_id', uid).order('created_at', { ascending: false }).limit(40),
      sb.from('buyer_requests').select('*').eq('status', 'Open').order('created_at', { ascending: false }).limit(30),
      sb.rpc('is_admin'),
    ]);
    res.forEach(function (r) { fail(r.error); });
    var d = res.map(function (r) { return r.data; });
    return {
      profile: d[0], priv: d[1], saved: d[2] || [], likes: d[3] || [], barterOffers: d[4] || [], landRequests: d[5] || [],
      alerts: d[6] || [], sightings: d[7] || [], disputes: d[8] || [], loans: d[9] || [], hauls: d[10] || [], entries: d[11] || [],
      scans: d[12] || [], interest: d[13] || [], offers: d[14] || [], threads: d[15] || [], messages: d[16] || [], notifications: d[17] || [],
      buyerRequests: d[18] || [], isAdmin: d[19] === true,
    };
  }

  async function replies(postId) {
    var r = await sb.from('post_replies').select('*, who:profiles!post_replies_author_fkey(full_name,region)').eq('post_id', postId).order('created_at', { ascending: true }).limit(200);
    fail(r.error, 'We could not load the replies.');
    return r.data || [];
  }

  // Team queues for the admin page (row level security only returns rows to admins)
  async function backupList() {
    var r = await sb.rpc('backup_list'); fail(r.error); return r.data || [];
  }
  async function backupGet(id) {
    var r = await sb.rpc('backup_get', { p_id: id }); fail(r.error, 'The copy did not download. Please try again.'); return r.data;
  }
  async function backupNow() {
    var r = await sb.rpc('backup_now'); fail(r.error, 'The copy was not made. Please try again.'); return r.data;
  }
  async function adminData() {
    var q = function (t, extra) { return sb.from(t).select(extra || '*').order('created_at', { ascending: false }).limit(200); };
    var res = await Promise.all([
      q('agent_requests'), q('contact_messages'), q('buyer_requests'), q('loan_applications'), q('haul_requests'),
      q('scan_requests'), q('disputes'), q('theft_alerts'), sb.rpc('admin_members'), sb.rpc('backup_list'),
    ]);
    res.forEach(function (r) { fail(r.error); });
    var d = res.map(function (r) { return r.data || []; });
    return { agents: d[0], contacts: d[1], buyers: d[2], loans: d[3], hauls: d[4], scans: d[5], disputes: d[6], thefts: d[7], members: d[8], backups: d[9] };
  }
  async function adminReset(userId) {
    var s = await session();
    var res = await fetch(SUPABASE_URL + '/functions/v1/agritrust-admin', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', apikey: SUPABASE_KEY, Authorization: 'Bearer ' + (s ? s.access_token : '') },
      body: JSON.stringify({ action: 'reset_password', user_id: userId }),
    });
    var j = {};
    try { j = await res.json(); } catch (e) {}
    if (!res.ok) throw new Error(j.error || 'We could not reset that password.');
    return j;
  }

  async function insert(table, row, fallback) {
    var r = await sb.from(table).insert(row).select().maybeSingle();
    fail(r.error, fallback);
    return r.data;
  }
  async function update(table, match, patch, fallback) {
    var q = sb.from(table).update(patch);
    Object.keys(match).forEach(function (k) { q = q.eq(k, match[k]); });
    var r = await q;
    fail(r.error, fallback);
  }
  async function remove(table, match, fallback) {
    var q = sb.from(table).delete();
    Object.keys(match).forEach(function (k) { q = q.eq(k, match[k]); });
    var r = await q;
    fail(r.error, fallback);
  }
  async function openThread(other, topic) {
    var r = await sb.rpc('open_thread', { p_other: other, p_topic: topic || 'chat' });
    fail(r.error, 'We could not open that chat.');
    return r.data;
  }
  async function markThreadRead(threadId, uid) {
    await sb.from('messages').update({ read_at: new Date().toISOString() }).eq('thread_id', threadId).neq('sender', uid).is('read_at', null);
  }
  async function markNotificationsRead(uid) {
    await sb.from('notifications').update({ read: true }).eq('user_id', uid).eq('read', false);
  }

  var channel = null;
  function subscribe(uid, cb) {
    unsubscribe();
    channel = sb.channel('agritrust-' + uid)
      .on('postgres_changes', { event: 'INSERT', schema: 'agritrust', table: 'messages' }, function () { cb('messages'); })
      .on('postgres_changes', { event: 'INSERT', schema: 'agritrust', table: 'notifications', filter: 'user_id=eq.' + uid }, function () { cb('notifications'); })
      .on('postgres_changes', { event: '*', schema: 'agritrust', table: 'offers' }, function () { cb('offers'); })
      .subscribe();
  }
  function unsubscribe() { if (channel) { sb.removeChannel(channel); channel = null; } }

  window.AT = {
    sb: sb, phoneDigits: phoneDigits, prettyPhone: prettyPhone,
    session: session, onAuth: onAuth, signIn: signIn, signUp: signUp, signOut: signOut, changePassword: changePassword,
    upload: upload, publicData: publicData, myData: myData,
    insert: insert, update: update, remove: remove, openThread: openThread,
    markThreadRead: markThreadRead, markNotificationsRead: markNotificationsRead,
    subscribe: subscribe, unsubscribe: unsubscribe,
    replies: replies, adminData: adminData, adminReset: adminReset, backupGet: backupGet, backupNow: backupNow,
  };
})();
