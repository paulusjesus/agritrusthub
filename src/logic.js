const REGIONS = ['Erongo', 'Hardap', '//Karas', 'Kavango East', 'Kavango West', 'Khomas', 'Kunene', 'Ohangwena', 'Omaheke', 'Omusati', 'Oshana', 'Oshikoto', 'Otjozondjupa', 'Zambezi'];
const KEYS = { mTitle: '', mCat: 'Grains', mRegion: 'Oshikoto', mPrice: '', mQty: '', mUnit: 'kg', mBody: '', mTag: 'Question', mHave: '', mWant: '', mItem: '', mReason: 'Quality did not match', mDesc: '', mName: '', mPhone: '', mPlace: '', mHa: '', mTerms: 'Harvest share, 25%', mPass: '', hFrom: 'Tsumeb, Oshikoto', hTo: 'Windhoek', hLoad: '2500', hDate: '', aType: 'out', aDesc: '', aAmt: '', cName: '', cPhone: '', cRegion: 'Oshikoto', cMsg: '', bProd: '', bQty: '', bReg: 'Any region', bCo: '', bContact: '', siPhone: '', siPass: '', suName: '', suPhone: '', suPass: '', suRegion: 'Oshikoto', oPrice: '', oQty: '' };
const U = (id) => `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=800&q=70`;
const CAT_IMG = { Grains: U('1651667343153-6dc318e27e41'), Legumes: U('1545036584-64f4c5c75467'), Vegetables: U('1634467524884-897d0af5e104'), Livestock: U('1593750187970-84858a2aaf5e'), Fruit: U('1630960411440-10f7b59717ba'), Poultry: U('1556316918-880f9e893822'), Honey: U('1587049352851-8d4e89133924'), Feed: U('1696441567861-6761b9e503a6'), Equipment: U('1594771804886-a933bb2d609b') };
const LAND_IMG = U('1509099381441-ea3c0cf98b94');
const PL = { bird: 'birds', jar: 'jars', bucket: 'buckets', hour: 'hours', unit: 'units', bale: 'bales', box: 'boxes', crate: 'crates', tonne: 'tonnes' };
const I = (id) => `assets/icons/${id}.svg`;
const DIST = { Windhoek: 430, 'Walvis Bay': 560, Oshakati: 250, Rundu: 280, 'Katima Mulilo': 790 };
const AVA = ['#7FA146', '#2E5E2F', '#C7A751', '#5B6657', '#8C7431', '#5E8A3C', '#1F4221'];
const ava = (id) => AVA[[...String(id || 'x')].reduce((a, c) => a + c.charCodeAt(0), 0) % AVA.length];
const MON = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const dShort = (t) => { const d = new Date(t); return d.getDate() + ' ' + MON[d.getMonth()]; };
const hhmm = (t) => new Date(t).toTimeString().slice(0, 5);
const ago = (t) => {
  const m = Math.max(0, Math.round((Date.now() - new Date(t).getTime()) / 60000));
  if (m < 1) return 'Just now'; if (m < 60) return m + ' min ago';
  const h = Math.round(m / 60); if (h < 24) return h + ' h ago';
  const d = Math.round(h / 24); if (d === 1) return 'Yesterday'; if (d < 7) return d + ' days ago';
  return dShort(t);
};
const mins = (t) => Math.max(0, Math.round((Date.now() - new Date(t).getTime()) / 60000));
const initialsOf = (n) => String(n || '?').split(' ').filter(Boolean).map((x) => x[0]).slice(0, 2).join('').toUpperCase();
const nextDays = () => { const out = []; const d = new Date(); for (let i = 1; out.length < 6; i++) { const x = new Date(d.getTime() + i * 86400000); if (x.getDay() !== 0) out.push(DAYS[x.getDay()] + ' ' + x.getDate() + ' ' + MON[x.getMonth()]); } return out; };
const COURSES = [
  { id: 1, title: 'Storing grain without losses', lessons: 6, done: 2, mins: 40 },
  { id: 2, title: 'Pricing your harvest', lessons: 5, done: 0, mins: 35 },
  { id: 3, title: 'Goat health basics', lessons: 8, done: 0, mins: 55 },
  { id: 4, title: 'Selling to exporters', lessons: 7, done: 0, mins: 60 },
];

const DEMO = {
  user: 'Paulus Indongo', role: 'Farmer', prPhone: '081 234 5678', prRegion: 'Oshikoto', prLang: 'English', avatar: '',
  threads: [
    { id: 1, name: 'Maria Kahumba', bg: '#7FA146', role: 'Buyer · Ohangwena', go: 'market', unread: true, msgs: [[0, 'Hello, I saw your groundnuts listing.', '09:12'], [1, 'Hi Maria, yes. 800 kg available, roasting grade.', '09:20'], [0, 'Can you deliver the groundnuts on Friday?', '09:41']] },
    { id: 2, name: 'Johannes Shikongo', bg: '#2E5E2F', role: 'Buyer · Windhoek', go: 'deal', unread: true, msgs: [[1, 'I can do NAD 17.50 per kg for 500 kg.', '08:02'], [0, 'Offer accepted. Funds are in escrow.', '08:47']] },
    { id: 3, name: 'Namib Haulage', bg: '#C7A751', role: 'Transporter · AgriHaul', go: 'haul', unread: true, msgs: [[0, 'Booking confirmed: 2,500 kg to Windhoek.', '07:10'], [0, 'Truck arrives in Oshakati at 07:00.', '07:11']] },
    { id: 4, name: 'Selma Nghipandulwa', bg: '#5B6657', role: 'Farmer · Omusati', go: 'community', unread: false, msgs: [[1, 'Plant mahangu after the first 20 mm of rain.', 'Yesterday'], [0, 'Thanks for the mahangu tips!', 'Yesterday']] },
  ],
  listings: [
    { id: 1, name: "Groundnuts, roasting grade", region: "Ohangwena", price: 18.5, unit: 'kg', qty: 800, grade: 'Grade A', cat: 'Legumes', img: U('1545036584-64f4c5c75467'), seller: "Maria Kahumba", rating: '4.9', trades: 41, posted: '2 h ago', age: 120 },
    { id: 2, name: "White maize, 50 kg bags", region: "Oshikoto", price: 8.6, unit: 'kg', qty: 2500, grade: 'Grade A', cat: 'Grains', img: U('1651667343153-6dc318e27e41'), seller: "Namwandi Farms", rating: '4.8', trades: 63, posted: '35 min ago', age: 35, featured: true },
    { id: 7, name: "Roma tomatoes", region: "Kavango East", price: 14, unit: 'kg', qty: 900, grade: 'Grade A', cat: 'Vegetables', img: U('1485637701894-09ad422f6de6'), seller: "Mbunza Growers Co-op", rating: '4.7', trades: 112, posted: '1 h ago', age: 60 },
    { id: 5, name: "Boer goats, weaned kids", region: "Hardap", price: 2400, unit: 'head', qty: 14, grade: 'Vet checked', cat: 'Livestock', img: U('1593750187970-84858a2aaf5e'), seller: "Ben Isaacs", rating: '4.9', trades: 27, posted: '3 h ago', age: 180, featured: true },
    { id: 9, name: "Valencia oranges", region: "Kavango East", price: 9.5, unit: 'kg', qty: 1500, grade: 'Grade A', cat: 'Fruit', img: U('1630960411440-10f7b59717ba'), seller: "Musese Citrus", rating: '4.6', trades: 38, posted: '5 h ago', age: 300 },
    { id: 4, name: "Pearl millet (mahangu)", region: "Omusati", price: 11.2, unit: 'kg', qty: 1200, grade: 'Grade A', cat: 'Grains', img: U('1694654359031-e2db00bd0e93'), seller: "Selma Amutenya", rating: '4.8', trades: 19, posted: '6 h ago', age: 360 },
    { id: 16, name: "Dorper lambs", region: "//Karas", price: 2100, unit: 'head', qty: 40, grade: 'Vet checked', cat: 'Livestock', img: U('1614183653806-b4b9daed1954'), seller: "Aus Karoo Farming", rating: '4.9', trades: 86, posted: '8 h ago', age: 480 },
    { id: 10, name: "Green peppers", region: "Hardap", price: 22, unit: 'kg', qty: 300, grade: 'Grade A', cat: 'Vegetables', img: U('1596650499077-17bc92afd85f'), seller: "Hardap Irrigation Scheme", rating: '4.5', trades: 54, posted: 'Yesterday', age: 1440 },
    { id: 3, name: "Sweetcorn, fresh cobs", region: "Khomas", price: 12, unit: 'kg', qty: 600, grade: 'Grade A', cat: 'Vegetables', img: U('1634467524884-897d0af5e104'), seller: "Kapps Farm", rating: '4.7', trades: 22, posted: 'Yesterday', age: 1500 },
    { id: 17, name: "Yellow maize, on the cob", region: "Zambezi", price: 6.8, unit: 'kg', qty: 4000, grade: 'Grade B', cat: 'Grains', img: U('1649251037566-6881b4956615'), seller: "Sibbinda Farmers Group", rating: '4.4', trades: 31, posted: 'Yesterday', age: 1600 },
    { id: 14, name: "Dairy heifers, Holstein cross", region: "Khomas", price: 14500, unit: 'head', qty: 6, grade: 'Vet checked', cat: 'Livestock', img: U('1614366019077-74906d121985'), seller: "Seeis Dairy", rating: '4.8', trades: 12, posted: '2 days ago', age: 2900 },
    { id: 11, name: "Mixed veg box, 10 kg", region: "Khomas", price: 165, unit: 'box', qty: 80, grade: 'Grade A', cat: 'Vegetables', img: U('1591586116988-62fe65164f8d'), seller: "Brakwater Gardens", rating: '4.9', trades: 140, posted: '2 days ago', age: 3000 },
    { id: 6, name: "Sugar beans, dry", region: "Kavango East", price: 24, unit: 'kg', qty: 350, grade: 'Grade B', cat: 'Legumes', img: U('1613728913293-c99bb00ef39c'), seller: "Rundu Agri Traders", rating: '4.3', trades: 17, posted: '2 days ago', age: 3100 },
    { id: 15, name: "Indigenous goats, mixed", region: "Kunene", price: 1650, unit: 'head', qty: 30, grade: 'Vet checked', cat: 'Livestock', img: U('1622837699015-9a4cb8b7a94b'), seller: "Opuwo Livestock Assoc.", rating: '4.6', trades: 44, posted: '3 days ago', age: 4300 },
    { id: 12, name: "Carrots, washed", region: "Otjozondjupa", price: 13, unit: 'kg', qty: 500, grade: 'Grade A', cat: 'Vegetables', img: U('1687199129802-3e4cc27baac0'), seller: "Grootfontein Produce", rating: '4.7', trades: 29, posted: '3 days ago', age: 4400 },
    { id: 18, name: "Groundnuts, unshelled", region: "Ohangwena", price: 15, unit: 'kg', qty: 1100, grade: 'Not scanned', cat: 'Legumes', img: U('1724058663142-e6e1a5e89f2d'), seller: "Eenhana Women Farmers", rating: '4.8', trades: 23, posted: '4 days ago', age: 5800 },
    { id: 19, name: "Cowpeas, 25 kg bags", region: "Oshana", price: 19, unit: 'kg', qty: 700, grade: 'Grade A', cat: 'Legumes', img: U('1709109021101-60477581a092'), seller: "Ongwediva Grain Store", rating: '4.5', trades: 58, posted: '4 days ago', age: 6000 },
    { id: 13, name: "Boer goats, breeding does", region: "Otjozondjupa", price: 3200, unit: 'head', qty: 10, grade: 'Vet checked', cat: 'Livestock', img: U('1560819400-434c188f63ef'), seller: "Otavi Boer Goat Stud", rating: '5.0', trades: 33, posted: '5 days ago', age: 7200 },
    { id: 20, name: "Free-range layers, point of lay", region: "Khomas", price: 95, unit: 'bird', qty: 120, grade: 'Vet checked', cat: 'Poultry', img: U('1556316918-880f9e893822'), seller: "Dordabis Poultry", rating: '4.8', trades: 74, posted: '50 min ago', age: 50 },
    { id: 21, name: "Broilers, live, 6 weeks", region: "Oshana", price: 75, unit: 'bird', qty: 400, grade: 'Vet checked', cat: 'Poultry', img: U('1694854038360-56b29a16fb0c'), seller: "Ongwediva Broiler Co-op", rating: '4.6', trades: 131, posted: '4 h ago', age: 240, featured: true },
    { id: 22, name: "Indigenous chickens", region: "Ohangwena", price: 120, unit: 'bird', qty: 60, grade: 'Not scanned', cat: 'Poultry', img: U('1731328966800-b677e4fcda8d'), seller: "Helvi Shikongo", rating: '4.9', trades: 15, posted: 'Yesterday', age: 1480 },
    { id: 23, name: "Boschveld roosters", region: "Hardap", price: 140, unit: 'bird', qty: 25, grade: 'Vet checked', cat: 'Poultry', img: U('1619598951257-68e45c835908'), seller: "Maltahöhe Smallholders", rating: '4.7', trades: 20, posted: '3 days ago', age: 4200 },
    { id: 24, name: "Raw honey, 500 g jars", region: "Zambezi", price: 85, unit: 'jar', qty: 150, grade: 'Lab tested', cat: 'Honey', img: U('1587049352851-8d4e89133924'), seller: "Bwabwata Beekeepers", rating: '4.9', trades: 88, posted: '2 h ago', age: 130, featured: true },
    { id: 25, name: "Cut honeycomb", region: "Kavango West", price: 120, unit: 'kg', qty: 40, grade: 'Lab tested', cat: 'Honey', img: U('1642067958024-1a2d9f836920'), seller: "Nkurenkuru Apiary", rating: '4.8', trades: 26, posted: 'Yesterday', age: 1550 },
    { id: 26, name: "Bulk honey, 25 kg bucket", region: "Otjozondjupa", price: 2250, unit: 'bucket', qty: 12, grade: 'Lab tested', cat: 'Honey', img: U('1613548058193-1cd24c1bebcf'), seller: "Waterberg Honey Farm", rating: '4.7', trades: 41, posted: '4 days ago', age: 5900 },
    { id: 27, name: "Tractor hire, 75 hp with plough", region: "Oshikoto", price: 650, unit: 'hour', qty: 40, grade: 'Serviced', cat: 'Equipment', img: U('1594771804886-a933bb2d609b'), seller: "Frans Haufiku", rating: '4.8', trades: 57, posted: '1 h ago', age: 70 },
    { id: 28, name: "Used tractor, 2WD, 4,200 hrs", region: "Khomas", price: 185000, unit: 'unit', qty: 1, grade: 'Inspected', cat: 'Equipment', img: U('1563201515-adbe35c669c5'), seller: "Windhoek Agri Mechanics", rating: '4.5', trades: 33, posted: '2 days ago', age: 3050 },
    { id: 29, name: "Combine harvester hire", region: "Zambezi", price: 2800, unit: 'ha', qty: 120, grade: 'Serviced', cat: 'Equipment', img: U('1635174815612-fd9636f70146'), seller: "Katima Contract Harvesting", rating: '4.6', trades: 19, posted: '3 days ago', age: 4350 },
    { id: 30, name: "Disc harrow, 20 disc", region: "Otjozondjupa", price: 38000, unit: 'unit', qty: 2, grade: 'Inspected', cat: 'Equipment', img: U('1507662228758-08d030c4820b'), seller: "Grootfontein Implements", rating: '4.4', trades: 12, posted: '5 days ago', age: 7300 },
    { id: 31, name: "Lucerne bales", region: "Hardap", price: 95, unit: 'bale', qty: 600, grade: 'Grade A', cat: 'Feed', img: U('1696441567861-6761b9e503a6'), seller: "Hardap Lucerne Growers", rating: '4.8', trades: 96, posted: '5 h ago', age: 310 },
    { id: 32, name: "Veld hay, round bales", region: "Omaheke", price: 450, unit: 'bale', qty: 80, grade: 'Grade B', cat: 'Feed', img: 'https://images.unsplash.com/9/fields.jpg?auto=format&fit=crop&w=800&q=70', seller: "Gobabis Farmers Union", rating: '4.5', trades: 38, posted: '2 days ago', age: 3200 },
    { id: 33, name: "Street-market tomatoes, crates", region: "Zambezi", price: 210, unit: 'crate', qty: 45, grade: 'Grade B', cat: 'Vegetables', img: U('1734255026082-82fdc81991f0'), seller: "Katima Open Market Traders", rating: '4.3', trades: 64, posted: '6 h ago', age: 370 },
    { id: 34, name: "Mixed fruit, market boxes", region: "Khomas", price: 240, unit: 'box', qty: 50, grade: 'Grade A', cat: 'Fruit', img: U('1488459716781-31db52582fe9'), seller: "Soweto Market Fresh", rating: '4.6', trades: 77, posted: 'Yesterday', age: 1420 },
  ],
  posts: [
    { id: 'a', tag: 'Storage', title: 'Hermetic bags cut my maize losses a lot', author: 'Johannes Nghifindaka', date: '22 Sep 2026', body: 'Two seasons ago weevils took almost a quarter of what I stored. I switched to hermetic bags and a cheap moisture meter. This year I lost maybe three bags out of sixty. Happy to show anyone in Oshikoto how I set it up.', likes: 47, comments: 12 },
    { id: 'b', tag: 'Selling', title: 'Held out on DealWise and got my price', author: 'Maria Kahumba', date: '19 Sep 2026', body: 'The first offer on my groundnuts was low. DealWise showed what similar lots had sold for, so I countered instead of accepting. The buyer came up NAD 1.40 a kilo. I would have taken the first offer last year.', likes: 89, comments: 23 },
    { id: 'c', tag: 'Livestock', title: 'Anyone else seeing pulpy kidney in weaners?', author: 'Ben Isaacs', date: '17 Sep 2026', body: 'Lost two Boer kids this month after moving them onto better grazing. The vet on the platform thinks it is pulpy kidney and says vaccinate the rest now. Where are people getting the vaccine near Mariental?', likes: 21, comments: 9 },
  ],
  lands: [
    { id: 1, place: 'Mangetti, Kavango West', ha: '12 ha', features: 'Borehole, fenced, sandy loam. Last planted 2022.', terms: 'Harvest share, 25%', img: U('1693672843111-7c74d07a9410') },
    { id: 2, place: 'Outjo district', ha: '40 ha', features: 'Grazing with two kraals. Water point on the boundary.', terms: 'Fixed rent, NAD 180/ha', img: U('1597214189145-b8365985d50a') },
    { id: 3, place: 'Hardap scheme', ha: '4 ha', features: 'Canal irrigation, flat, 20 min from Mariental.', terms: 'Profit share, 40%', img: U('1567497063796-7952e455a2a6') },
  ],
  loans: [{ id: 1, label: 'Seed loan', amount: 15000, repay: 16150, harvest: 'Mahangu, May 2027', status: 'Active' }],
  barters: [
    { id: 1, who: 'Selma Amutenya', region: 'Oshana', have: '6 bags of mahangu', want: 'Two days of tractor ploughing' },
    { id: 2, who: 'Tjiuai Farming Co-op', region: 'Otjozondjupa', have: 'Lucerne bales, about 40', want: 'Weaned goats' },
    { id: 3, who: 'Frans Haufiku', region: 'Oshikoto', have: 'Borehole pump repair', want: 'Maize, 200 kg' },
  ],
  bookings: [],
  entries: [
    { id: 1, type: 'in', desc: 'White maize, Namib Grain Traders', amount: 21500, date: '26 Sep' },
    { id: 2, type: 'in', desc: 'Goats x5, Hardap buyer', amount: 13100, date: '11 Aug' },
    { id: 3, type: 'in', desc: 'Groundnuts, Oshakati Fresh', amount: 11200, date: '2 Jul' },
    { id: 4, type: 'out', desc: 'Mahangu seed', amount: 3400, date: '14 Sep' },
    { id: 5, type: 'out', desc: 'Fuel and tractor hire', amount: 2800, date: '9 Sep' },
    { id: 6, type: 'out', desc: 'Hermetic bags x60', amount: 1650, date: '30 Jun' },
  ],
  disputes: [{ id: 'DS-1182', deal: 'Tomatoes to Rundu Fresh Market', reason: 'Late payment', status: 'Resolved', note: 'Buyer paid in full plus a late fee of NAD 120.' }],
  alerts: [
    { id: 1, what: '3 Nguni cows, brand IP-44', where: 'Near Omuthiya, Oshikoto', when: '2 days ago', status: 'Police notified' },
    { id: 2, what: 'Water pump, Grundfos, blue', where: 'Tsumeb farms road', when: '5 days ago', status: 'Open' },
  ],
  courses: COURSES,
  activity: [
    { t: 'Namib Grain Traders paid NAD 21,500 into escrow for your white maize', d: 'Today, 06:52', c: '#2E5E2F' },
    { t: 'QualityScan graded your mahangu sample Grade A', d: 'Yesterday, 16:10', c: '#9BBC5F' },
    { t: 'New offer on groundnuts from Oshakati Fresh', d: 'Yesterday, 11:25', c: '#C7A751' },
    { t: 'Barter completed: 4 bags of millet for a day of tractor hire', d: '24 Sep', c: '#5E8A3C' },
    { t: 'Harvest Finance seed loan of NAD 15,000 approved', d: '20 Sep', c: '#1F4221' },
  ],
};
const demoCopy = () => JSON.parse(JSON.stringify(DEMO));
const EMPTY = { threads: [], listings: [], posts: [], lands: [], loans: [], barters: [], bookings: [], entries: [], disputes: [], alerts: [], courses: COURSES, activity: [] };

class Component extends DCLogic {
  state = {
    ...KEYS, ...demoCopy(), hDate: nextDays()[0], mode: null, device: null, page: 'home', screen: 'dashboard', w: 1280, menu: false, more: false,
    q: '', cat: 'All', sort: 'new', dealId: 2, stage: 'open', scan: 'idle', crop: 'Pearl millet (mahangu)', arr: 'harvest',
    amount: 25000, hIdx: 0, liked: {}, rsvp: false,
    modal: null, err: '', toast: '', panel: null, search: false, saved: {}, thread: null, draft: '', typing: null,
    chR: 6, chM: 'sales', chI: null, cur: null, nt: { offers: true, pay: true, theft: true, tips: false }, chn: { sms: true, wa: true, email: false }, twoFa: false, suPhoto: '', suFile: null, topQ: '', chatRead: false, notifRead: false, contactSent: false, buyerSent: false, offered: {}, seen: {}, requested: {},
    live: false, demo: false, guest: false, me: null, busy: false, booting: true,
    offers: [], scans: [], interest: {}, notifs: [], buyerReqs: [], counters: {}, scImg: '', scFile: null, mFile: null, manage: null, counts: {},
  };

  setFrame(el) {
    if (this._ro) this._ro.disconnect();
    this._el = el;
    this._ro = new ResizeObserver(() => this.measure());
    this._ro.observe(el);
  }
  measure = () => {
    const el = document.querySelector('[data-frame="1"]');
    if (!el) return;
    if (el !== this._el) this.setFrame(el);
    const w = Math.round(el.clientWidth);
    if (w && w !== this.state.w) this.setState({ w });
  };
  componentDidMount() {
    this.detectCur(); this.measure(); this._poll = setInterval(this.measure, 400); window.addEventListener('resize', this.measure);
    this._hero = setInterval(() => this.setState((s) => ({ heroStage: ((s.heroStage ?? 2) + 1) % 4 })), 2800);
    this.boot();
  }
  componentDidUpdate() { this.measure(); }
  componentWillUnmount() { if (this._ro) this._ro.disconnect(); clearInterval(this._poll); window.removeEventListener('resize', this.measure); [this._t, this._s, this._tt, this._rl].forEach(clearTimeout); clearInterval(this._hero); if (window.AT) window.AT.unsubscribe(); }

  // ---------- live data ----------
  async boot() {
    if (!window.AT) { this.setState({ booting: false }); return; }
    window.AT.onAuth((event) => { if (event === 'SIGNED_OUT' && this.state.live) this.leaveLive(); });
    try {
      const sess = await window.AT.session();
      if (sess) { await this.enterLive(sess.user.id); this.go('dashboard'); }
    } catch (e) { console.warn(e); }
    this.setState({ booting: false });
  }
  async enterLive(uid) {
    this.setState({ live: true, demo: false, guest: false, me: uid, ...EMPTY, saved: {}, liked: {}, offered: {}, requested: {}, seen: {} });
    await this.reload();
    window.AT.subscribe(uid, () => { clearTimeout(this._rl); this._rl = setTimeout(() => this.reload(), 400); });
  }
  leaveLive() {
    if (window.AT) window.AT.unsubscribe();
    this.setState({ live: false, me: null, guest: false, demo: false, ...demoCopy(), offers: [], scans: [], interest: {}, notifs: [], buyerReqs: [], saved: {}, liked: {}, offered: {}, requested: {}, seen: {}, thread: null, panel: null, cur: null });
  }
  async loadPublic() {
    const pub = await window.AT.publicData();
    this.setState(this.mapPublic(pub, null, null));
  }
  async reload() {
    const uid = this.state.me; if (!uid) return;
    try {
      const [pub, mine] = await Promise.all([window.AT.publicData(), window.AT.myData(uid)]);
      if (this.state.me !== uid) return;
      this.setState({ ...this.mapPublic(pub, mine, uid), ...this.mapMine(mine, uid) });
    } catch (e) { this.say(e.message); }
  }
  mapPublic(pub, mine, uid) {
    const saved = {}, liked = {}, offered = {}, requested = {};
    if (mine) {
      mine.saved.forEach((x) => (saved[x.listing_id] = true));
      mine.likes.forEach((x) => (liked[x.post_id] = true));
      mine.barterOffers.forEach((x) => (offered[x.barter_id] = true));
      mine.landRequests.forEach((x) => (requested[x.land_id] = true));
    }
    const nm = (p) => (p && p.full_name) || 'AgriTRUST member';
    return {
      saved, liked, offered, requested, counts: pub.counts,
      listings: pub.listings.map((l) => ({ id: l.id, name: l.name, region: l.region, price: Number(l.price), unit: l.unit, qty: Number(l.qty), grade: l.grade, cat: l.cat, img: l.img || CAT_IMG[l.cat] || CAT_IMG.Grains, seller: nm(l.seller), sellerId: l.owner, trades: pub.stats[l.owner] || 0, posted: ago(l.created_at), age: mins(l.created_at), mine: l.owner === uid, created: l.created_at })),
      posts: pub.posts.map((p) => ({ id: p.id, tag: p.tag, title: p.title, author: nm(p.who), authorId: p.author, date: ago(p.created_at), body: p.body, likes: (pub.counts['like:' + p.id] || 0) - (liked[p.id] ? 1 : 0), meta: p.who && p.who.region ? p.who.region : '', mine: p.author === uid })),
      barters: pub.barters.map((b) => ({ id: b.id, who: nm(b.who), ownerId: b.owner, region: b.region, have: b.have, want: b.want, mine: b.owner === uid, n: pub.counts['barter:' + b.id] || 0 })),
      lands: pub.lands.map((p) => ({ id: p.id, place: p.place, ha: Number(p.ha).toLocaleString('en-US') + ' ha', features: p.features || 'Details to follow.', terms: p.terms, img: p.img || LAND_IMG, mine: p.owner === uid, ownerId: p.owner, owner: nm(p.who), n: pub.counts['land:' + p.id] || 0 })),
    };
  }
  mapMine(m, uid) {
    const p = m.profile || {}, v = m.priv || {};
    const seen = {}; m.sightings.forEach((x) => (seen[x.alert_id] = true));
    const interest = {}; m.interest.forEach((x) => (interest[x.course_id] = true));
    const msgs = [...m.messages].reverse();
    const threads = m.threads.map((t) => {
      const other = t.a === uid ? t.pb : t.pa, otherId = t.a === uid ? t.b : t.a;
      const ms = msgs.filter((x) => x.thread_id === t.id);
      return { id: t.id, otherId, name: (other && other.full_name) || 'AgriTRUST member', bg: ava(otherId), role: other ? (other.roles || 'Member') + ' · ' + other.region : 'Member', go: { deal: 'deal', barter: 'barter', land: 'land', theft: 'theft' }[t.topic] || 'market', unread: ms.some((x) => x.sender !== uid && !x.read_at), msgs: ms.map((x) => [x.sender === uid ? 1 : 0, x.body, mins(x.created_at) < 1440 ? hhmm(x.created_at) : dShort(x.created_at)]), last: ms.length ? ms[ms.length - 1].created_at : t.created_at };
    }).filter((t) => t.msgs.length || t.id === this.state.thread);
    const offers = m.offers.map((o) => ({ ...o, price: Number(o.price), qty: Number(o.qty), iAmBuyer: o.buyer === uid, other: o.buyer === uid ? o.sellerP : o.buyerP, otherId: o.buyer === uid ? o.seller : o.buyer }));
    const entries = m.entries.map((e) => ({ id: e.id, type: e.type, desc: e.description, amount: Number(e.amount), date: dShort(e.entry_date), at: e.entry_date }));
    const act = [];
    offers.slice(0, 6).forEach((o) => act.push({ t: (o.iAmBuyer ? 'Your offer on ' : 'Offer on your ') + (o.listing ? o.listing.name : 'listing') + ': ' + o.status, at: o.updated_at, c: '#C7A751' }));
    m.entries.slice(0, 6).forEach((e) => act.push({ t: (e.type === 'in' ? 'Income recorded: ' : 'Cost recorded: ') + e.description, at: e.created_at, c: e.type === 'in' ? '#2E5E2F' : '#8C4A3A' }));
    m.disputes.slice(0, 3).forEach((x) => act.push({ t: 'Dispute ' + x.ref + ' opened', at: x.created_at, c: '#B24A3A' }));
    m.loans.slice(0, 3).forEach((x) => act.push({ t: 'Harvest Finance application sent', at: x.created_at, c: '#1F4221' }));
    m.hauls.slice(0, 3).forEach((x) => act.push({ t: 'Truck requested to ' + x.destination, at: x.created_at, c: '#5E8A3C' }));
    act.sort((a, b) => new Date(b.at) - new Date(a.at));
    return {
      user: p.full_name || 'Farmer', role: p.roles || 'Farmer', prRegion: p.region || 'Khomas', avatar: p.avatar_url || '', prPhone: window.AT.prettyPhone(v.phone), prLang: v.language || 'English',
      cur: v.currency || null, nt: v.notify || this.state.nt, chn: v.channels || this.state.chn, seen, interest,
      threads, offers, entries,
      alerts: m.alerts.map((a) => ({ id: a.id, what: a.what, where: a.place, when: ago(a.created_at), status: a.status, mine: a.owner === uid })),
      disputes: m.disputes.map((x) => ({ id: x.ref, deal: x.deal, reason: x.reason, status: x.status, note: x.note })),
      loans: m.loans.map((x) => ({ id: x.id, label: 'Harvest loan', amount: Number(x.amount), repay: Number(x.repay), harvest: x.harvest, status: x.status })),
      bookings: m.hauls.map((x) => ({ id: x.ref, route: x.origin + ' to ' + x.destination, load: Number(x.load_kg).toLocaleString('en-US') + ' kg', date: x.pickup, cost: x.estimate ? 'about ' + this.money(Number(x.estimate)) : '', status: x.status })),
      scans: m.scans.map((x) => ({ id: x.id, crop: x.crop, img: x.img, status: x.status, result: x.result || '', when: ago(x.created_at) })),
      notifs: m.notifications, buyerReqs: m.buyerRequests,
      activity: act.slice(0, 6).map((a) => ({ t: a.t, d: ago(a.at), c: a.c })),
    };
  }
  async run(fn, okMsg) {
    if (this.state.busy) return;
    this.setState({ busy: true });
    try { await fn(); if (okMsg) this.say(okMsg); } catch (e) { this.setState({ err: e.message }); this.say(e.message); }
    this.setState({ busy: false });
  }
  needLive(label) {
    if (this.state.live || this.state.demo) return true;
    this.page('signin'); this.say('Please sign in or create a free account to ' + label + '.');
    return false;
  }

  // ---------- navigation ----------
  top() { if (this._el) this._el.scrollTop = 0; }
  go = (screen) => {
    const s = this.state;
    if (!s.live && !s.demo) {
      if (s.guest && screen === 'market') return this.setState({ mode: 'app', screen, more: false, menu: false, panel: null }, () => this.top());
      if (s.guest) { this.page('signin'); return this.say('Sign in or create a free account to use the rest of AgriTRUST.'); }
      this.setState({ demo: true, ...demoCopy() });
    }
    this.setState({ mode: 'app', screen, more: false, menu: false, panel: null, search: false }, () => this.top());
  };
  browseLive = () => {
    if (this.state.live) return this.go('market');
    if (!window.AT) return this.go('market');
    this.setState({ guest: true, demo: false, ...EMPTY, mode: 'app', screen: 'market', menu: false, cat: 'All', q: '' }, () => this.top());
    this.loadPublic().catch((e) => this.say(e.message));
  };
  page = (page) => this.setState({ mode: 'site', page, menu: false }, () => this.top());
  CUR = { USD: ['$', 1 / 18, 'US dollar'], NAD: ['N$', 1, 'Namibian dollar'], ZAR: ['R', 1, 'South African rand'], BWP: ['P', 0.75, 'Botswana pula'], ZMW: ['K', 1.45, 'Zambian kwacha'], AOA: ['Kz ', 50, 'Angolan kwanza'], KES: ['KSh ', 7.2, 'Kenyan shilling'], NGN: ['₦', 85, 'Nigerian naira'], EUR: ['€', 0.048, 'Euro'], GBP: ['£', 0.042, 'British pound'] };
  C2C = { US: 'USD', NA: 'NAD', ZA: 'ZAR', BW: 'BWP', ZM: 'ZMW', AO: 'AOA', KE: 'KES', NG: 'NGN', GB: 'GBP', DE: 'EUR', FR: 'EUR', ES: 'EUR', IT: 'EUR', NL: 'EUR', PT: 'EUR', BE: 'EUR', AT: 'EUR', IE: 'EUR', FI: 'EUR', GR: 'EUR', LU: 'EUR' };
  TZ2C = { 'Africa/Windhoek': 'NA', 'Africa/Johannesburg': 'ZA', 'Africa/Gaborone': 'BW', 'Africa/Lusaka': 'ZM', 'Africa/Luanda': 'AO', 'Africa/Nairobi': 'KE', 'Africa/Lagos': 'NG', 'Europe/London': 'GB' };
  cc() { return (this.CUR[this.state.cur] && this.state.cur) || this.state.curAuto || 'USD'; }
  rate() { return this.CUR[this.cc()][1]; }
  detectCur() {
    let cn = null;
    try { const tz = Intl.DateTimeFormat().resolvedOptions().timeZone || ''; cn = this.TZ2C[tz] || (tz.startsWith('America/New_York') || tz.startsWith('America/Chicago') || tz.startsWith('America/Denver') || tz.startsWith('America/Los_Angeles') ? 'US' : tz.startsWith('Europe/') ? 'DE' : null); } catch (e) {}
    if (!cn) { const m = (navigator.language || '').match(/-([A-Z]{2})$/i); if (m && this.C2C[m[1].toUpperCase()]) cn = m[1].toUpperCase(); }
    if (cn && this.C2C[cn]) this.setState({ curAuto: this.C2C[cn], curWhere: cn });
  }
  money(n, dec) { const [sym, r] = this.CUR[this.cc()]; const v = Number(n) * r; const d = dec != null ? dec : (Math.abs(v) < 100 && v % 1 ? 2 : 0); return (v < 0 ? '-' : '') + sym + Math.abs(v).toLocaleString('en-US', { minimumFractionDigits: d, maximumFractionDigits: d }); }
  cvt(v, depth) {
    if (typeof v === 'string') return v.indexOf('NAD') < 0 ? v : v.replace(/NAD ([\d,]+(?:\.\d+)?)/g, (_, num) => this.money(+num.replace(/,/g, ''), num.includes('.') ? 2 : null)).replace(/\(NAD\)/g, '(' + this.cc() + ')');
    if (!v || typeof v !== 'object' || depth > 7 || v.$$typeof) return v;
    if (Array.isArray(v)) return v.map((x) => this.cvt(x, depth + 1));
    if (Object.getPrototypeOf(v) !== Object.prototype) return v;
    const o = {}; for (const k in v) o[k] = this.cvt(v[k], depth + 1); return o;
  }
  say(msg) { clearTimeout(this._tt); this.setState({ toast: msg }); this._tt = setTimeout(() => this.setState({ toast: '' }), 3600); }
  act(t, c) { if (this.state.live) return; this.setState((s) => ({ activity: [{ t, d: 'Just now', c: c || '#2E5E2F' }, ...s.activity] })); }
  open(modal, preset) { this.setState({ modal, err: '', mTitle: '', mPrice: '', mQty: '', mBody: '', mHave: '', mWant: '', mDesc: '', mName: '', mPhone: '', mPlace: '', mHa: '', mItem: '', mPass: '', mImg: '', mFile: null, ...(preset || {}) }); }
  close = () => this.setState({ modal: null, err: '' });
  async openThread(id) {
    this.setState((st) => ({ thread: id, panel: null, threads: st.threads.map((t) => (t.id === id ? { ...t, unread: false } : t)) }));
    this.go('messages');
    if (this.state.live) { await window.AT.markThreadRead(id, this.state.me); }
  }
  async chatWith(otherId, topic, name) {
    if (!this.state.live) return;
    const id = await window.AT.openThread(otherId, topic);
    if (!this.state.threads.some((t) => t.id === id)) {
      this.setState((st) => ({ threads: [{ id, otherId, name: name || 'AgriTRUST member', bg: ava(otherId), role: 'Member', go: topic === 'chat' ? 'market' : topic, unread: false, msgs: [] }, ...st.threads] }));
    }
    this.openThread(id);
  }
  sendMsg() {
    const s = this.state, txt = s.draft.trim(); if (!txt) return;
    if (s.live) {
      const id = s.thread || (s.threads[0] && s.threads[0].id); if (!id) return;
      const now = hhmm(Date.now());
      this.setState((st) => ({ draft: '', thread: id, threads: st.threads.map((t) => (t.id === id ? { ...t, msgs: [...t.msgs, [1, txt, now]] } : t)) }));
      window.AT.insert('messages', { thread_id: id, body: txt }, 'Your message did not send. Please try again.').catch((e) => this.say(e.message));
      return;
    }
    const id = s.thread || s.threads[0].id;
    const now = new Date().toTimeString().slice(0, 5);
    this.setState((st) => ({ draft: '', thread: id, typing: id, threads: st.threads.map((t) => (t.id === id ? { ...t, msgs: [...t.msgs, [1, txt, now]] } : t)) }));
    const R = ['Thank you, noted.', 'Sounds good. I will confirm by this evening.', 'Can you share a QualityScan report first?', 'Okay, let us do it through escrow.', 'Perfect. See you then.'];
    clearTimeout(this._rt); this._rt = setTimeout(() => this.setState((st) => ({ typing: null, threads: st.threads.map((t) => (t.id === id ? { ...t, msgs: [...t.msgs, [0, R[(t.msgs.length) % R.length], new Date().toTimeString().slice(0, 5)]] } : t)) })), 1600);
  }
  need(...k) { const miss = k.filter((x) => !String(this.state[x] ?? '').trim()); if (miss.length) { this.setState({ err: 'Please fill in the required fields.' }); return false; } return true; }

  submit = () => {
    const s = this.state, id = Date.now();
    if (s.live) return this.submitLive();
    if (s.modal === 'listing') {
      if (!this.need('mTitle', 'mPrice', 'mQty')) return;
      if (isNaN(+s.mPrice) || isNaN(+s.mQty)) return this.setState({ err: 'Price and quantity must be numbers.' });
      this.setState({ listings: [{ id, name: s.mTitle, region: s.mRegion, price: +s.mPrice / this.rate(), unit: s.mUnit, qty: +s.mQty, grade: 'Not scanned', cat: s.mCat, img: s.mImg || CAT_IMG[s.mCat], mine: true, seller: s.user, rating: 'New', trades: 0, posted: 'Just now', age: 0 }, ...s.listings], modal: null, cat: 'All', q: '', mImg: '' });
      this.act(`You listed ${s.mTitle} in ${s.mRegion}`, '#9BBC5F'); this.say('Your listing is live on the Marketplace.'); this.go('market');
    } else if (s.modal === 'post') {
      if (!this.need('mTitle', 'mBody')) return;
      this.setState({ posts: [{ id: 'p' + id, tag: s.mTag, title: s.mTitle, author: s.user, date: 'Just now', body: s.mBody, likes: 0, comments: 0 }, ...s.posts], modal: null });
      this.say('Posted to the Community.');
    } else if (s.modal === 'barter') {
      if (!this.need('mHave', 'mWant')) return;
      this.setState({ barters: [{ id, who: s.user, region: s.mRegion, have: s.mHave, want: s.mWant, mine: true }, ...s.barters], modal: null });
      this.act(`Barter request posted: ${s.mHave} for ${s.mWant}`, '#5E8A3C'); this.say('Barter request posted.');
    } else if (s.modal === 'dispute') {
      if (!this.need('mItem', 'mDesc')) return;
      const ref = 'DS-' + String(id).slice(-4);
      this.setState({ disputes: [{ id: ref, deal: s.mItem, reason: s.mReason, status: 'Under review', note: 'A case officer will reply within 48 hours. Escrow funds stay frozen until then.' }, ...s.disputes], modal: null });
      this.act(`Dispute ${ref} opened`, '#B24A3A'); this.say(`Dispute ${ref} opened. We will be in touch within 48 hours.`);
    } else if (s.modal === 'theft') {
      if (!this.need('mItem', 'mPlace')) return;
      this.setState({ alerts: [{ id, what: s.mItem, where: s.mPlace, when: 'Just now', status: 'Reported by you' }, ...s.alerts], modal: null });
      this.act(`Theft alert sent: ${s.mItem}`, '#B24A3A'); this.say('Alert sent to farmers and agents within 50 km.');
    } else if (s.modal === 'agent') {
      if (!this.need('mName', 'mPhone')) return;
      if (s.demo) { this.setState({ modal: null }); return this.say(`Thanks ${s.mName.split(' ')[0]}. This is the demo, so no request was sent.`); }
      this.run(async () => {
        await window.AT.insert('agent_requests', { name: s.mName.trim(), phone: s.mPhone.trim(), region: s.mRegion }, 'Your request did not send. Please try again.');
        this.setState({ modal: null });
      }, `Thanks ${s.mName.split(' ')[0]}. We will call you to arrange an agent in ${s.mRegion}.`);
    } else if (s.modal === 'land') {
      if (!this.need('mPlace', 'mHa')) return;
      this.setState({ lands: [{ id, place: s.mPlace, ha: s.mHa + ' ha', features: s.mDesc || 'Details to follow.', terms: s.mTerms, img: LAND_IMG, mine: true }, ...s.lands], modal: null });
      this.act(`You listed ${s.mHa} ha on LandShare`, '#8C7431'); this.say('Your land is listed. Farmers can now apply.');
    } else if (s.modal === 'password' || s.modal === 'mine') {
      this.setState({ modal: null }); this.say('This is the demo, so nothing was changed.');
    }
  };

  submitLive() {
    const s = this.state, AT = window.AT, num = (x) => +String(x).replace(/,/g, '').trim();
    if (s.modal === 'listing') {
      if (!this.need('mTitle', 'mPrice', 'mQty')) return;
      if (!(num(s.mPrice) > 0) || !(num(s.mQty) > 0)) return this.setState({ err: 'Price and quantity must be numbers above zero.' });
      return this.run(async () => {
        const img = s.mFile ? await AT.upload(s.me, 'listings', s.mFile) : null;
        await AT.insert('listings', { name: s.mTitle.trim(), cat: s.mCat, region: s.mRegion, price: Math.round(num(s.mPrice) / this.rate() * 100) / 100, unit: s.mUnit, qty: num(s.mQty), img }, 'Your listing did not save. Please try again.');
        this.setState({ modal: null, cat: 'All', q: '', mImg: '', mFile: null });
        await this.reload(); this.go('market');
      }, 'Your listing is live on the Marketplace.');
    }
    if (s.modal === 'post') {
      if (!this.need('mTitle', 'mBody')) return;
      return this.run(async () => { await AT.insert('posts', { tag: s.mTag, title: s.mTitle.trim(), body: s.mBody.trim() }); this.setState({ modal: null }); await this.reload(); }, 'Posted to the Community.');
    }
    if (s.modal === 'barter') {
      if (!this.need('mHave', 'mWant')) return;
      return this.run(async () => { await AT.insert('barters', { have: s.mHave.trim(), want: s.mWant.trim(), region: s.mRegion }); this.setState({ modal: null }); await this.reload(); }, 'Barter request posted.');
    }
    if (s.modal === 'dispute') {
      if (!this.need('mItem', 'mDesc')) return;
      const ref = 'DS-' + String(Date.now()).slice(-6);
      return this.run(async () => { await AT.insert('disputes', { ref, deal: s.mItem.trim(), reason: s.mReason, description: s.mDesc.trim() }); this.setState({ modal: null }); await this.reload(); }, `Dispute ${ref} opened. We will reply within two working days.`);
    }
    if (s.modal === 'theft') {
      if (!this.need('mItem', 'mPlace')) return;
      return this.run(async () => { await AT.insert('theft_alerts', { what: s.mItem.trim(), place: s.mPlace.trim(), details: s.mDesc.trim() || null }); this.setState({ modal: null }); await this.reload(); }, 'Alert sent to AgriTRUST members in your region.');
    }
    if (s.modal === 'agent') {
      if (!this.need('mName', 'mPhone')) return;
      return this.run(async () => { await AT.insert('agent_requests', { name: s.mName.trim(), phone: s.mPhone.trim(), region: s.mRegion }); this.setState({ modal: null }); }, `Thanks ${s.mName.split(' ')[0]}. We will call you to arrange an agent in ${s.mRegion}.`);
    }
    if (s.modal === 'land') {
      if (!this.need('mPlace', 'mHa')) return;
      if (!(num(s.mHa) > 0)) return this.setState({ err: 'Hectares must be a number above zero.' });
      return this.run(async () => { await AT.insert('lands', { place: s.mPlace.trim(), ha: num(s.mHa), features: s.mDesc.trim() || null, terms: s.mTerms }); this.setState({ modal: null }); await this.reload(); }, 'Your land is listed. Farmers can now ask to farm it.');
    }
    if (s.modal === 'password') {
      if (String(s.mPass).length < 8) return this.setState({ err: 'Your new password needs at least 8 characters.' });
      return this.run(async () => { await AT.changePassword(s.mPass); this.setState({ modal: null, mPass: '' }); }, 'Password changed.');
    }
    if (s.modal === 'mine') {
      const l = s.manage; if (!l) return this.close();
      return this.run(async () => { await AT.update('listings', { id: l.id }, { status: 'sold' }); this.setState({ modal: null, manage: null }); await this.reload(); }, 'Marked as sold. The listing is no longer shown to buyers.');
    }
  }
  removeListing = () => {
    const l = this.state.manage; if (!l || !this.state.live) return this.close();
    this.run(async () => { await window.AT.update('listings', { id: l.id }, { status: 'removed' }); this.setState({ modal: null, manage: null }); await this.reload(); }, 'Listing removed.');
  };

  // ---------- live DealWise ----------
  sendOffer = () => {
    const s = this.state, l = s.listings.find((x) => x.id === s.dealId);
    if (!l) return this.say('Pick a listing in the Marketplace first.');
    const price = +String(s.oPrice).replace(/,/g, ''), qty = +String(s.oQty).replace(/,/g, '');
    if (!(price > 0) || !(qty > 0)) return this.say('Enter a price and a quantity above zero.');
    if (qty > l.qty) return this.say('The seller has ' + l.qty.toLocaleString('en-US') + ' ' + l.unit + ' available.');
    this.run(async () => {
      await window.AT.insert('offers', { listing_id: l.id, seller: l.sellerId, price: Math.round(price / this.rate() * 100) / 100, qty }, 'Your offer did not send. Please try again.');
      this.setState({ dealId: null, oPrice: '', oQty: '' });
      await this.reload();
    }, 'Offer sent to ' + l.seller + '. You will see their reply here and in your notifications.');
  };
  offerAction(o, action) {
    const AT = window.AT, me = this.state.me;
    const patch = action === 'accept' ? { status: 'agreed' }
      : action === 'decline' ? { status: 'declined' }
      : action === 'withdraw' ? { status: 'withdrawn' }
      : action === 'sign' ? (o.buyer === me ? { buyer_signed: true } : { seller_signed: true })
      : null;
    if (action === 'counter') {
      const v = +String(this.state.counters[o.id] || '').replace(/,/g, '');
      if (!(v > 0)) return this.say('Enter your counter price first.');
      return this.run(async () => { await AT.update('offers', { id: o.id }, { price: Math.round(v / this.rate() * 100) / 100, status: 'countered' }); this.setState((st) => ({ counters: { ...st.counters, [o.id]: '' } })); await this.reload(); }, 'Counter-offer sent.');
    }
    const msg = { accept: 'Terms agreed. Both of you can now sign the agreement.', decline: 'Offer declined. Your listing stays live.', withdraw: 'Offer withdrawn.', sign: 'You signed the agreement.' }[action];
    this.run(async () => { await AT.update('offers', { id: o.id }, patch); await this.reload(); }, msg);
  }

  renderVals() {
    const out = this._rv(), c = this.cc(), names = Object.keys(this.CUR);
    out.showBar = !window.__AGRI_LIVE;
    out.cx = { code: c, k21500: this.money(21500), k25000: this.money(25000), rent: 'Fixed rent, ' + this.money(180) + '/ha', pick: this.state.cur || 'auto', onPick: (e) => this.setState({ cur: e.target.value === 'auto' ? null : e.target.value }),
      opts: [{ v: 'auto', label: 'Auto, by location (' + (this.state.curAuto || 'USD') + ')' }, ...names.map((k) => ({ v: k, label: k + ', ' + this.CUR[k][2] }))],
      note: (this.state.cur ? 'You picked ' + c + '.' : (this.state.curWhere ? 'Detected location: ' + (this.state.curPlace || this.state.curWhere) + '.' : 'Location not detected, showing US dollars.')) + ' Prices are kept in Namibian dollars and converted at approximate rates.' };
    return this.cvt(out, 0);
  }
  _rv() {
    const s = this.state, live = s.live, isDemo = !live;
    const mode = s.mode ?? this.props.startView ?? 'site';
    const device = s.device ?? this.props.device ?? 'desktop';
    const w = s.w, mob = w < 640, tab = w >= 640 && w < 1024, desk = w >= 1024;
    const pick = (m, t, d) => (mob ? m : tab ? t : d);
    const on = {}; Object.keys(KEYS).forEach((k) => (on[k] = (e) => this.setState({ [k]: e.target.value, err: '' })));
    const V = {}; Object.keys(KEYS).forEach((k) => (V[k] = s[k]));

    const F = device === 'desktop'
      ? { w: '100%', h: window.__AGRI_LIVE ? '100vh' : 'calc(100vh - 56px)', pad: '0', r: '0', border: '0', shadow: 'none' }
      : device === 'tablet'
      ? { w: '834px', h: 'min(1112px, calc(100vh - 104px))', pad: '24px', r: '28px', border: '10px solid #1C2A1D', shadow: '0 30px 60px -30px rgba(0,0,0,.5)' }
      : { w: '390px', h: 'min(844px, calc(100vh - 104px))', pad: '24px', r: '44px', border: '10px solid #1C2A1D', shadow: '0 30px 60px -30px rgba(0,0,0,.5)' };

    const L = {
      gutter: pick('20px', '32px', '48px'), navDesk: desk ? 'flex' : 'none', navMob: desk ? 'none' : 'flex',
      heroPad: pick('44px 20px 52px', '64px 32px 72px', '88px 48px 96px'), pageHeroPad: pick('44px 20px', '60px 32px', '80px 48px'),
      heroCols: desk ? '1.1fr .9fr' : 'minmax(0,1fr)', heroImgH: pick('300px', '380px', '460px'),
      h1: pick('40px', '56px', '68px'), lede: pick('17px', '18px', '19px'), h2: pick('30px', '38px', '44px'),
      secPad: pick('56px 20px', '72px 32px', '96px 48px'), ctaPad: pick('32px 24px', '48px 40px', '64px 56px'),
      cols3: pick('minmax(0,1fr)', 'repeat(2,minmax(0,1fr))', 'repeat(3,minmax(0,1fr))'),
      cols4: pick('minmax(0,1fr)', 'repeat(2,minmax(0,1fr))', 'repeat(4,minmax(0,1fr))'),
      cols2: desk ? 'repeat(2,minmax(0,1fr))' : 'minmax(0,1fr)', form2: mob ? 'minmax(0,1fr)' : 'repeat(2,minmax(0,1fr))',
      footCols: pick('1fr 1fr', '2fr 1fr 1fr 1fr', '2fr 1fr 1fr 1fr'),
    };
    const A = {
      pad: pick('16px', '24px', '28px'), mainPad: pick('20px 16px', '24px', '32px 36px'),
      side: desk ? 'flex' : 'none', tabs: tab ? 'flex' : 'none', bottom: mob ? 'flex' : 'none', deskInline: mob ? 'none' : 'inline-flex', brandTxt: mob ? 'none' : 'inline', kpiFs: mob ? '20px' : '26px', msgCols: mob ? 'minmax(0,1fr)' : '320px minmax(0,1fr)', msgH: mob ? '560px' : '620px', two: mob ? '1fr' : '1fr 1fr', topBtnW: mob ? '44px' : '92px', bellW: mob ? '32px' : '40px', avW: mob ? '34px' : '40px', bellGap: mob ? '4px' : '10px', topFs: mob ? '11px' : '12px', mobOnly: mob ? 'inline' : 'none', topCols: mob ? '0px auto minmax(0,1fr)' : 'minmax(0,1fr) auto minmax(0,1fr)', topGap: mob ? '0px' : (tab ? '18px' : '30px'),
      h1: pick('28px', '34px', '38px'), kpi: 'repeat(2,minmax(0,1fr))', kpi4: mob ? 'repeat(2,minmax(0,1fr))' : 'repeat(4,minmax(0,1fr))',
      split: desk ? 'minmax(0,1.6fr) minmax(0,1fr)' : '1fr', half: mob ? '1fr' : 'repeat(2,minmax(0,1fr))',
      cards: pick('1fr', 'repeat(2,minmax(0,1fr))', 'repeat(3,minmax(0,1fr))'), three: mob ? '1fr' : 'repeat(3,minmax(0,1fr))',
      bottomSpace: mob ? '24px' : '0', modalW: mob ? 'calc(100% - 24px)' : '520px',
    };

    const hS = s.heroStage ?? 2;
    const hero = { w: ['14%', '40%', '68%', '100%'][hS], badge: ['Offer agreed', 'Escrow · funds held', 'Escrow · funds held', 'Funds released'][hS], badgeBg: hS === 3 ? '#DCEBC4' : '#EAF1DC',
      steps: ['Agreed', 'Paid in', 'In transit', 'Released'].map((t, i) => ({ t, c: i === hS ? '#1C2A1D' : i < hS ? '#2E5E2F' : '#5B6657', fw: i === hS ? 700 : 400 })) };
    const seg = (arr, cur, fn) => arr.map(([id, label]) => ({ label, onClick: () => fn(id), bg: cur === id ? '#F4F1E6' : 'transparent', color: cur === id ? '#1C2A1D' : '#C9CFC0' }));
    const chip = (a) => ({ bg: a ? '#2E5E2F' : '#fff', color: a ? '#fff' : '#1C2A1D', border: a ? '#2E5E2F' : '#D6D1BF' });

    const siteNav = [['home', 'Home'], ['platform', 'Platform'], ['buyers', 'For buyers'], ['about', 'About'], ['contact', 'Contact']]
      .map(([id, label]) => ({ label, onClick: () => this.page(id), color: s.page === id ? '#1F4221' : '#4F5A4B', line: s.page === id ? '#9BBC5F' : 'transparent' }));

    const groups = [
      ['Trade', [['dashboard', 'Dashboard'], ['market', 'Marketplace'], ['deal', 'DealWise'], ['scan', 'QualityScan'], ['barter', 'Barter Exchange'], ['haul', 'AgriHaul']]],
      ['Grow', [['land', 'LandShare'], ['finance', 'Harvest Finance'], ['accounts', 'Farm Accounting'], ['academy', 'Academy']]],
      ['Protect', [['disputes', 'Dispute Centre'], ['theft', 'Theft Alerts']]],
      ['People', [['community', 'Community']]],
    ];
    const mk = ([id, label]) => { const a = s.screen === id; return { label, icon: I(id), onClick: () => this.go(id), bg: a ? '#EAF1DC' : 'transparent', color: a ? '#1F4221' : '#3E4A3C', border: a ? '#9BBC5F' : '#E3DFD0', dot: a ? '#2E5E2F' : '#CFCAB8' }; };
    const navGroups = groups.map(([g, items]) => ({ g, items: items.map(mk) }));
    const nav = groups.flatMap(([, items]) => items).map(mk);
    const bottomNav = [['dashboard', 'Home'], ['market', 'Market'], ['deal', 'DealWise'], ['finance', 'Finance'], ['more', 'More']].map(([id, label]) => {
      const a = id === 'more' ? s.more : !s.more && s.screen === id;
      return { label, icon: I(id), color: a ? '#1F4221' : '#6B7466', bar: a ? '#EAF1DC' : 'transparent', onClick: () => (id === 'more' ? this.setState({ more: !s.more }) : this.go(id)) };
    });

    const q = s.q.trim().toLowerCase();
    const fmtL = (l) => ({ ...l, ini: initialsOf(l.seller || s.user), featured: !!l.featured && !l.mine, mine: !!l.mine, verified: isDemo, repTxt: isDemo ? '★ ' + l.rating + ' · ' + l.trades : (l.trades ? l.trades + (l.trades === 1 ? ' signed deal' : ' signed deals') : 'New seller'), priceTxt: this.money(l.price, l.price < 100 ? 2 : 0), saveLbl: s.saved[l.id] ? 'Remove from AgriSave' : 'Save to AgriSave', heartFill: s.saved[l.id] ? '#D93A2B' : 'none', heartStroke: s.saved[l.id] ? '#D93A2B' : '#3E4A3C',
      toggleSave: (e) => {
        e && e.stopPropagation && e.stopPropagation();
        if (s.guest) { this.page('signin'); return this.say('Sign in to save listings.'); }
        const on = !s.saved[l.id]; this.setState((st) => ({ saved: { ...st.saved, [l.id]: on } })); this.say(on ? 'Saved to AgriSave.' : 'Removed from AgriSave.');
        if (live) (on ? window.AT.insert('saved_listings', { listing_id: l.id }) : window.AT.remove('saved_listings', { listing_id: l.id, user_id: s.me })).catch((er) => this.say(er.message));
      },
      qtyTxt: l.qty.toLocaleString('en-US') + ' ' + (l.qty === 1 ? l.unit : PL[l.unit] || l.unit), btn: l.mine ? (live ? 'Manage listing' : 'Your listing') : 'Make an offer', btnBg: l.mine ? '#EFEBDD' : '#2E5E2F', btnColor: l.mine ? '#1F4221' : '#fff',
      open: () => {
        if (s.guest) { this.page('signin'); return this.say('Sign in or create a free account to make an offer.'); }
        if (l.mine) return live ? this.open('mine', { manage: l }) : this.say('This is your listing. Buyer offers will show up in DealWise.');
        clearTimeout(this._t);
        if (live) this.setState({ dealId: l.id, oPrice: String(Math.round(l.price * this.rate() * 100) / 100), oQty: String(l.qty) });
        else this.setState({ dealId: l.id, stage: 'open' });
        this.go('deal');
      } });
    const listings = s.listings.filter((l) => (s.cat === 'All' || l.cat === s.cat || (s.cat === 'Saved' && s.saved[l.id])) && (!q || (l.name + ' ' + l.region + ' ' + l.cat + ' ' + (l.seller || '')).toLowerCase().includes(q))).sort((a, b) => (s.sort === 'low' ? a.price - b.price : s.sort === 'high' ? b.price - a.price : (a.age || 0) - (b.age || 0))).map(fmtL);
    const nSaved = Object.values(s.saved).filter(Boolean).length;
    const curT = s.threads.find((t) => t.id === s.thread) || s.threads[0] || { id: 0, name: 'No conversations yet', role: live ? 'Messages from buyers and sellers show here' : '', go: 'market', bg: '#CFCAB8', msgs: [] };
    const cats = ['All', 'Saved', 'Grains', 'Legumes', 'Vegetables', 'Fruit', 'Livestock', 'Poultry', 'Honey', 'Feed', 'Equipment'].map((c) => ({ label: c === 'Saved' ? '♥ Saved (' + nSaved + ')' : c, onClick: () => this.setState({ cat: c }), ...chip(s.cat === c) }));
    const myCount = s.listings.filter((l) => l.mine).length + (live ? 0 : 3);

    // Demo DealWise
    const d = (!live && (s.listings.find((l) => l.id === s.dealId && !l.mine) || s.listings.find((l) => l.id === 2))) || s.listings[0] || { id: 0, name: 'No listing', price: 1, unit: 'kg', qty: 1, region: '', seller: '', cat: 'Grains' };
    const dec = d.price < 100 ? 2 : 0;
    const r = (x) => (dec ? Math.round(x * 20) / 20 : Math.round(x / 50) * 50);
    const offer = r(d.price * 0.88), counter = r(d.price * 0.97), lo = r(d.price * 0.87), hi = r(d.price * 1.04);
    const deal = fmtL(d);
    const B = (text) => ({ text, justify: 'flex-start', bg: '#F4F1E6', color: '#1C2A1D' });
    const M = (text) => ({ text, justify: 'flex-end', bg: '#2E5E2F', color: '#fff' });
    const msgs = [
      B(`Good morning. We can take all ${deal.qtyTxt} at ${this.money(offer, dec)} per ${d.unit} and collect from your farm.`),
      M(`Thanks. I am asking ${deal.priceTxt}. It is graded and the QualityScan report is on the listing.`),
      B(`We have seen the report. ${this.money(offer, dec)} is where we are this week.`),
    ];
    const st = s.stage;
    if (st === 'accepted' || st === 'signedA') msgs.push(M(`Fine, ${this.money(offer, dec)} it is.`));
    if (['countered', 'agreed', 'signed'].includes(st)) msgs.push(M(`I can do ${this.money(counter, dec)} per ${d.unit} for the full lot if you collect by Friday.`));
    if (st === 'agreed' || st === 'signed') msgs.push(B(`Agreed at ${this.money(counter, dec)}. Send the agreement and we will pay into escrow today.`));
    if (st === 'declined') msgs.push(M(`Thanks, but I will pass at that price.`));
    const finalP = st === 'accepted' || st === 'signedA' ? offer : counter;
    const signed = st === 'signed' || st === 'signedA';

    // Live DealWise
    const dl = live ? s.listings.find((l) => l.id === s.dealId && !l.mine) : null;
    const similar = dl ? s.listings.filter((l) => l.id !== dl.id && l.cat === dl.cat && l.unit === dl.unit).map((l) => l.price) : [];
    const ofStatus = { pending: 'Waiting for reply', countered: 'Counter-offer', agreed: 'Terms agreed', declined: 'Declined', withdrawn: 'Withdrawn', signed: 'Signed by both' };
    const ofBg = { pending: '#F6EBC9', countered: '#F6EBC9', agreed: '#EAF1DC', signed: '#DCEBC4', declined: '#F4F1E6', withdrawn: '#F4F1E6' };
    const liveOffers = s.offers.map((o) => {
      const ln = o.listing || { name: 'Listing', unit: 'unit' };
      const myTurn = ['pending', 'countered'].includes(o.status) && o.last_by !== s.me;
      const waiting = ['pending', 'countered'].includes(o.status) && o.last_by === s.me;
      const iSigned = o.iAmBuyer ? o.buyer_signed : o.seller_signed;
      const otherName = (o.other && o.other.full_name) || 'AgriTRUST member';
      return {
        id: o.id, name: ln.name, who: (o.iAmBuyer ? 'Buying from ' : 'Selling to ') + otherName, ini: initialsOf(otherName), bgc: ava(o.otherId),
        terms: o.qty.toLocaleString('en-US') + ' ' + (o.qty === 1 ? ln.unit : PL[ln.unit] || ln.unit) + ' at ' + this.money(o.price, o.price < 100 ? 2 : 0) + ' per ' + ln.unit,
        total: 'Total ' + this.money(o.price * o.qty), status: ofStatus[o.status] || o.status, sbg: ofBg[o.status] || '#F4F1E6', when: 'Updated ' + ago(o.updated_at),
        myTurn, waiting, canSign: o.status === 'agreed' && !iSigned, signedWait: o.status === 'agreed' && iSigned, done: o.status === 'signed',
        counterVal: s.counters[o.id] || '', onCounterVal: (e) => this.setState({ counters: { ...s.counters, [o.id]: e.target.value } }),
        accept: () => this.offerAction(o, 'accept'), decline: () => this.offerAction(o, 'decline'), counter: () => this.offerAction(o, 'counter'),
        withdraw: () => this.offerAction(o, 'withdraw'), sign: () => this.offerAction(o, 'sign'),
        chat: () => this.chatWith(o.otherId, 'deal', otherName).catch((e) => this.say(e.message)),
        dispute: () => this.open('dispute', { mItem: ln.name + ' with ' + otherName }),
      };
    });
    const actionOffers = liveOffers.filter((o) => o.myTurn || o.canSign).length;

    const arrMap = {
      rent: ['Fixed rent', 'You pay the owner an agreed amount per hectare each season. The owner gets the same money whatever the yield, and you keep the whole harvest.'],
      harvest: ['Harvest share', 'The owner takes an agreed share of what comes off the land, usually between 20 and 30 percent. If the rains fail, you both carry the loss.'],
      profit: ['Profit share', 'Input and labour costs come off first, then you split what is left. Both of you see the same numbers in Farm Accounting, so there is nothing to argue about at the end.'],
    };
    const lands = s.lands.map((p) => { const req = !!s.requested[p.id]; return { ...p, btn: p.mine ? (live ? (p.n ? p.n + (p.n === 1 ? ' request to farm' : ' requests to farm') : 'Your land, no requests yet') : 'Your land') : req ? 'Request sent ✓' : 'Request to farm', ...chip(!req && !p.mine), onClick: () => {
      if (p.mine) return this.say(live ? 'Farmers who ask will message you in Messages.' : 'Applications from farmers will appear here.');
      if (live) {
        if (req) return this.say('You already asked. Check Messages for a reply.');
        return this.run(async () => { await window.AT.insert('land_requests', { land_id: p.id }); await this.chatWith(p.ownerId, 'land', p.owner); }, 'Request sent. Say hello to the owner in Messages.');
      }
      this.setState({ requested: { ...s.requested, [p.id]: !req } }); if (!req) { this.say(`Request sent to the owner in ${p.place}.`); this.act(`You asked to farm ${p.ha} in ${p.place}`, '#8C7431'); } } }; });

    const harvestsData = [['Mahangu, May 2027', 'mahangu', 8], ['Maize, June 2027', 'maize', 9], ['Goats, Dec 2026', 'goats', 3]];
    const hs = harvestsData[s.hIdx];
    const interest = Math.round(s.amount * 0.115 * hs[2] / 12);

    const posts = s.posts.map((p) => { const l = !!s.liked[p.id]; return { ...p, likes: p.likes + (l ? 1 : 0), meta: live ? p.meta : p.comments + ' replies', likeColor: l ? '#B24A3A' : '#5B6657', like: () => {
      this.setState({ liked: { ...s.liked, [p.id]: !l } });
      if (live) (l ? window.AT.remove('post_likes', { post_id: p.id, user_id: s.me }) : window.AT.insert('post_likes', { post_id: p.id })).catch((e) => this.say(e.message));
    } }; });

    const inc = s.entries.filter((e) => e.type === 'in').reduce((a, e) => a + e.amount, 0);
    const out = s.entries.filter((e) => e.type === 'out').reduce((a, e) => a + e.amount, 0);
    const entries = s.entries.map((e) => ({ ...e, amt: (e.type === 'in' ? '+ ' : '− ') + this.money(e.amount), c: e.type === 'in' ? '#2E5E2F' : '#8C4A3A', del: () => {
      this.setState({ entries: s.entries.filter((x) => x.id !== e.id) });
      if (live) window.AT.remove('entries', { id: e.id }).catch((er) => this.say(er.message));
    } }));

    const tonnes = Math.max(0.5, (+s.hLoad || 0) / 1000);
    const quote = Math.round((350 + (DIST[s.hTo] || 400) * tonnes * 1.45) / 10) * 10;

    const courses = s.courses.map((c) => {
      if (live) {
        const want = !!s.interest[c.id];
        return { ...c, pct: '0%', status: want ? 'You will hear when it opens' : 'Opening soon', btn: want ? 'On your list ✓' : 'Tell me when it opens', onClick: () => {
          this.setState({ interest: { ...s.interest, [c.id]: !want } });
          (want ? window.AT.remove('course_interest', { course_id: c.id, user_id: s.me }) : window.AT.insert('course_interest', { course_id: c.id })).then(() => { if (!want) this.say('Noted. We will let you know when "' + c.title + '" opens.'); }).catch((e) => this.say(e.message));
        } };
      }
      return { ...c, pct: Math.round((c.done / c.lessons) * 100) + '%', status: c.done === 0 ? 'Not started' : c.done >= c.lessons ? 'Completed' : `${c.done} of ${c.lessons} lessons`, btn: c.done === 0 ? 'Start course' : c.done >= c.lessons ? 'Review' : 'Next lesson', onClick: () => { if (c.done >= c.lessons) return this.say('Course completed. Your certificate is in your Farm Passport.'); const done = c.done + 1; this.setState({ courses: s.courses.map((x) => (x.id === c.id ? { ...x, done } : x)) }); if (done === c.lessons) { this.say(`You finished "${c.title}". FarmScore +10`); this.act(`Completed Academy course: ${c.title}`, '#9BBC5F'); } else this.say(`Lesson ${done} of ${c.lessons} done.`); } };
    });

    const statusC = (x) => (x === 'Resolved' ? '#EAF1DC' : x === 'Under review' ? '#F6EBC9' : '#F4F1E6');

    const siteFoot = [
      { g: 'Platform', items: [['Marketplace', () => this.browseLive()], ['DealWise', () => this.go('deal')], ['QualityScan', () => this.go('scan')], ['LandShare', () => this.go('land')], ['Harvest Finance', () => this.go('finance')]] },
      { g: 'Company', items: [['About us', () => this.page('about')], ['For buyers', () => this.page('buyers')], ['All tools', () => this.page('platform')], ['Contact', () => this.page('contact')]] },
      { g: 'Help', items: [['Find an agent', () => this.open('agent')], ['Dispute Centre', () => this.go('disputes')], ['Data Charter', () => this.page('about')], live ? ['My account', () => this.go('dashboard')] : ['Sign in', () => this.page('signin')]] },
    ].map((c) => ({ g: c.g, items: c.items.map(([label, onClick]) => ({ label, onClick })) }));

    const tools = [
      ['Trade', [['market', 'Marketplace', 'List produce or livestock with a grade and photos. Buyers nearby and abroad can find it.'], ['deal', 'DealWise', 'See what similar lots are asking and send an offer or a counter-offer.'], ['scan', 'QualityScan', 'A grade, moisture estimate and shelf-life range from one photo.'], ['barter', 'Barter Exchange', 'Swap grain for tractor time or feed for goats when cash is short.'], ['haul', 'AgriHaul', 'Request a truck, see a rough price up front and track the load.']]],
      ['Grow', [['land', 'LandShare', 'Lease land on rent, harvest share or profit share terms.'], ['finance', 'Harvest Finance', 'Loans repaid once, from the sale of your harvest.'], ['accounts', 'Farm Accounting', 'Income and costs in one place, so you know if a crop paid.'], ['academy', 'Academy', 'Short courses in storage, pricing, livestock and export.']]],
      ['Protect', [['disputes', 'Dispute Centre', 'When a deal goes wrong, the chat and the agreement are all there.'], ['theft', 'Theft Alerts', 'Report stolen cattle or equipment to farmers in your region.'], ['community', 'Community', 'Ask other farmers, vets and agronomists.']]],
    ].map(([g, items]) => ({ g, items: items.map(([id, name, text]) => ({ name, text, icon: I(id), onClick: () => this.go(id) })) }));

    // Sales chart: demo uses the sample season, live uses the farmer's own entries
    const now = new Date();
    const monthKey = (dt) => dt.getFullYear() * 12 + dt.getMonth();
    const nowKey = monthKey(now);
    const liveSeries = (() => {
      const cur = Array(12).fill(0), prv = Array(12).fill(0), oc = Array(12).fill(0), op = Array(12).fill(0);
      s.entries.filter((e) => e.type === 'in' && e.at).forEach((e) => {
        const k = monthKey(new Date(e.at)), i = 11 - (nowKey - k);
        if (i >= 0 && i < 12) { cur[i] += e.amount; oc[i] += 1; }
        const j = i + 12; if (j >= 0 && j < 12) { prv[j] += e.amount; op[j] += 1; }
      });
      const labels = Array.from({ length: 12 }, (_, i) => { const dt = new Date(now.getFullYear(), now.getMonth() - 11 + i, 1); return [MON[dt.getMonth()], dt.getFullYear()]; });
      return { cur, prv, oc, op, labels };
    })();

    const notifRows = live ? s.notifs : null;
    const unreadN = live ? notifRows.filter((n) => !n.read).length : 4;
    const myRoles = s.role.split(', ').filter(Boolean);
    const firstName = s.user.split(' ')[0];
    const hr = now.getHours(), greet = (hr < 12 ? 'Good morning, ' : hr < 18 ? 'Good afternoon, ' : 'Good evening, ') + firstName;
    const unreadChats = s.threads.filter((t) => t.unread).length;
    const dashSub = !live ? 'Two buyers answered overnight, and your mahangu scan is back.'
      : actionOffers ? (actionOffers === 1 ? 'One offer needs your reply in DealWise.' : actionOffers + ' offers need your reply in DealWise.')
      : unreadChats ? 'You have ' + unreadChats + (unreadChats === 1 ? ' unread conversation.' : ' unread conversations.')
      : s.listings.some((l) => l.mine) ? 'Nothing needs your attention right now.' : 'Welcome to AgriTRUST. Post your first listing to start selling.';

    const signedDeals = live ? liveOffers.filter((o) => o.done) : [];
    const latestDeal = live ? (liveOffers.find((o) => o.done || o.canSign || o.signedWait) || liveOffers[0]) : null;

    return {
      F, L, A, V, on, hero, regions: REGIONS, dests: Object.keys(DIST), pickupDays: nextDays(),
      isSite: mode === 'site', isApp: mode === 'app', live, isDemo, notLive: !live,
      banner: s.demo ? { show: true, text: 'You are exploring the demo. The people, prices and deals here are examples and nothing is saved.', btn: 'Create a free account', onClick: () => this.leaveDemo('signup') }
        : s.guest ? { show: true, text: 'You are browsing as a guest. Sign in to make offers, save listings and message sellers.', btn: 'Sign in', onClick: () => this.page('signin') }
        : { show: false },
      P: { home: s.page === 'home', platform: s.page === 'platform', buyers: s.page === 'buyers', about: s.page === 'about', contact: s.page === 'contact', signin: s.page === 'signin', signup: s.page === 'signup' },
      modeTabs: seg([['site', 'Website'], ['app', 'Platform']], mode, (m) => this.setState({ mode: m, menu: false, more: false }, () => this.top())),
      deviceTabs: seg([['desktop', 'Desktop'], ['tablet', 'Tablet'], ['mobile', 'Mobile']], device, (dv) => this.setState({ device: dv, menu: false, more: false })),
      siteNav, siteFoot, tools, menuOpen: s.menu && !desk, toggleMenu: () => this.setState({ menu: !s.menu }),
      goHome: () => this.page('home'), goSignin: () => (live ? this.go('dashboard') : this.page('signin')), goSignup: () => (live ? this.go('dashboard') : this.page('signup')), goBuyers: () => this.page('buyers'), goPlatformPage: () => this.page('platform'), goAbout: () => this.page('about'),
      signinLabel: live ? 'My account' : 'Sign in', signupLabel: live ? 'Open my dashboard' : 'Create free account',
      goDash: () => this.go('dashboard'), goMarket: () => this.go('market'), browseLive: () => this.browseLive(), goLand: () => this.go('land'), goFinance: () => this.go('finance'), goScan: () => this.go('scan'), goDeal: () => this.go('deal'), goAccounts: () => this.go('accounts'), goHaul: () => this.go('haul'), goMessages: () => this.go('messages'),
      signOut: () => this.doSignOut(),
      openAgent: () => this.open('agent'), openListing: () => (this.needLive('post a listing') && this.open('listing')), openPost: () => this.open('post'), openBarter: () => this.open('barter'), openDispute: () => this.open('dispute', { mItem: live ? '' : deal.name + ' to Namib Grain Traders' }), openTheft: () => this.open('theft'), openLandForm: () => (this.needLive('list your land') && this.open('land')),
      modalOpen: !!s.modal, err: s.err, hasErr: !!s.err, close: this.close, submit: this.submit, stop: (e) => e.stopPropagation(), busy: s.busy,
      MD: { listing: s.modal === 'listing', post: s.modal === 'post', barter: s.modal === 'barter', dispute: s.modal === 'dispute', theft: s.modal === 'theft', agent: s.modal === 'agent', land: s.modal === 'land', password: s.modal === 'password', mine: s.modal === 'mine' },
      modalTitle: { listing: 'Post a listing', post: 'Write a post', barter: 'Post a barter request', dispute: 'Open a dispute', theft: 'Report a theft', agent: 'Ask an agent to call you', land: 'List your land', password: 'Change your password', mine: 'Manage your listing' }[s.modal] || '',
      modalBtn: s.busy ? 'Saving…' : ({ listing: 'Publish listing', post: 'Post', barter: 'Post request', dispute: 'Open dispute', theft: 'Send alert', agent: 'Request a call', land: 'List land', password: 'Change password', mine: 'Mark as sold' }[s.modal] || 'Save'),
      lbl: { signIn: s.busy ? 'Signing in…' : 'Sign in', signUp: s.busy ? 'Creating your account…' : 'Create account', sendOffer: s.busy ? 'Sending…' : 'Send offer', sendScan: s.busy ? 'Sending…' : 'Send for grading', apply: s.busy ? 'Sending…' : 'Apply for ' + this.money(s.amount), save: s.busy ? 'Saving…' : 'Save changes' },
      manageName: s.manage ? s.manage.name + ' · ' + s.manage.qtyTxt + ' at ' + s.manage.priceTxt + ' per ' + s.manage.unit : '', removeListing: this.removeListing,
      toast: s.toast, hasToast: !!s.toast,
      user: s.user, firstName, greet, dashSub, initials: initialsOf(s.user),
      contactSent: s.contactSent, contactOpen: !s.contactSent,
      sendContact: () => {
        if (!s.cName.trim() || !s.cMsg.trim()) return this.say('Please add your name and a message.');
        this.run(async () => { await window.AT.insert('contact_messages', { name: s.cName.trim(), phone: s.cPhone.trim() || null, region: s.cRegion, message: s.cMsg.trim() }, 'Your message did not send. Please try again.'); this.setState({ contactSent: true }); });
      },
      resetContact: () => this.setState({ contactSent: false, cMsg: '' }),
      buyerSent: s.buyerSent, buyerOpen: !s.buyerSent,
      sendBuyer: () => {
        if (!s.bProd.trim() || !s.bQty.trim() || !s.bContact.trim()) return this.say('Please add a product, a quantity and how farmers can reach you.');
        this.run(async () => { await window.AT.insert('buyer_requests', { product: s.bProd.trim(), qty: s.bQty.trim(), region: s.bReg, company: s.bCo.trim() || null, contact: s.bContact.trim() }, 'Your request did not send. Please try again.'); this.setState({ buyerSent: true }); });
      },
      resetBuyer: () => this.setState({ buyerSent: false, bProd: '', bQty: '' }),
      signIn: () => {
        if (!s.siPhone.trim() || !s.siPass.trim()) return this.say('Enter your phone number and password.');
        this.run(async () => {
          const sess = await window.AT.signIn(s.siPhone, s.siPass);
          this.setState({ siPass: '' });
          await this.enterLive(sess.user.id); this.go('dashboard');
          this.say('Welcome back, ' + this.state.user.split(' ')[0] + '.');
        });
      },
      forgot: () => { this.open('agent', { mPhone: s.siPhone }); this.say('Leave your name and phone number and we will call you to reset your password.'); },
      demoSignIn: () => { this.setState({ demo: true, guest: false, ...demoCopy() }); this.go('dashboard'); this.say('You are in the demo. Explore freely. Nothing here is real or saved.'); },
      signUp: () => {
        if (!s.suName.trim() || !s.suPhone.trim()) return this.say('Please add your name and phone number.');
        if (String(s.suPass).length < 8) return this.say('Choose a password with at least 8 characters.');
        this.run(async () => {
          const sess = await window.AT.signUp({ name: s.suName.trim(), phone: s.suPhone, password: s.suPass, region: s.suRegion, roles: s.role });
          const uid = sess.user.id;
          if (s.suFile) { try { const url = await window.AT.upload(uid, 'avatars', s.suFile); await window.AT.update('profiles', { id: uid }, { avatar_url: url }); } catch (e) { console.warn(e); } }
          this.setState({ suPass: '', suFile: null, suPhoto: '' });
          await this.enterLive(uid); this.go('dashboard');
          this.say('Welcome to AgriTRUST, ' + s.suName.trim().split(' ')[0] + '. Your account is ready.');
        });
      },
      roles: ['All', 'Farmer', 'Landowner', 'Buyer', 'Transporter'].map((x) => { const ALL = ['Farmer', 'Landowner', 'Buyer', 'Transporter']; const cur = myRoles; const isAll = ALL.every((r) => cur.includes(r)); const act = x === 'All' ? isAll : cur.includes(x);
        return { label: x, onClick: () => { let n = x === 'All' ? (isAll ? ['Farmer'] : ALL) : act ? cur.filter((r) => r !== x) : [...cur, x]; if (!n.length) n = [x === 'All' ? 'Farmer' : x]; this.setState({ role: ALL.filter((r) => n.includes(r)).join(', ') }); }, ...chip(act) }; }),
      modules: [
        { icon: I('market'), name: 'Marketplace', text: 'List produce or livestock with photos and a grade. Buyers from your region and from export markets can find it.', onClick: () => this.browseLive() },
        { icon: I('deal'), name: 'DealWise', text: 'When an offer comes in, you see what similar lots are asking and can send a counter-offer. Every step is saved.', onClick: () => this.go('deal') },
        { icon: I('scan'), name: 'QualityScan', text: 'Photograph a sample and get a grade, a moisture estimate and a shelf-life range. The report travels with your listing.', onClick: () => this.go('scan') },
        { icon: I('finance'), name: 'Harvest Finance', text: 'Loans for seed, feed or equipment that you repay once, from the sale. Your FarmScore sets the rate.', onClick: () => this.go('finance') },
        { icon: I('land'), name: 'LandShare', text: 'Farm land you don’t own, or earn from land you aren’t using. Rent, harvest share or profit share, written down.', onClick: () => this.go('land') },
        { icon: I('barter'), name: 'Barter Exchange', text: 'Short on cash before harvest? Swap grain for tractor hours, or lucerne for weaners, with the trade recorded.', onClick: () => this.go('barter') },
      ],
      steps: [
        { n: '01', c: '#9BBC5F', t: 'List it with a scan', d: 'Your QualityScan report sits on the listing, so the buyer knows the grade before they call.' },
        { n: '02', c: '#5E8A3C', t: 'Agree terms in DealWise', d: 'Price, quantity, collection date. Everything you agree is saved as a digital deal agreement.' },
        { n: '03', c: '#2E5E2F', t: 'Buyer pays into escrow', d: 'The money is held by AgriTRUST. You can see it has arrived before anything leaves your farm.' },
        { n: '04', c: '#C7A751', t: 'Released on delivery', d: 'The buyer confirms the load matches. Funds go to your account or mobile wallet the same day.' },
      ],
      values: [
        ['Trust', 'Verified identities, escrow and a record of every deal.'], ['Fairness', 'Fair prices, fair access to land and fair finance.'],
        ['Ethical AI', 'AI suggests, people decide. Experts review the hard cases.'], ['Data privacy', 'Farm records are shared only when you say so.'],
        ['Quality', 'Grades and shelf-life estimates buyers can rely on.'], ['Protection', 'Help against scams, fake inputs, theft and climate shocks.'],
        ['Sustainability', 'Farming that looks after soil, water and biodiversity.'], ['Food security', 'Less waste after harvest, more food reaching people.'],
      ].map(([t, d]) => ({ t, d })),
      navGroups, nav, bottomNav, hasMImg: !!s.mImg, mImgSrc: s.mImg, noMImg: !s.mImg, imgLabel: s.mImg ? 'Change photo' : 'Upload a photo',
      pickImg: (e) => { const f = e.target.files && e.target.files[0]; if (!f) return; const r = new FileReader(); r.onload = () => this.setState({ mImg: r.result, mFile: f }); r.readAsDataURL(f); },
      topLinks: [['dashboard', 'Home'], ['market', 'Marketplace'], ['deal', 'DealWise'], ['haul', 'AgriHaul'], ['community', 'Community']].map(([id, label]) => ({ label, icon: I(id), onClick: () => this.go(id), line: s.screen === id ? '#2E5E2F' : 'transparent', op: s.screen === id ? 1 : 0.72 })),
      hasAvatar: !!s.avatar, noAvatar: !s.avatar, avatar: s.avatar,
      hasSuPhoto: !!s.suPhoto, noSuPhoto: !s.suPhoto, suPhotoSrc: s.suPhoto, suPhotoLabel: s.suPhoto ? 'Change profile photo' : 'Add a profile photo',
      pickAvatar: (e) => { const f = e.target.files && e.target.files[0]; if (!f) return; const r = new FileReader(); r.onload = () => this.setState({ suPhoto: r.result, suFile: f }); r.readAsDataURL(f); },
      topQ: s.topQ, onTopQ: (e) => this.setState({ topQ: e.target.value }),
      topSearchKey: (e) => { if (e.key === 'Enter') { this.setState({ q: s.topQ, cat: 'All', search: false }); this.go('market'); } if (e.key === 'Escape') this.setState({ search: false }); },
      searchOpen: !!s.search, openSearch: () => this.setState({ search: true, panel: null }), closeSearch: () => this.setState({ search: false }),
      ...(() => { const q = s.topQ.trim().toLowerCase(); const tools = [...navGroups.flatMap((g) => g.items)];
        const ls = s.listings.filter((l) => !q || (l.name + ' ' + l.cat + ' ' + l.region + ' ' + (l.seller || '')).toLowerCase().includes(q)).slice(0, q ? 6 : 3)
          .map((l) => ({ t: l.name, d: l.cat + ' · ' + l.region + (l.seller ? ' · ' + l.seller : ''), img: l.img, rad: '4px', onClick: () => { this.setState({ q: l.name, cat: 'All', search: false }); this.go('market'); } }));
        const ts = tools.filter((t) => !q || t.label.toLowerCase().includes(q)).slice(0, q ? 4 : 3).map((t) => ({ t: t.label, d: 'Tool', img: t.icon, rad: '0', onClick: () => { this.setState({ search: false }); t.onClick(); } }));
        const res = [...ts, ...ls]; return { searchRes: res, srNone: !res.length, srHead: q ? 'Results' : 'Suggested' }; })(),
      tbHome: { c: s.screen === 'dashboard' && !s.panel && !s.search ? '#1C2A1D' : '#6B7466', line: s.screen === 'dashboard' && !s.panel && !s.search ? '#2E5E2F' : 'transparent' },
      tbComm: { c: s.screen === 'community' && !s.panel && !s.search ? '#1C2A1D' : '#6B7466', line: s.screen === 'community' && !s.panel && !s.search ? '#2E5E2F' : 'transparent' },
      goCommunity: () => this.go('community'),
      tbChat: { c: s.panel === 'chat' || (s.screen === 'messages' && !s.panel && !s.search) ? '#1C2A1D' : '#6B7466', line: s.panel === 'chat' || (s.screen === 'messages' && !s.panel && !s.search) ? '#2E5E2F' : 'transparent' },
      tbSearch: { c: s.search ? '#1C2A1D' : '#6B7466', line: s.search ? '#2E5E2F' : 'transparent' },
      tbNew: { c: s.modal === 'listing' ? '#1C2A1D' : '#6B7466', line: s.modal === 'listing' ? '#2E5E2F' : 'transparent' },
      bellBg: s.panel === 'notif' ? '#E3DFD0' : '#F2EFE4', anyPanel: !!s.panel, closePanel: () => this.setState({ panel: null }), profileOpen: s.panel === 'profile',
      toggleProfile: () => (s.guest ? this.page('signin') : this.setState({ panel: s.panel === 'profile' ? null : 'profile' })), goSettings: () => this.go('settings'),
      roleText: (s.guest ? 'Guest' : myRoles.join(' · ')) + ' · ' + s.prRegion,
      profItems: [['⚙', 'Profile and settings', () => this.go('settings')], live ? ['★', 'My deals', () => this.go('deal')] : ['★', 'My FarmScore', () => this.go('dashboard')], [this.CUR[this.cc()][0].trim(), 'Farm Accounting', () => this.go('accounts')], ['?', 'Help and support', () => { this.setState({ panel: null }); this.open('agent'); }], ['↗', 'Visit the website', () => this.page('home')], ['⎋', s.demo ? 'Leave the demo' : 'Sign out', () => { this.setState({ panel: null }); this.doSignOut(); }]].map(([g, label, onClick], i, a) => ({ g, label, onClick, c: i === a.length - 1 ? '#A93226' : '#1C2A1D' })),
      photoBtn: s.avatar ? 'Change photo' : 'Upload photo',
      pickProfilePhoto: (e) => {
        const f = e.target.files && e.target.files[0]; if (!f) return;
        if (live) return this.run(async () => { const url = await window.AT.upload(s.me, 'avatars', f); await window.AT.update('profiles', { id: s.me }, { avatar_url: url }); this.setState({ avatar: url }); }, 'Profile photo updated.');
        const r = new FileReader(); r.onload = () => this.setState({ avatar: r.result }); r.readAsDataURL(f);
      },
      onUser: (e) => this.setState({ user: e.target.value }), prPhone: s.prPhone, onPrPhone: (e) => (live ? this.say('Your phone number is how you sign in. Ask an agent if it needs to change.') : this.setState({ prPhone: e.target.value })),
      prRegion: s.prRegion, onPrRegion: (e) => this.setState({ prRegion: e.target.value }), prLang: s.prLang, onPrLang: (e) => this.setState({ prLang: e.target.value }),
      langs: ['English', 'Oshiwambo', 'Afrikaans', 'Otjiherero', 'Rukwangali', 'German'],
      ntToggles: [['offers', 'Offers and messages', 'When a buyer makes an offer or sends a chat'], ['pay', 'Payments and escrow', 'When funds are held or released'], ['theft', 'Theft alerts near me', 'Stolen livestock or equipment in your region'], ['tips', 'Farming tips', 'New Academy lessons and market prices']].map(([id, label, d]) => ({ label, d, track: s.nt[id] ? '#2E5E2F' : '#D6D1BF', jc: s.nt[id] ? 'flex-end' : 'flex-start', onClick: () => this.setState({ nt: { ...s.nt, [id]: !s.nt[id] } }) })),
      chToggles: [['sms', 'SMS', 'Works on any phone, no data needed'], ['wa', 'WhatsApp', 'Messages to ' + s.prPhone], ['email', 'Email', 'Weekly summary of your sales']].map(([id, label, d]) => ({ label, d, track: s.chn[id] ? '#2E5E2F' : '#D6D1BF', jc: s.chn[id] ? 'flex-end' : 'flex-start', onClick: () => this.setState({ chn: { ...s.chn, [id]: !s.chn[id] } }) })),
      changePin: () => (live ? this.open('password') : this.say('We sent a reset code to ' + s.prPhone + '.')), twoFaLabel: s.twoFa ? 'Turn off 2-step sign-in' : 'Turn on 2-step sign-in',
      toggle2fa: () => { this.setState({ twoFa: !s.twoFa }); this.say(s.twoFa ? '2-step sign-in turned off.' : '2-step sign-in is on.'); },
      saveSettings: () => {
        if (!s.user.trim()) return this.say('Please add your name.');
        if (!live) return this.say('Settings saved.');
        this.run(async () => {
          await window.AT.update('profiles', { id: s.me }, { full_name: s.user.trim(), region: s.prRegion, roles: s.role });
          await window.AT.update('profile_private', { id: s.me }, { language: s.prLang, currency: s.cur, notify: s.nt, channels: s.chn, updated_at: new Date().toISOString() });
        }, 'Settings saved.');
      },
      ch: (() => {
        if (live) {
          const n = s.chR, off = 12 - n, D = s.chM === 'sales' ? [liveSeries.cur, liveSeries.prv] : [liveSeries.oc, liveSeries.op];
          return this.chart(D[0].slice(off), D[1].slice(off), liveSeries.labels.slice(off), n, s, 'Last ' + n + ' months', s.chM === 'sales' ? 'Built from the income you record in Farm Accounting.' : 'Each income entry in Farm Accounting counts as one order.');
        }
        const M = ['Oct', 'Nov', 'Dec', 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep'];
        const W = [7400, 9800, 8600, 6100, 5400, 8900], wS = W.reduce((a, b) => a + b, 0);
        const season = W.map((w) => Math.round((inc * w) / wS / 100) * 100); season[5] += inc - season.reduce((a, b) => a + b, 0);
        const sCur = [3200, 4100, 6800, 5200, 2900, 3600, ...season], sPrv = [2600, 3000, 5100, 4800, 2500, 3100, 5900, 7600, 7200, 5000, 4300, 6800];
        const toOrd = (v) => Math.max(1, Math.round(v / 700));
        const D = { sales: [sCur, sPrv], orders: [sCur.map(toOrd), sPrv.map(toOrd)] };
        const n = s.chR, off = 12 - n;
        const labels = M.map((m, i) => [m, i < 3 ? 2025 : 2026]);
        const sum = (a) => a.reduce((x, y) => x + y, 0);
        return this.chart(D[s.chM][0].slice(off), D[s.chM][1].slice(off), labels.slice(off), n, s, n === 6 ? 'This season, Apr to Sep 2026' : 'Last 12 months, Oct 2025 to Sep 2026', n === 6 && s.chM === 'sales' ? 'Same as Earned this season. Every sale is recorded in Farm Accounting.' : s.chM === 'orders' ? sum(D.orders[0].slice(off)) + ' orders at about NAD 700 each, from your Marketplace sales.' : 'Includes last season (Oct to Mar). This season alone: ' + this.money(inc) + '.');
      })(),
      chMetric: [['sales', 'Sales (NAD)'], ['orders', 'Orders']].map(([id, label]) => ({ label, onClick: () => this.setState({ chM: id }), bg: s.chM === id ? '#fff' : 'transparent', c: s.chM === id ? '#1C2A1D' : '#6B7466', sh: s.chM === id ? '0 1px 2px rgba(0,0,0,.12)' : 'none' })),
      chRange: [[6, '6 months'], [12, '12 months']].map(([id, label]) => ({ label, onClick: () => this.setState({ chR: id, chI: null }), bg: s.chR === id ? '#fff' : 'transparent', c: s.chR === id ? '#1C2A1D' : '#6B7466', sh: s.chR === id ? '0 1px 2px rgba(0,0,0,.12)' : 'none' })),
      chatOpen: s.panel === 'chat', notifOpen: s.panel === 'notif',
      toggleChat: () => (s.guest ? this.page('signin') : this.setState({ panel: s.panel === 'chat' ? null : 'chat' })),
      toggleNotif: () => { if (s.guest) return this.page('signin'); this.setState({ panel: s.panel === 'notif' ? null : 'notif', notifRead: true }); },
      readChats: () => { this.setState((st) => ({ threads: st.threads.map((t) => ({ ...t, unread: false })) })); if (live) s.threads.filter((t) => t.unread).forEach((t) => window.AT.markThreadRead(t.id, s.me)); },
      readNotifs: () => { this.setState((st) => ({ notifRead: true, notifAll: true, notifs: st.notifs.map((n) => ({ ...n, read: true })) })); if (live) window.AT.markNotificationsRead(s.me); },
      chatBadge: { n: unreadChats, show: unreadChats ? 'block' : 'none' }, notifBadge: { n: unreadN, show: (live ? unreadN : s.demo && !s.notifRead) ? 'block' : 'none' },
      chats: s.threads.slice(0, 6).map((t) => { const last = t.msgs[t.msgs.length - 1] || [0, 'No messages yet', '']; return { ini: initialsOf(t.name), t: t.name + ': ' + last[1], d: last[2], bg: t.bg, fw: t.unread ? 700 : 400, dc: t.unread ? '#2E5E2F' : '#6B7466', dot: t.unread ? 'block' : 'none', onClick: () => this.openThread(t.id) }; }),
      noChats: !s.threads.length,
      seeAllChats: () => (s.threads.length ? this.openThread(s.thread || s.threads[0].id) : this.go('messages')),
      threadList: s.threads.map((t) => { const last = t.msgs[t.msgs.length - 1] || [0, 'No messages yet', '']; return { ini: initialsOf(t.name), name: t.name, last: (last[0] ? 'You: ' : '') + last[1], time: last[2], bgc: t.bg, fw: t.unread ? 700 : 400, dot: t.unread ? 'block' : 'none', rowBg: t.id === curT.id && !(mob && !s.thread) ? '#EAF1DC' : 'transparent', onClick: () => this.openThread(t.id) }; }),
      curT: { name: curT.name, role: curT.role, tool: { market: 'Marketplace', deal: 'Open DealWise', haul: 'View booking', community: 'View post', barter: 'Barter Exchange', land: 'LandShare', theft: 'Theft Alerts' }[curT.go] || 'Marketplace', ini: initialsOf(curT.name), bg: curT.bg },
      curMsgs: curT.msgs.map(([me, t, time]) => ({ t, time, jc: me ? 'flex-end' : 'flex-start', bg: me ? '#2E5E2F' : '#F2EFE4', c: me ? '#fff' : '#1C2A1D', tc: me ? '#CFE0B6' : '#7A8475' })).reverse(),
      isTyping: !live && s.typing === curT.id, draft: s.draft, onDraft: (e) => this.setState({ draft: e.target.value }),
      draftKey: (e) => { if (e.key === 'Enter') this.sendMsg(); }, sendMsg: () => this.sendMsg(), backToList: () => this.setState({ thread: null }),
      openThreadTool: () => this.go(curT.go),
      msgListD: mob && s.thread ? 'none' : 'flex', msgThreadD: mob && !s.thread ? 'none' : 'flex',
      notifs: live
        ? (notifRows.length ? notifRows : [{ id: 0, title: 'Welcome', body: 'Offers, messages and alerts will show up here.', created_at: new Date().toISOString(), read: true, go: 'dashboard', kind: 'info' }]).map((n) => ({ ini: initialsOf(n.title), t: n.title + ': ' + n.body, d: ago(n.created_at), bg: { offer: '#2E5E2F', message: '#7FA146', theft: '#C0392B', barter: '#5E8A3C', land: '#8C7431' }[n.kind] || '#5B6657', fw: n.read ? 400 : 700, dc: n.read ? '#6B7466' : '#2E5E2F', dot: n.read ? 'none' : 'block', onClick: () => { this.setState({ panel: null }); this.go(n.go || 'dashboard'); } }))
        : [['Buyer offer', 'A buyer in Windhoek offered NAD 17.80/kg for your groundnuts.', '5m', '#2E5E2F', 'market'], ['QualityScan', 'Your maize lot was graded Grade A.', '40m', '#7FA146', 'scan'], ['Theft alert', 'Cattle reported missing near Tsumeb. Check your kraal.', '2h', '#C0392B', 'theft'], ['Harvest Finance', 'Your loan application moved to review.', '5h', '#C7A751', 'finance'], ['Academy', 'New lesson: storing grain after harvest.', 'Yesterday', '#5B6657', 'academy']].map(([n, t, d, bg, go], i) => ({ ini: initialsOf(n), t: n + ': ' + t, d, bg, fw: i < 4 && !s.notifAll ? 700 : 400, dc: i < 4 && !s.notifAll ? '#2E5E2F' : '#6B7466', dot: i < 4 && !s.notifAll ? 'block' : 'none', onClick: () => { this.setState({ panel: null }); this.go(go); } })),
      moreOpen: s.more && mob,
      S: { ...Object.fromEntries(['messages', 'settings', 'dashboard', 'market', 'deal', 'scan', 'barter', 'haul', 'land', 'finance', 'accounts', 'academy', 'disputes', 'theft', 'community'].map((k) => [k, s.screen === k])), dealDemo: s.screen === 'deal' && !live, dealLive: s.screen === 'deal' && live, scanDemo: s.screen === 'scan' && !live, scanLive: s.screen === 'scan' && live },
      kpis: live ? [
        { label: 'Income recorded', value: this.money(inc), note: 'From Farm Accounting', c: '#1C2A1D', onClick: () => this.go('accounts') },
        { label: 'Active listings', value: String(myCount), note: 'Tap to post another', c: '#1C2A1D', onClick: () => this.open('listing') },
        { label: 'Offers to answer', value: String(actionOffers), note: liveOffers.length + ' deals in DealWise', c: '#8C7431', onClick: () => this.go('deal') },
        { label: 'Signed deals', value: String(signedDeals.length), note: 'Agreements signed by both sides', c: '#2E5E2F', onClick: () => this.go('deal') },
      ] : [
        { label: 'Earned this season', value: this.money(inc), note: 'Apr to Sep · matches the Sales chart', c: '#1C2A1D', onClick: () => this.go('accounts') },
        { label: 'Active listings', value: String(myCount), note: 'Tap to post another', c: '#1C2A1D', onClick: () => this.open('listing') },
        { label: 'Offers waiting', value: st === 'open' ? '2' : '1', note: 'Oldest: 9 hours', c: '#8C7431', onClick: () => this.go('deal') },
        { label: 'FarmScore', value: '612', note: 'Silver tier', c: '#2E5E2F', onClick: () => this.go('finance') },
      ],
      activity: (live && !s.activity.length) ? [{ t: 'Your account is ready. Post a listing or browse the Marketplace to get started.', d: 'Today', c: '#9BBC5F' }] : s.activity.slice(0, 6),
      latest: latestDeal ? { has: true, name: latestDeal.name, who: latestDeal.who, terms: latestDeal.terms, total: latestDeal.total, status: latestDeal.status } : { has: false },
      noLatest: !latestDeal,
      q: s.q, onQ: (e) => this.setState({ q: e.target.value }), cats, listings, noResults: listings.length === 0 && (!!q || s.cat !== 'All' || !live && !s.guest), emptyMarket: listings.length === 0 && !q && s.cat === 'All' && (live || s.guest),
      resultCount: listings.length + (listings.length === 1 ? ' listing' : ' listings') + (s.cat === 'All' ? ' across Namibia' : s.cat === 'Saved' ? ' saved in AgriSave' : ' in ' + s.cat), sort: s.sort, onSort: (e) => this.setState({ sort: e.target.value }), clearSearch: () => this.setState({ q: '', cat: 'All' }),
      marketSub: isDemo && !s.guest ? 'Produce and livestock from verified sellers across Namibia.' : 'Produce, livestock and equipment listed by farmers across Namibia.',
      buyerReqs: (s.buyerReqs || []).map((b) => ({ t: b.product + ', ' + b.qty, d: [b.company, b.region, ago(b.created_at)].filter(Boolean).join(' · '), contact: b.contact })), hasBuyerReqs: live && (s.buyerReqs || []).length > 0,
      deal, msgs, offerTxt: this.money(offer, dec), counterTxt: this.money(counter, dec), rangeTxt: `${this.money(lo, dec)} to ${this.money(hi, dec)}`, totalTxt: this.money(finalP * d.qty),
      finalTxt: this.money(finalP, dec),
      canReply: st === 'open', waiting: st === 'countered', agreed: ['agreed', 'accepted', 'signed', 'signedA'].includes(st), signed, unsigned: !signed, declined: st === 'declined',
      sendCounter: () => { this.setState({ stage: 'countered' }); this._t = setTimeout(() => this.setState({ stage: 'agreed' }), 1600); },
      acceptOffer: () => this.setState({ stage: 'accepted' }),
      declineOffer: () => this.setState({ stage: 'declined' }),
      resetDeal: () => this.setState({ stage: 'open' }),
      signDeal: () => { this.setState({ stage: st === 'accepted' ? 'signedA' : 'signed' }); this.act(`Deal agreement signed: ${deal.name}, ${this.money(finalP * d.qty)}`, '#2E5E2F'); this.say('Agreement signed. The buyer has been asked to pay into escrow.'); },
      // live DealWise
      dl: dl ? { name: dl.name, seller: dl.seller, region: dl.region, unit: dl.unit, ask: this.money(dl.price, dl.price < 100 ? 2 : 0), qtyTxt: fmtL(dl).qtyTxt, img: dl.img } : {}, hasDl: !!dl,
      dlSuggest: dl ? (similar.length >= 2 ? 'Other ' + dl.cat.toLowerCase() + ' listings on AgriTRUST are asking ' + this.money(Math.min(...similar), Math.min(...similar) < 100 ? 2 : 0) + ' to ' + this.money(Math.max(...similar), Math.max(...similar) < 100 ? 2 : 0) + ' per ' + dl.unit + ' right now.' : 'There are not enough similar listings yet to suggest a price. As more farmers list, DealWise will show the going rate here.') : '',
      sendOffer: this.sendOffer, cancelOffer: () => this.setState({ dealId: null }),
      offerTotal: dl && +s.oPrice > 0 && +s.oQty > 0 ? 'Total ' + this.money((+s.oPrice / this.rate()) * +s.oQty) : '',
      liveOffers, noOffers: live && !liveOffers.length,
      crop: s.crop, onCrop: (e) => this.setState({ crop: e.target.value, scan: 'idle' }),
      scanIdle: s.scan === 'idle', scanBusy: s.scan === 'busy', scanDone: s.scan === 'done', scanBtn: s.scan === 'busy' ? 'Scanning…' : s.scan === 'done' ? 'Scan another sample' : 'Run QualityScan',
      runScan: () => { if (s.scan === 'busy') return; this.setState({ scan: 'busy' }); this._s = setTimeout(() => { this.setState({ scan: 'done' }); this.act(`QualityScan: ${s.crop} graded A`, '#9BBC5F'); }, 1800); },
      attachScan: () => { this.say(`Report attached. Your ${s.crop.toLowerCase()} listing now shows Grade A.`); this.go('market'); },
      // live QualityScan
      scImg: s.scImg, hasScImg: !!s.scImg, noScImg: !s.scImg,
      pickScan: (e) => { const f = e.target.files && e.target.files[0]; if (!f) return; const r = new FileReader(); r.onload = () => this.setState({ scImg: r.result, scFile: f }); r.readAsDataURL(f); },
      sendScan: () => {
        if (!s.scFile) return this.say('Add a photo of your sample first.');
        this.run(async () => { const url = await window.AT.upload(s.me, 'scans', s.scFile); await window.AT.insert('scan_requests', { crop: s.crop, img: url }); this.setState({ scImg: '', scFile: null }); await this.reload(); }, 'Photo sent. We will add the grade here and let you know.');
      },
      scans: s.scans, hasScans: s.scans.length > 0,
      arrs: Object.keys(arrMap).map((k) => ({ label: arrMap[k][0], onClick: () => this.setState({ arr: k }), ...chip(s.arr === k) })), arrText: arrMap[s.arr][1], lands, noLands: live && !lands.length,
      amount: s.amount, onAmount: (e) => this.setState({ amount: +e.target.value }),
      amountTxt: this.money(s.amount), interestTxt: this.money(interest), repayTxt: this.money(s.amount + interest), harvestName: hs[1],
      rateLabel: live ? 'Indicative rate' : 'Rate (Silver tier)',
      finNote: live ? 'Harvest Finance is being set up with partner lenders, so no money is lent through the website yet. Your application is saved and our team will call you to talk it through.' : 'Nothing to pay monthly. When your ' + hs[1] + ' sells on AgriTRUST, the repayment comes out of escrow and the rest goes to you.',
      harvests: harvestsData.map((h, i) => ({ label: h[0], onClick: () => this.setState({ hIdx: i }), ...chip(s.hIdx === i) })),
      applyLoan: () => {
        if (!live) { this.setState({ loans: [{ id: Date.now(), label: 'New loan', amount: s.amount, repay: s.amount + interest, harvest: hs[0], status: 'Under review' }, ...s.loans] }); this.act(`Harvest Finance application: ${this.money(s.amount)}`, '#1F4221'); return this.say('Application sent. Most decisions come back within a day.'); }
        this.run(async () => { await window.AT.insert('loan_applications', { amount: s.amount, repay: s.amount + interest, harvest: hs[0] }); await this.reload(); }, 'Application saved. We will call you to talk it through.');
      },
      loans: s.loans.map((l) => ({ ...l, amt: this.money(l.amount), rep: this.money(l.repay), bg: statusC(l.status === 'Active' ? 'Resolved' : l.status) })), noLoans: live && !s.loans.length,
      posts, noPosts: live && !posts.length, rsvp: s.rsvp, rsvpBtn: s.rsvp ? 'You’re going ✓' : 'I’ll be there', toggleRsvp: () => { this.setState({ rsvp: !s.rsvp }); if (!s.rsvp) this.say('See you in Ondangwa on 17 October.'); },
      barters: s.barters.map((b) => { const o = !!s.offered[b.id]; return { ...b, btn: b.mine ? (live ? (b.n ? b.n + (b.n === 1 ? ' swap offer' : ' swap offers') : 'Your request, no offers yet') : 'Your request') : o ? 'Swap offered ✓' : 'Offer a swap', ...chip(!o && !b.mine), onClick: () => {
        if (b.mine) return this.say(live ? 'People who offer a swap will message you in Messages.' : 'Offers on your request will show here.');
        if (live) {
          if (o) return this.say('You already offered. Check Messages for a reply.');
          return this.run(async () => { await window.AT.insert('barter_offers', { barter_id: b.id }); await this.chatWith(b.ownerId, 'barter', b.who); }, 'Swap offer sent. Tell ' + b.who.split(' ')[0] + ' what you can give in Messages.');
        }
        this.setState({ offered: { ...s.offered, [b.id]: !o } }); if (!o) this.say(`Swap offer sent to ${b.who}.`); } }; }), noBarters: live && !s.barters.length,
      quoteTxt: this.money(quote), distTxt: (DIST[s.hTo] || '') + ' km',
      haulSub: live ? 'Request a truck for your load. A transporter confirms the price before anything is booked.' : 'Book a truck from Tsumeb. You see the price before you confirm.',
      haulNote: live ? 'A rough estimate from distance and weight. The transporter confirms the final price with you.' : 'Includes loading and tracking. Insurance for the load is added at checkout.',
      haulBtn: live ? 'Request this truck' : 'Book this truck', quoteLabel: live ? 'Estimate' : 'Quote',
      bookTruck: () => {
        if (!(+s.hLoad > 0)) return this.say('Enter the load in kg.');
        const ref = 'AH-' + String(Date.now()).slice(-6);
        if (live) {
          if (!s.hFrom.trim()) return this.say('Where should the truck collect from?');
          return this.run(async () => { await window.AT.insert('haul_requests', { ref, origin: s.hFrom.trim(), destination: s.hTo, load_kg: +s.hLoad, pickup: s.hDate, estimate: quote }); await this.reload(); }, 'Request ' + ref + ' sent. We will call you to confirm a transporter.');
        }
        this.setState({ bookings: [{ id: ref, route: `${s.hFrom || 'Tsumeb'} to ${s.hTo}`, load: (+s.hLoad).toLocaleString('en-US') + ' kg', date: s.hDate, cost: this.money(quote), status: 'Driver assigned' }, ...s.bookings] }); this.act(`Truck booked to ${s.hTo}, ${s.hDate}`, '#5E8A3C'); this.say(`Booked. Reference ${ref}.`);
      },
      bookings: s.bookings, hasBookings: s.bookings.length > 0,
      incTxt: this.money(inc), outTxt: this.money(out), profitTxt: this.money(inc - out), entries, noEntries: live && !entries.length,
      accSub: live ? 'Your income and costs. Add each sale and expense as it happens, and the totals update for you.' : 'This season so far. Sales on AgriTRUST are added for you.',
      typeTabs: [['in', 'Income'], ['out', 'Cost']].map(([id, label]) => ({ label, onClick: () => this.setState({ aType: id }), ...chip(s.aType === id) })),
      addEntry: () => {
        if (!s.aDesc.trim() || !(+s.aAmt > 0)) return this.say('Add a description and an amount.');
        if (live) return this.run(async () => { await window.AT.insert('entries', { type: s.aType, description: s.aDesc.trim(), amount: Math.round(+s.aAmt / this.rate() * 100) / 100 }); this.setState({ aDesc: '', aAmt: '' }); await this.reload(); }, 'Entry saved.');
        this.setState({ entries: [{ id: Date.now(), type: s.aType, desc: s.aDesc, amount: +s.aAmt / this.rate(), date: 'Today' }, ...s.entries], aDesc: '', aAmt: '' }); this.say('Entry saved.');
      },
      courses, academySub: live ? 'Short courses you can do on your phone. We are writing them now, so pick the ones you want and we will tell you when each opens.' : 'Short courses you can do on your phone. Each one you finish adds to your FarmScore.',
      disputes: s.disputes.map((x) => ({ ...x, bg: statusC(x.status) })), noDisputes: live && !s.disputes.length,
      dispSub: live ? 'Tell us when a deal goes wrong. We read every case and reply within two working days.' : 'While a dispute is open, escrow money stays where it is.',
      alerts: s.alerts.map((a) => { const sn = !!s.seen[a.id]; return { ...a, btn: a.mine ? 'Your report' : sn ? 'Sighting reported ✓' : 'I’ve seen this', ...chip(false), onClick: () => {
        if (a.mine) return this.say('Anyone who reports a sighting will show up in your notifications.');
        if (live) { if (sn) return this.say('Thanks, you already reported this.'); return this.run(async () => { await window.AT.insert('theft_sightings', { alert_id: a.id }); this.setState({ seen: { ...s.seen, [a.id]: true } }); }, 'Thanks. The owner has been told. If you can, call the police too.'); }
        this.setState({ seen: { ...s.seen, [a.id]: !sn } }); if (!sn) this.say('Thanks. The owner and the nearest agent have been told.'); } }; }), noAlerts: live && !s.alerts.length,
    };
  }
  chart(cur, prv, labels, n, s, period, link) {
    const fmt = (v) => s.chM === 'sales' ? this.money(v) : v + (v === 1 ? ' order' : ' orders');
    const raw = Math.max(1, ...cur, ...prv) * 1.08, nice = s.chM === 'sales' ? [500, 1000, 1500, 2000, 2500, 3000, 4000, 5000, 10000, 25000, 50000, 100000, 250000] : [1, 2, 3, 4, 5, 6, 8, 10, 20, 50], step = nice.find((q) => q * 4 >= raw) || nice[nice.length - 1], top = step * 4;
    const X = (i) => ((i + 0.5) / n) * 1000, Y = (v) => 228 - (v / top) * 216;
    const path = (a) => a.map((v, i) => (i ? 'L' : 'M') + X(i).toFixed(1) + ' ' + Y(v).toFixed(1)).join(' ');
    const tick = (v) => s.chM === 'sales' ? (v >= 1000 ? (v / 1000) + 'k' : String(v)) : String(v);
    const sum = (a) => a.reduce((x, y) => x + y, 0), sp = sum(prv), dl = sp ? Math.round((sum(cur) / sp - 1) * 100) : null;
    const hi = s.chI != null && s.chI < n ? s.chI : null; const bi = cur.indexOf(Math.max(...cur));
    return {
      total: fmt(sum(cur)), period, link,
      delta: dl == null ? '' : (dl >= 0 ? '▲ ' : '▼ ') + Math.abs(dl) + '%', deltaC: dl == null || dl >= 0 ? '#2E7D32' : '#A93226', deltaNote: dl == null ? 'No figures for the same months last year' : 'vs same months last year',
      line: path(cur), prev: path(prv), area: path(cur) + ' L' + X(n - 1).toFixed(1) + ' 228 L' + X(0).toFixed(1) + ' 228 Z',
      ticks: [0, 1, 2, 3, 4].map((k) => ({ label: tick((top / 4) * k), top: (Y((top / 4) * k) / 240 * 100) + '%' })).reverse(),
      cols: 'repeat(' + n + ',minmax(0,1fr))',
      pts: cur.map((v, i) => ({ m: labels[i][0], left: (X(i) / 10) + '%', top: (Y(v) / 240 * 100) + '%', sz: hi === i ? '14px' : '9px', hl: hi === i ? 'rgba(127,161,70,.08)' : 'transparent', mc: hi === i ? '#1C2A1D' : '#7A8475', mw: hi === i ? 700 : 400, enter: () => this.setState({ chI: i }) })),
      hasTip: hi != null, tip: hi != null ? { m: labels[hi][0] + ' ' + labels[hi][1], v: fmt(cur[hi]), p: fmt(prv[hi]), left: (X(hi) / 10) + '%', top: (Y(cur[hi]) / 240 * 100) + '%', tx: hi < 2 ? '-12%' : hi > n - 3 ? '-88%' : '-50%' } : {},
      leave: () => this.setState({ chI: null }),
      best: Math.max(...cur) > 0 ? 'Best month: ' + labels[bi][0] + ', ' + fmt(cur[bi]) : 'No sales recorded in this period yet',
    };
  }
  leaveDemo(pg) { this.setState({ demo: false, guest: false, ...demoCopy() }); this.page(pg || 'home'); }
  async doSignOut() {
    if (this.state.live) { try { await window.AT.signOut(); } catch (e) {} this.leaveLive(); this.page('home'); return this.say('Signed out.'); }
    const wasDemo = this.state.demo;
    this.leaveDemo('home'); this.say(wasDemo ? 'You left the demo.' : 'Signed out.');
  }
}
