#!/usr/bin/env python3
"""Builds site/index.html from the Claude Design export plus AgriTRUST changes."""
import html, pathlib, re, sys

ROOT = pathlib.Path(__file__).parent
src = (ROOT / 'src' / 'template-original.html').read_text(encoding='utf-8')
logic = (ROOT / 'src' / 'logic.js').read_text(encoding='utf-8')

def rep(old, new, count=1):
    global src
    n = src.count(old)
    if n != count:
        sys.exit(f'Expected {count} match(es), found {n}:\n{old[:160]}')
    src = src.replace(old, new)

FONT = "-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif"

# ---- head: self-hosted libraries, data layer, meta ----
rep('''<title>AgriTRUST · Agriculture with trust at its roots</title>
<link rel="icon" href="assets/agritrust-mark.png">
<script>window.__AGRI_LIVE = 1;</script>
<script src="./support.js"></script>''',
'''<title>AgriTRUST · Agriculture with trust at its roots</title>
<meta name="description" content="AgriTRUST helps farmers in Namibia sell produce and livestock to buyers they can check, agree deals in writing, find land to farm and keep simple farm records.">
<meta name="theme-color" content="#2E5E2F">
<meta property="og:title" content="AgriTRUST · Agriculture with trust at its roots">
<meta property="og:description" content="A marketplace and farm business toolkit for farmers, landowners and buyers in Namibia.">
<meta property="og:image" content="https://agritrusthub.com/assets/agritrust-logo.png">
<link rel="icon" href="assets/agritrust-mark.png">
<script>window.__AGRI_LIVE = 1; window.__resources = { "https://unpkg.com/react@18.3.1/umd/react.production.min.js": "vendor/react.production.min.js", "https://unpkg.com/react-dom@18.3.1/umd/react-dom.production.min.js": "vendor/react-dom.production.min.js" };</script>
<script src="vendor/supabase.min.js?v=2.116.0"></script>
<script src="agritrust-data.js?v=__VER__"></script>
<script src="./support.js"></script>''')

# ---- website header buttons follow the sign-in state ----
rep('''color:#1C2A1D;padding:10px 12px">Sign in</button>
        <button onClick="{{ goSignup }}" style="border:0;cursor:pointer;background:#2E5E2F;color:#fff;font-size:15px;font-weight:600;padding:11px 18px;border-radius:6px" style-hover="background:#1F4221">Create free account</button>''',
'''color:#1C2A1D;padding:10px 12px">{{ signinLabel }}</button>
        <button onClick="{{ goSignup }}" style="border:0;cursor:pointer;background:#2E5E2F;color:#fff;font-size:15px;font-weight:600;padding:11px 18px;border-radius:6px" style-hover="background:#1F4221">{{ signupLabel }}</button>''')
rep('''padding:14px;border-radius:6px">Create free account</button>
        <button onClick="{{ goSignin }}" style="border:1px solid #D6D1BF;cursor:pointer;background:#fff;color:#1C2A1D;font-size:16px;font-weight:600;padding:14px;border-radius:6px">Sign in</button>''',
'''padding:14px;border-radius:6px">{{ signupLabel }}</button>
        <button onClick="{{ goSignin }}" style="border:1px solid #D6D1BF;cursor:pointer;background:#fff;color:#1C2A1D;font-size:16px;font-weight:600;padding:14px;border-radius:6px">{{ signinLabel }}</button>''')

# ---- marketplace links on the website show real listings ----
rep('<button onClick="{{ goMarket }}" style="border:1.5px solid rgba(255,255,255,.55)', '<button onClick="{{ browseLive }}" style="border:1.5px solid rgba(255,255,255,.55)')
rep('<button onClick="{{ goMarket }}" style="border:0;cursor:pointer;background:#C7A751;color:#1C2A1D;font-size:16px;font-weight:700;padding:14px 20px;border-radius:6px">Browse live listings</button>',
    '<button onClick="{{ browseLive }}" style="border:0;cursor:pointer;background:#C7A751;color:#1C2A1D;font-size:16px;font-weight:700;padding:14px 20px;border-radius:6px">Browse live listings</button>')

# ---- claims that are not true yet ----
rep("Works in a browser, on an Android phone, and through an agent if you'd rather not use a phone at all. Click any tool to try it with the demo account.",
    "Works in the browser on any phone or computer, and through an agent if you would rather not use a phone at all. Click any tool to try it with the demo account.")
rep("Every seller is ID-verified. Most lots carry a QualityScan report and a harvest date from the farm's own records. You pay into escrow, and the money only moves when the load arrives as described.",
    "Every seller has a profile you can check, and every offer, counter-offer and signed agreement is saved on the platform. We are adding ID checks, QualityScan reports and escrow payments step by step during our pilot, and each listing shows what has been checked.")

# ---- buyer request needs a way to reach the buyer ----
rep('''<label style="display:flex;flex-direction:column;gap:6px;font-size:13.5px;font-weight:600;color:#3E4A3C">Company<input value="{{ V.bCo }}" onChange="{{ on.bCo }}" placeholder="Business name" style="border:1px solid #D6D1BF;border-radius:6px;padding:12px 14px;font-size:15px"></label>''',
'''<label style="display:flex;flex-direction:column;gap:6px;font-size:13.5px;font-weight:600;color:#3E4A3C">Company<input value="{{ V.bCo }}" onChange="{{ on.bCo }}" placeholder="Business name" style="border:1px solid #D6D1BF;border-radius:6px;padding:12px 14px;font-size:15px"></label>
            <label style="display:flex;flex-direction:column;gap:6px;font-size:13.5px;font-weight:600;color:#3E4A3C">Phone or email *<input value="{{ V.bContact }}" onChange="{{ on.bContact }}" placeholder="So farmers can reach you" style="border:1px solid #D6D1BF;border-radius:6px;padding:12px 14px;font-size:15px"><span style="font-weight:400;font-size:12.5px;color:#6B7466">Signed-in farmers can see this so they can contact you.</span></label>''')
rep("Your request goes on the Buyer Request Board. Farmers with matching stock can reply directly.",
    "Your request goes on the Buyer Request Board inside the platform. Farmers with matching stock can contact you directly.")
rep("We'll send farmer replies to your inbox. Create a buyer account to answer them and pay through escrow.",
    "Farmers with matching stock will contact you on the details you gave. Create a buyer account to make offers and keep every deal on record.")

# ---- sign in: forgot password ----
rep('''      <button onClick="{{ demoSignIn }}" style="border:1px solid #D6D1BF;cursor:pointer;background:#fff;color:#1C2A1D;font-size:15px;font-weight:600;padding:13px;border-radius:6px">Use the demo account</button>''',
'''      <button onClick="{{ forgot }}" style="align-self:flex-start;border:0;background:transparent;padding:0;cursor:pointer;font-size:14px;font-weight:600;color:#2E5E2F">Forgot your password?</button>
      <button onClick="{{ demoSignIn }}" style="border:1px solid #D6D1BF;cursor:pointer;background:#fff;color:#1C2A1D;font-size:15px;font-weight:600;padding:13px;border-radius:6px">Use the demo account</button>''')
rep('''<input type="password" value="{{ V.siPass }}" onChange="{{ on.siPass }}" style=''', '''<input type="password" value="{{ V.siPass }}" onChange="{{ on.siPass }}" autocomplete="current-password" style=''')
rep('''<button onClick="{{ signIn }}" style="border:0;cursor:pointer;background:#2E5E2F;color:#fff;font-size:16px;font-weight:600;padding:14px;border-radius:6px">Sign in</button>''',
    '''<button onClick="{{ signIn }}" style="border:0;cursor:pointer;background:#2E5E2F;color:#fff;font-size:16px;font-weight:600;padding:14px;border-radius:6px">{{ lbl.signIn }}</button>''')

# ---- sign up: password ----
rep('''      <button onClick="{{ signUp }}" style="border:0;cursor:pointer;background:#2E5E2F;color:#fff;font-size:16px;font-weight:600;padding:14px;border-radius:6px">Create account</button>''',
'''      <label style="display:flex;flex-direction:column;gap:6px;font-size:13.5px;font-weight:600;color:#3E4A3C">Choose a password *<input type="password" value="{{ V.suPass }}" onChange="{{ on.suPass }}" autocomplete="new-password" style="border:1px solid #D6D1BF;border-radius:6px;padding:13px 14px;font-size:15.5px"><span style="font-weight:400;font-size:12.5px;color:#6B7466">At least 8 characters. You will sign in with your phone number and this password.</span></label>
      <button onClick="{{ signUp }}" style="border:0;cursor:pointer;background:#2E5E2F;color:#fff;font-size:16px;font-weight:600;padding:14px;border-radius:6px">{{ lbl.signUp }}</button>''')

# ---- app banner for demo and guest ----
rep('''  <sc-if value="{{ anyPanel }}" hint-placeholder-val="{{ false }}">''',
f'''  <sc-if value="{{{{ banner.show }}}}" hint-placeholder-val="{{{{ false }}}}">
    <div style="display:flex;align-items:center;justify-content:center;gap:10px 16px;flex-wrap:wrap;padding:9px 16px;background:#FAF3DD;border-bottom:1px solid #E8DDB5;font-size:14px;color:#5A4A17;text-align:center">
      <span>{{{{ banner.text }}}}</span>
      <button onClick="{{{{ banner.onClick }}}}" style="border:0;cursor:pointer;background:#2E5E2F;color:#fff;font-size:13.5px;font-weight:600;padding:7px 12px;border-radius:5px">{{{{ banner.btn }}}}</button>
    </div>
  </sc-if>
  <sc-if value="{{{{ anyPanel }}}}" hint-placeholder-val="{{{{ false }}}}">''')

# ---- chat panel empty state ----
rep('''      <button onClick="{{ seeAllChats }}" style="margin-top:4px;''',
'''      <sc-if value="{{ noChats }}" hint-placeholder-val="{{ false }}"><div style="padding:10px 8px;font-size:14.5px;color:#5B6657;line-height:1.5">No conversations yet. When you make an offer or reply to a listing, the chat shows up here.</div></sc-if>
      <button onClick="{{ seeAllChats }}" style="margin-top:4px;''')

# ---- dashboard ----
rep('>Good morning, {{ firstName }}</h1>', '>{{ greet }}</h1>')
rep('Two buyers answered overnight, and your mahangu scan is back.</p>', '{{ dashSub }}</p>')
rep('<span style="font-size:13.5px;color:#6B7466">vs same months last year</span>', '<span style="font-size:13.5px;color:#6B7466">{{ ch.deltaNote }}</span>')
rep('''              <div style="border-radius:8px;padding:22px;color:#fff;background:linear-gradient(150deg,#1F4221,#2E5E2F 60%,#5E8A3C);display:flex;flex-direction:column;gap:12px">
                <div style="display:flex;justify-content:space-between;gap:8px"><span style="font-size:13px;color:#D9E7BE">In escrow now</span>''',
f'''              <sc-if value="{{{{ live }}}}" hint-placeholder-val="{{{{ false }}}}">
              <div style="border-radius:8px;padding:22px;color:#fff;background:linear-gradient(150deg,#1F4221,#2E5E2F 60%,#5E8A3C);display:flex;flex-direction:column;gap:10px">
                <span style="font-size:13px;color:#D9E7BE">Latest deal</span>
                <sc-if value="{{{{ latest.has }}}}" hint-placeholder-val="{{{{ false }}}}">
                  <div style="font:700 21px {FONT}">{{{{ latest.name }}}}</div>
                  <div style="font-size:14px;color:#E3ECD4">{{{{ latest.who }}}} · {{{{ latest.terms }}}}</div>
                  <div style="display:flex;justify-content:space-between;gap:8px;flex-wrap:wrap;font-size:14px"><span style="font-weight:700">{{{{ latest.total }}}}</span><span style="background:rgba(255,255,255,.16);padding:3px 9px;border-radius:4px">{{{{ latest.status }}}}</span></div>
                </sc-if>
                <sc-if value="{{{{ noLatest }}}}" hint-placeholder-val="{{{{ true }}}}"><div style="font-size:14.5px;color:#E3ECD4;line-height:1.5">No deals yet. When you make or receive an offer, it shows up here.</div></sc-if>
                <button onClick="{{{{ goDeal }}}}" style="align-self:flex-start;border:1px solid rgba(255,255,255,.4);background:transparent;color:#fff;cursor:pointer;font-size:13.5px;font-weight:600;padding:8px 12px;border-radius:4px">Open DealWise</button>
              </div>
              </sc-if>
              <sc-if value="{{{{ notLive }}}}" hint-placeholder-val="{{{{ true }}}}">
              <div style="border-radius:8px;padding:22px;color:#fff;background:linear-gradient(150deg,#1F4221,#2E5E2F 60%,#5E8A3C);display:flex;flex-direction:column;gap:12px">
                <div style="display:flex;justify-content:space-between;gap:8px"><span style="font-size:13px;color:#D9E7BE">In escrow now</span>''')
rep('''                <button onClick="{{ openDispute }}" style="align-self:flex-start;border:1px solid rgba(255,255,255,.4);background:transparent;color:#fff;cursor:pointer;font-size:13.5px;font-weight:600;padding:8px 12px;border-radius:4px">Report a problem</button>
              </div>''',
'''                <button onClick="{{ openDispute }}" style="align-self:flex-start;border:1px solid rgba(255,255,255,.4);background:transparent;color:#fff;cursor:pointer;font-size:13.5px;font-weight:600;padding:8px 12px;border-radius:4px">Report a problem</button>
              </div>
              </sc-if>''')
rep('''<button onClick="{{ goScan }}" style="text-align:left;border:0;background:#F4F1E6;padding:13px 14px;border-radius:6px;font-size:15px;font-weight:600;cursor:pointer;color:#1C2A1D" style-hover="background:#EAE5D3">Scan a harvest</button>''',
    '''<button onClick="{{ goScan }}" style="text-align:left;border:0;background:#F4F1E6;padding:13px 14px;border-radius:6px;font-size:15px;font-weight:600;cursor:pointer;color:#1C2A1D" style-hover="background:#EAE5D3">Send a sample for grading</button>''')
rep('''style-hover="background:#EAE5D3">Book a truck</button>''', '''style-hover="background:#EAE5D3">Request a truck</button>''')

# ---- marketplace ----
rep('Produce and livestock from verified sellers across Namibia.</p>', '{{ marketSub }}</p>')
rep('<span title="Verified seller" style="color:#2E5E2F;font-weight:700">✓</span><span style="color:#5B6657;margin-left:auto;flex:none">★ {{ l.rating }} · {{ l.trades }}</span>',
    '<sc-if value="{{ l.verified }}" hint-placeholder-val="{{ true }}"><span title="Verified seller" style="color:#2E5E2F;font-weight:700">✓</span></sc-if><span style="color:#5B6657;margin-left:auto;flex:none">{{ l.repTxt }}</span>')
rep('''          <sc-if value="{{ noResults }}" hint-placeholder-val="{{ false }}">''',
f'''          <sc-if value="{{{{ emptyMarket }}}}" hint-placeholder-val="{{{{ false }}}}">
            <div style="background:#fff;border:1px dashed #D6D1BF;border-radius:8px;padding:40px 24px;text-align:center;color:#5B6657;display:flex;flex-direction:column;gap:12px;align-items:center;line-height:1.55">No listings yet. AgriTRUST is just opening, so the first farmers to list will be the first buyers see.<button onClick="{{{{ openListing }}}}" style="border:0;cursor:pointer;background:#2E5E2F;color:#fff;font-size:14.5px;font-weight:600;padding:11px 16px;border-radius:6px">Post the first listing</button></div>
          </sc-if>
          <sc-if value="{{{{ hasBuyerReqs }}}}" hint-placeholder-val="{{{{ false }}}}">
            <div style="background:#fff;border:1px solid #E3DFD0;border-radius:8px;padding:20px;display:flex;flex-direction:column;gap:4px">
              <div style="font:700 18px {FONT};margin-bottom:6px">Buyer Request Board</div>
              <sc-for list="{{{{ buyerReqs }}}}" as="b" hint-placeholder-count="2">
                <div style="display:flex;justify-content:space-between;gap:10px;padding:11px 0;border-top:1px solid #F0EDE2;flex-wrap:wrap"><div><div style="font-size:15px;font-weight:600">{{{{ b.t }}}}</div><div style="font-size:13px;color:#5B6657">{{{{ b.d }}}}</div></div><span style="align-self:center;font-size:13.5px;font-weight:600;color:#2E5E2F">{{{{ b.contact }}}}</span></div>
              </sc-for>
            </div>
          </sc-if>
          <sc-if value="{{{{ noResults }}}}" hint-placeholder-val="{{{{ false }}}}">''')

# ---- DealWise: demo stays, live gets its own screen ----
rep('<sc-if value="{{ S.deal }}" hint-placeholder-val="{{ false }}">', '<sc-if value="{{ S.dealDemo }}" hint-placeholder-val="{{ false }}">')
DEAL_LIVE = f'''
      <sc-if value="{{{{ S.dealLive }}}}" hint-placeholder-val="{{{{ false }}}}">
        <div data-screen-label="Platform · DealWise live" style="display:flex;flex-direction:column;gap:20px;max-width:1180px">
          <div style="display:flex;justify-content:space-between;align-items:flex-end;gap:16px;flex-wrap:wrap">
            <div>
              <h1 style="margin:0;font:700 {{{{ A.h1 }}}} {FONT};letter-spacing:-.015em">DealWise</h1>
              <p style="margin:6px 0 0;font-size:16px;color:#5B6657">Make offers, answer them and sign the agreement. Every step is saved for both sides.</p>
            </div>
            <button onClick="{{{{ goMarket }}}}" style="border:1px solid #D6D1BF;cursor:pointer;background:#fff;color:#1C2A1D;font-size:14.5px;font-weight:600;padding:10px 16px;border-radius:6px">Find a listing</button>
          </div>
          <sc-if value="{{{{ hasDl }}}}" hint-placeholder-val="{{{{ false }}}}">
            <div style="display:grid;grid-template-columns:{{{{ A.split }}}};gap:16px;align-items:start">
              <div style="background:#fff;border:1px solid #E3DFD0;border-radius:8px;padding:20px;display:flex;flex-direction:column;gap:14px">
                <div style="display:flex;gap:14px;align-items:center">
                  <div style="width:72px;height:72px;border-radius:6px;flex:none;background:#E3DECD url({{{{ dl.img }}}}) center/cover"></div>
                  <div style="min-width:0"><div style="font:700 19px {FONT}">{{{{ dl.name }}}}</div><div style="font-size:14px;color:#5B6657">{{{{ dl.seller }}}} · {{{{ dl.region }}}}</div><div style="font-size:14px;color:#2E5E2F;font-weight:600">Asking {{{{ dl.ask }}}} per {{{{ dl.unit }}}} · {{{{ dl.qtyTxt }}}} available</div></div>
                </div>
                <div style="display:grid;grid-template-columns:{{{{ A.two }}}};gap:12px">
                  <label style="display:flex;flex-direction:column;gap:6px;font-size:13.5px;font-weight:600;color:#3E4A3C"><span>Your price per {{{{ dl.unit }}}} ({{{{ cx.code }}}})</span><input value="{{{{ V.oPrice }}}}" onChange="{{{{ on.oPrice }}}}" inputmode="decimal" style="border:1px solid #D6D1BF;border-radius:6px;padding:12px 14px;font-size:15px"></label>
                  <label style="display:flex;flex-direction:column;gap:6px;font-size:13.5px;font-weight:600;color:#3E4A3C"><span>Quantity ({{{{ dl.unit }}}})</span><input value="{{{{ V.oQty }}}}" onChange="{{{{ on.oQty }}}}" inputmode="decimal" style="border:1px solid #D6D1BF;border-radius:6px;padding:12px 14px;font-size:15px"></label>
                </div>
                <div style="font-size:15px;font-weight:700;color:#1F4221">{{{{ offerTotal }}}}</div>
                <div style="display:flex;gap:10px;flex-wrap:wrap">
                  <button onClick="{{{{ sendOffer }}}}" style="border:0;cursor:pointer;background:#2E5E2F;color:#fff;font-size:15px;font-weight:600;padding:12px 18px;border-radius:6px">{{{{ lbl.sendOffer }}}}</button>
                  <button onClick="{{{{ cancelOffer }}}}" style="border:1px solid #D6D1BF;cursor:pointer;background:#fff;color:#1C2A1D;font-size:15px;font-weight:600;padding:11px 16px;border-radius:6px">Cancel</button>
                </div>
              </div>
              <div style="background:#fff;border:1px solid #E3DFD0;border-radius:8px;padding:20px;display:flex;flex-direction:column;gap:10px">
                <div style="font:600 14px {FONT};color:#8C7431">DealWise suggests</div>
                <p style="margin:0;font-size:14.5px;line-height:1.55;color:#4F5A4B">{{{{ dlSuggest }}}}</p>
                <p style="margin:0;font-size:13.5px;line-height:1.55;color:#6B7466">Escrow payments are not switched on yet. Until our payment partner is in place, agree payment directly with the other side and keep the signed agreement as your record.</p>
              </div>
            </div>
          </sc-if>
          <div style="background:#fff;border:1px solid #E3DFD0;border-radius:8px;padding:8px 20px 12px">
            <div style="font:700 18px {FONT};padding:14px 0 6px">Your deals</div>
            <sc-if value="{{{{ noOffers }}}}" hint-placeholder-val="{{{{ false }}}}"><div style="padding:8px 0 10px;font-size:15px;color:#5B6657;line-height:1.55">No offers yet. Open a listing in the Marketplace and tap Make an offer, or post your own listing and wait for buyers.</div></sc-if>
            <sc-for list="{{{{ liveOffers }}}}" as="o" hint-placeholder-count="2">
              <div style="display:flex;flex-direction:column;gap:10px;padding:16px 0;border-top:1px solid #F0EDE2">
                <div style="display:flex;justify-content:space-between;gap:10px;flex-wrap:wrap;align-items:center">
                  <div style="display:flex;gap:12px;align-items:center;min-width:0"><span style="width:40px;height:40px;border-radius:50%;background:{{{{ o.bgc }}}};color:#fff;display:flex;align-items:center;justify-content:center;flex:none;font:700 14px {FONT}">{{{{ o.ini }}}}</span><div style="min-width:0"><div style="font:700 16.5px {FONT}">{{{{ o.name }}}}</div><div style="font-size:13.5px;color:#5B6657">{{{{ o.who }}}} · {{{{ o.when }}}}</div></div></div>
                  <span style="font-size:12.5px;font-weight:700;background:{{{{ o.sbg }}}};padding:5px 10px;border-radius:4px">{{{{ o.status }}}}</span>
                </div>
                <div style="font-size:14.5px;color:#3E4A3C">{{{{ o.terms }}}} · <strong>{{{{ o.total }}}}</strong></div>
                <sc-if value="{{{{ o.myTurn }}}}" hint-placeholder-val="{{{{ false }}}}">
                  <div style="display:flex;gap:8px;flex-wrap:wrap;align-items:center">
                    <button onClick="{{{{ o.accept }}}}" style="border:0;cursor:pointer;background:#2E5E2F;color:#fff;font-size:14px;font-weight:600;padding:10px 14px;border-radius:6px">Accept</button>
                    <input value="{{{{ o.counterVal }}}}" onChange="{{{{ o.onCounterVal }}}}" placeholder="Counter price ({{{{ cx.code }}}})" inputmode="decimal" style="width:170px;border:1px solid #D6D1BF;border-radius:6px;padding:10px 12px;font-size:14px">
                    <button onClick="{{{{ o.counter }}}}" style="border:1px solid #D6D1BF;cursor:pointer;background:#fff;color:#1C2A1D;font-size:14px;font-weight:600;padding:9px 14px;border-radius:6px">Counter</button>
                    <button onClick="{{{{ o.decline }}}}" style="border:0;cursor:pointer;background:transparent;color:#8C4A3A;font-size:14px;font-weight:600;padding:9px 8px">Decline</button>
                  </div>
                </sc-if>
                <sc-if value="{{{{ o.waiting }}}}" hint-placeholder-val="{{{{ false }}}}"><div style="display:flex;gap:10px;align-items:center;flex-wrap:wrap;font-size:14px;color:#6B7466">Waiting for their reply.<button onClick="{{{{ o.withdraw }}}}" style="border:0;cursor:pointer;background:transparent;color:#8C4A3A;font-size:14px;font-weight:600;padding:4px">Withdraw</button></div></sc-if>
                <sc-if value="{{{{ o.canSign }}}}" hint-placeholder-val="{{{{ false }}}}"><div style="border:1.5px solid #9BBC5F;background:#F3F7EA;border-radius:6px;padding:14px;display:flex;flex-direction:column;gap:8px"><div style="font-size:14.5px;color:#3E4A3C;line-height:1.5">Terms are agreed. Signing records that you accept {{{{ o.terms }}}}, {{{{ o.total }}}}.</div><button onClick="{{{{ o.sign }}}}" style="align-self:flex-start;border:0;cursor:pointer;background:#2E5E2F;color:#fff;font-size:14px;font-weight:600;padding:10px 14px;border-radius:5px">Sign the agreement</button></div></sc-if>
                <sc-if value="{{{{ o.signedWait }}}}" hint-placeholder-val="{{{{ false }}}}"><div style="font-size:14px;font-weight:600;color:#2E5E2F">✓ You signed. Waiting for the other side to sign.</div></sc-if>
                <sc-if value="{{{{ o.done }}}}" hint-placeholder-val="{{{{ false }}}}"><div style="font-size:14px;font-weight:600;color:#2E5E2F">✓ Signed by both. Agree payment and collection in the chat.</div></sc-if>
                <div style="display:flex;gap:8px;flex-wrap:wrap">
                  <button onClick="{{{{ o.chat }}}}" style="border:1px solid #D6D1BF;cursor:pointer;background:#fff;color:#1C2A1D;font-size:13.5px;font-weight:600;padding:8px 12px;border-radius:5px">Message</button>
                  <button onClick="{{{{ o.dispute }}}}" style="border:0;cursor:pointer;background:transparent;color:#6B7466;font-size:13.5px;font-weight:600;padding:8px 6px">Report a problem</button>
                </div>
              </div>
            </sc-for>
          </div>
        </div>
      </sc-if>
'''
rep('''
      <sc-if value="{{ S.scan }}" hint-placeholder-val="{{ false }}">''', DEAL_LIVE + '''
      <sc-if value="{{ S.scanDemo }}" hint-placeholder-val="{{ false }}">''')

# ---- QualityScan live ----
SCAN_LIVE = f'''
      <sc-if value="{{{{ S.scanLive }}}}" hint-placeholder-val="{{{{ false }}}}">
        <div data-screen-label="Platform · QualityScan live" style="display:flex;flex-direction:column;gap:20px;max-width:1180px">
          <div>
            <h1 style="margin:0;font:700 {{{{ A.h1 }}}} {FONT};letter-spacing:-.015em">QualityScan</h1>
            <p style="margin:6px 0 0;font-size:16px;color:#5B6657;max-width:760px">The QualityScan model is still being trained on samples from Namibian farms. Until it is ready, send a photo here and our team grades it by hand. The grade appears below and in your notifications.</p>
          </div>
          <div style="display:grid;grid-template-columns:{{{{ A.half }}}};gap:16px;align-items:start">
            <div style="background:#fff;border:1px solid #E3DFD0;border-radius:8px;padding:20px;display:flex;flex-direction:column;gap:14px">
              <label style="cursor:pointer;height:220px;border-radius:6px;border:1.5px dashed #CFCAB8;background:#FBFAF5;display:flex;align-items:center;justify-content:center;overflow:hidden;text-align:center;color:#6B7466;font-size:14.5px" style-hover="border-color:#9BBC5F">
                <input type="file" accept="image/*" onChange="{{{{ pickScan }}}}" style="display:none">
                <sc-if value="{{{{ hasScImg }}}}" hint-placeholder-val="{{{{ false }}}}"><img src="{{{{ scImg }}}}" alt="" style="width:100%;height:100%;object-fit:cover"></sc-if>
                <sc-if value="{{{{ noScImg }}}}" hint-placeholder-val="{{{{ true }}}}"><span style="padding:20px;line-height:1.5"><strong style="color:#2E5E2F">Add a photo of your sample</strong><br>Daylight, clean background, spread thin enough that single grains show.</span></sc-if>
              </label>
              <label style="display:flex;flex-direction:column;gap:6px;font-size:13.5px;font-weight:600;color:#3E4A3C">Crop
                <select value="{{{{ crop }}}}" onChange="{{{{ onCrop }}}}" style="border:1px solid #D6D1BF;border-radius:6px;padding:12px;font-size:15px;background:#fff;color:#1C2A1D">
                  <option>Pearl millet (mahangu)</option><option>White maize</option><option>Groundnuts</option><option>Sorghum</option><option>Beans</option><option>Other</option>
                </select>
              </label>
              <button onClick="{{{{ sendScan }}}}" style="border:0;cursor:pointer;background:#2E5E2F;color:#fff;font-size:15.5px;font-weight:600;padding:14px;border-radius:6px">{{{{ lbl.sendScan }}}}</button>
            </div>
            <div style="background:#fff;border:1px solid #E3DFD0;border-radius:8px;padding:8px 20px 12px">
              <div style="font:700 18px {FONT};padding:14px 0 6px">Your samples</div>
              <sc-if value="{{{{ hasScans }}}}" hint-placeholder-val="{{{{ false }}}}">
                <sc-for list="{{{{ scans }}}}" as="x" hint-placeholder-count="2">
                  <div style="display:flex;gap:12px;align-items:center;padding:12px 0;border-top:1px solid #F0EDE2">
                    <img src="{{{{ x.img }}}}" alt="" style="width:56px;height:56px;border-radius:4px;object-fit:cover;flex:none;background:#EFEBDD">
                    <div style="flex:1;min-width:0"><div style="font-size:15px;font-weight:600">{{{{ x.crop }}}}</div><div style="font-size:13px;color:#5B6657">{{{{ x.when }}}} {{{{ x.result }}}}</div></div>
                    <span style="font-size:12.5px;font-weight:700;background:#F6EBC9;padding:5px 10px;border-radius:4px">{{{{ x.status }}}}</span>
                  </div>
                </sc-for>
              </sc-if>
              <sc-if value="{{{{ !hasScans }}}}" hint-placeholder-val="{{{{ true }}}}"><div style="padding:8px 0 10px;font-size:15px;color:#5B6657">Nothing sent yet.</div></sc-if>
            </div>
          </div>
        </div>
      </sc-if>
'''
rep('''
      <sc-if value="{{ S.land }}" hint-placeholder-val="{{ false }}">''', SCAN_LIVE + '''
      <sc-if value="{{ S.land }}" hint-placeholder-val="{{ false }}">''')

# ---- empty states for live lists ----
def empty(flag, text):
    return f'<sc-if value="{{{{ {flag} }}}}" hint-placeholder-val="{{{{ false }}}}"><div style="background:#fff;border:1px dashed #D6D1BF;border-radius:8px;padding:32px 24px;text-align:center;color:#5B6657;line-height:1.55">{text}</div></sc-if>\n'

rep('''          <div style="display:grid;grid-template-columns:{{ A.cards }};gap:16px">
            <sc-for list="{{ lands }}" as="p" hint-placeholder-count="3">''',
    '          ' + empty('noLands', 'No land listed yet. If you have land you are not farming, list it and farmers nearby can ask to farm it.') + '''          <div style="display:grid;grid-template-columns:{{ A.cards }};gap:16px">
            <sc-for list="{{ lands }}" as="p" hint-placeholder-count="3">''')
rep('''          <div style="display:grid;grid-template-columns:{{ A.cards }};gap:16px">
            <sc-for list="{{ barters }}" as="b" hint-placeholder-count="3">''',
    '          ' + empty('noBarters', 'No swap requests yet. Post what you have and what you need.') + '''          <div style="display:grid;grid-template-columns:{{ A.cards }};gap:16px">
            <sc-for list="{{ barters }}" as="b" hint-placeholder-count="3">''')
rep('''          <sc-for list="{{ disputes }}" as="x" hint-placeholder-count="1">''',
    '          ' + empty('noDisputes', 'No disputes. We hope it stays that way.') + '''          <sc-for list="{{ disputes }}" as="x" hint-placeholder-count="1">''')
rep('''          <div style="display:grid;grid-template-columns:{{ A.half }};gap:16px">
            <sc-for list="{{ alerts }}" as="a" hint-placeholder-count="2">''',
    '          ' + empty('noAlerts', 'No theft reports. If something is stolen from your farm, report it here and members in your region are told.') + '''          <div style="display:grid;grid-template-columns:{{ A.half }};gap:16px">
            <sc-for list="{{ alerts }}" as="a" hint-placeholder-count="2">''')
rep('''            <div style="display:flex;flex-direction:column;gap:14px">
              <sc-for list="{{ posts }}" as="p" hint-placeholder-count="3">''',
    '''            <div style="display:flex;flex-direction:column;gap:14px">
              ''' + empty('noPosts', 'No posts yet. Ask a question or share what worked on your farm.') + '''              <sc-for list="{{ posts }}" as="p" hint-placeholder-count="3">''')
rep('''            <sc-for list="{{ entries }}" as="e" hint-placeholder-count="6">''',
    '''            <sc-if value="{{ noEntries }}" hint-placeholder-val="{{ false }}"><div style="padding:16px 0;font-size:15px;color:#5B6657">No entries yet. Add your first sale or cost above.</div></sc-if>
            <sc-for list="{{ entries }}" as="e" hint-placeholder-count="6">''')
rep('''                <sc-for list="{{ loans }}" as="l" hint-placeholder-count="1">''',
    '''                <sc-if value="{{ noLoans }}" hint-placeholder-val="{{ false }}"><div style="padding:10px 0;font-size:14.5px;color:#5B6657;border-top:1px solid #F0EDE2">No applications yet.</div></sc-if>
                <sc-for list="{{ loans }}" as="l" hint-placeholder-count="1">''')

# ---- Harvest Finance ----
rep('<div style="font-size:12.5px;color:#5B6657">Rate (Silver tier)</div>', '<div style="font-size:12.5px;color:#5B6657">{{ rateLabel }}</div>')
rep('<p style="margin:0;font-size:14.5px;color:#4F5A4B;line-height:1.55">Nothing to pay monthly. When your {{ harvestName }} sells on AgriTRUST, the repayment comes out of escrow and the rest goes to you.</p>',
    '<p style="margin:0;font-size:14.5px;color:#4F5A4B;line-height:1.55">{{ finNote }}</p>')
rep('''              <div style="background:#fff;border:1px solid #E3DFD0;border-radius:8px;padding:24px;display:flex;flex-direction:column;gap:12px">
                <span style="font-size:14px;color:#5B6657">Your FarmScore</span>''',
f'''              <sc-if value="{{{{ live }}}}" hint-placeholder-val="{{{{ false }}}}">
              <div style="background:#fff;border:1px solid #E3DFD0;border-radius:8px;padding:24px;display:flex;flex-direction:column;gap:10px">
                <span style="font-size:14px;color:#5B6657">Your FarmScore</span>
                <span style="font:700 26px {FONT};color:#1F4221">Not scored yet</span>
                <p style="margin:0;font-size:14.5px;line-height:1.55;color:#4F5A4B">Your FarmScore will be built from deals you sign on AgriTRUST, your farm records and how you repay. The more you trade here, the more a lender can see.</p>
              </div>
              </sc-if>
              <sc-if value="{{{{ notLive }}}}" hint-placeholder-val="{{{{ true }}}}">
              <div style="background:#fff;border:1px solid #E3DFD0;border-radius:8px;padding:24px;display:flex;flex-direction:column;gap:12px">
                <span style="font-size:14px;color:#5B6657">Your FarmScore</span>''')
rep('''<p style="margin:6px 0 0;font-size:14.5px;line-height:1.55;color:#4F5A4B">88 points to Gold, which drops your rate to 9%. Finishing two more escrow trades on time gets you most of the way.</p>
              </div>''',
'''<p style="margin:6px 0 0;font-size:14.5px;line-height:1.55;color:#4F5A4B">88 points to Gold, which drops your rate to 9%. Finishing two more escrow trades on time gets you most of the way.</p>
              </div>
              </sc-if>''')
rep('>Apply for {{ amountTxt }}</button>', ">{{ lbl.apply }}</button>")

# ---- AgriHaul ----
rep('Book a truck from Tsumeb. You see the price before you confirm.</p>', '{{ haulSub }}</p>')
rep('<label style="display:flex;flex-direction:column;gap:6px;font-size:13.5px;font-weight:600;color:#3E4A3C">From<input value="Tsumeb, Oshikoto" disabled style="border:1px solid #E3DFD0;border-radius:6px;padding:12px 14px;font-size:15px;background:#F7F5EE;color:#5B6657"></label>',
    '<label style="display:flex;flex-direction:column;gap:6px;font-size:13.5px;font-weight:600;color:#3E4A3C">From<input value="{{ V.hFrom }}" onChange="{{ on.hFrom }}" placeholder="Farm or nearest town" style="border:1px solid #D6D1BF;border-radius:6px;padding:12px 14px;font-size:15px"></label>')
rep('<select value="{{ V.hDate }}" onChange="{{ on.hDate }}" style="border:1px solid #D6D1BF;border-radius:6px;padding:12px 14px;font-size:15px;background:#fff"><option>Tue 29 Sep</option><option>Wed 30 Sep</option><option>Thu 1 Oct</option><option>Fri 2 Oct</option><option>Mon 5 Oct</option></select>',
    '<select value="{{ V.hDate }}" onChange="{{ on.hDate }}" style="border:1px solid #D6D1BF;border-radius:6px;padding:12px 14px;font-size:15px;background:#fff"><sc-for list="{{ pickupDays }}" as="pd"><option>{{ pd }}</option></sc-for></select>')
rep('<span style="font-size:13.5px;color:#D9E7BE">Quote · {{ distTxt }}</span>', '<span style="font-size:13.5px;color:#D9E7BE">{{ quoteLabel }} · {{ distTxt }}</span>')
rep('<span style="font-size:14px;color:#E3ECD4">Includes loading and tracking. Insurance for the load is added at checkout.</span>', '<span style="font-size:14px;color:#E3ECD4">{{ haulNote }}</span>')
rep('>Book this truck</button>', '>{{ haulBtn }}</button>')
rep('<div style="font:700 18px -apple-system,BlinkMacSystemFont,\'Segoe UI\',Roboto,Helvetica,Arial,sans-serif;margin-bottom:8px">Your bookings</div>', '<div style="font:700 18px -apple-system,BlinkMacSystemFont,\'Segoe UI\',Roboto,Helvetica,Arial,sans-serif;margin-bottom:8px">Your truck requests</div>')

# ---- other subtitles ----
rep('This season so far. Sales on AgriTRUST are added for you.</p>', '{{ accSub }}</p>')
rep('Short courses you can do on your phone. Each one you finish adds to your FarmScore.</p>', '{{ academySub }}</p>')
rep('While a dispute is open, escrow money stays where it is.</p>', '{{ dispSub }}</p>')

# ---- community ----
rep('<span style="color:#5B6657">{{ p.comments }} replies</span>', '<span style="color:#5B6657">{{ p.meta }}</span>')
rep('''            <div style="border-radius:8px;padding:22px;color:#fff;background:linear-gradient(150deg,#1F4221,#2E5E2F 60%,#8C7431);display:flex;flex-direction:column;gap:10px">''',
    '''            <sc-if value="{{ notLive }}" hint-placeholder-val="{{ true }}">
            <div style="border-radius:8px;padding:22px;color:#fff;background:linear-gradient(150deg,#1F4221,#2E5E2F 60%,#8C7431);display:flex;flex-direction:column;gap:10px">''')
rep('''              <button onClick="{{ toggleRsvp }}" style="align-self:flex-start;border:0;cursor:pointer;background:#fff;color:#1F4221;font-size:14.5px;font-weight:700;padding:10px 16px;border-radius:5px">{{ rsvpBtn }}</button>
            </div>''',
'''              <button onClick="{{ toggleRsvp }}" style="align-self:flex-start;border:0;cursor:pointer;background:#fff;color:#1F4221;font-size:14.5px;font-weight:700;padding:10px 16px;border-radius:5px">{{ rsvpBtn }}</button>
            </div>
            </sc-if>
            <sc-if value="{{ live }}" hint-placeholder-val="{{ false }}">
            <div style="border-radius:8px;padding:22px;color:#fff;background:linear-gradient(150deg,#1F4221,#2E5E2F 60%,#8C7431);display:flex;flex-direction:column;gap:10px">
              <div style="font:700 18px -apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif">Keep it useful</div>
              <div style="font-size:14.5px;color:#E3ECD4;line-height:1.55">Share what you have tried on your own farm, be kind when people ask basic questions, and never post someone else's phone number or location.</div>
            </div>
            </sc-if>''')

# ---- settings: 2-step only in demo ----
rep('''              <button onClick="{{ toggle2fa }}" style="border:1px solid #D6D1BF;background:#fff;border-radius:6px;padding:10px 16px;font-size:14.5px;font-weight:600;cursor:pointer;color:#1C2A1D">{{ twoFaLabel }}</button>''',
    '''              <sc-if value="{{ notLive }}" hint-placeholder-val="{{ true }}"><button onClick="{{ toggle2fa }}" style="border:1px solid #D6D1BF;background:#fff;border-radius:6px;padding:10px 16px;font-size:14.5px;font-weight:600;cursor:pointer;color:#1C2A1D">{{ twoFaLabel }}</button></sc-if>''')
rep('''>Save changes</button>''', '''>{{ lbl.save }}</button>''')

# ---- extra modals ----
rep('''      <sc-if value="{{ hasErr }}" hint-placeholder-val="{{ false }}">''',
'''      <sc-if value="{{ MD.password }}" hint-placeholder-val="{{ false }}">
        <label style="display:flex;flex-direction:column;gap:6px;font-size:13.5px;font-weight:600;color:#3E4A3C">New password *<input type="password" value="{{ V.mPass }}" onChange="{{ on.mPass }}" autocomplete="new-password" style="border:1px solid #D6D1BF;border-radius:6px;padding:12px 14px;font-size:15px"><span style="font-weight:400;font-size:12.5px;color:#6B7466">At least 8 characters.</span></label>
      </sc-if>

      <sc-if value="{{ MD.mine }}" hint-placeholder-val="{{ false }}">
        <div style="display:flex;flex-direction:column;gap:12px">
          <p style="margin:0;font-size:15px;color:#3E4A3C;line-height:1.55">{{ manageName }}</p>
          <p style="margin:0;font-size:14px;color:#5B6657;line-height:1.55">Mark it as sold once the deal is done, or remove it if you no longer have it. Either way buyers will stop seeing it.</p>
          <button onClick="{{ removeListing }}" style="align-self:flex-start;border:1px solid #E5B9B2;background:#fff;color:#A93226;border-radius:6px;padding:10px 14px;font-size:14.5px;font-weight:600;cursor:pointer">Remove listing</button>
        </div>
      </sc-if>

      <sc-if value="{{ hasErr }}" hint-placeholder-val="{{ false }}">''')

rep('src="assets/founder-milk-seller.png"', 'src="assets/founder-milk-seller.jpg"')

# ---- labels with a binding inside a flex column need one wrapper ----
rep('color:#3E4A3C">Price ({{ cx.code }}) *<input', 'color:#3E4A3C"><span>Price ({{ cx.code }}) *</span><input')

# ---- absolute paths so deep links like /listing/12 load correctly ----
src = src.replace('src="assets/', 'src="/assets/').replace('href="assets/', 'href="/assets/')
rep('"vendor/react.production.min.js"', '"/vendor/react.production.min.js"')
rep('"vendor/react-dom.production.min.js"', '"/vendor/react-dom.production.min.js"')
rep('<script src="vendor/supabase.min.js', '<script src="/vendor/supabase.min.js')
rep('<script src="agritrust-data.js', '<script src="/agritrust-data.js')
rep('<script src="./support.js"></script>', '<link rel="preconnect" href="https://inwsyhopzbuvqjipvuhg.supabase.co" crossorigin>\n<script src="/support.js?v=1"></script>')
rep('<script src="./image-slot.js"></script>', '<script src="/image-slot.js?v=1"></script>')

# ---- lighter on mobile data: photos load only when they scroll into view ----
src = src.replace('<img src="{{ ', '<img loading="lazy" decoding="async" src="{{ ')

# ---- honest homepage and buyers wording ----
rep("Sell your maize, mahangu or goats to buyers you can check, get paid through escrow, and borrow against the harvest you're already growing. AgriTRUST keeps the whole deal on one record, so nobody has to take anyone's word for it.",
    "Sell your maize, mahangu or goats to buyers you can check, agree the price in writing and keep the whole deal on one record, so nobody has to take anyone's word for it. Escrow payments and harvest loans are coming during our pilot.")
rep('color:#5B6657">DEAL #AT-20931</span>', 'color:#5B6657">EXAMPLE DEAL</span>')
rep("""<h2 style="margin:0 0 12px;font:700 {{ L.h2 }} -apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;letter-spacing:-.015em;line-height:1.08;max-width:640px">How a sale stays safe</h2>""",
    """<h2 style="margin:0 0 12px;font:700 {{ L.h2 }} -apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;letter-spacing:-.015em;line-height:1.08;max-width:640px">How a sale will stay safe</h2>""")
rep("The buyer's money sits in escrow until your produce arrives and matches the report. If something goes wrong, the Dispute Centre has the scan, the chat and the delivery record to look at.",
    "Today every offer, counter-offer and signed agreement is saved for both sides, and the Dispute Centre has the chat and the agreement to look at if something goes wrong. Escrow is the next step we are adding during our pilot.")
rep("Farmers who apply come with a FarmScore and a trade history you can read before you say yes.",
    "Farmers who ask come with a profile and a record of their deals on AgriTRUST that you can read before you say yes.")
rep("Informal lenders want money every month, even in January when nothing has been harvested. Harvest Finance sets one repayment date that lines up with your sale, and it comes out of escrow automatically. A better FarmScore gets you a lower rate.",
    "Informal lenders want money every month, even in January when nothing has been harvested. We are working with partner lenders on loans with one repayment date that lines up with your sale. You can apply now and our team will call you.")
rep(">Check what you qualify for</button>", ">Apply to be considered</button>")
rep("<p style=\"margin:0;font-size:15.5px;line-height:1.6;color:#4F5A4B\">Verified Buyer Contracts let you agree price and volume with a group of farmers in August for a May harvest. They can borrow against it, which makes delivery more likely.</p>",
    "<p style=\"margin:0;font-size:15.5px;line-height:1.6;color:#4F5A4B\">Coming during our pilot: Verified Buyer Contracts that let you agree price and volume with a group of farmers in August for a May harvest. Until then, post what you need on the Buyer Request Board below.</p>")
rep("<p style=\"margin:0;font-size:15.5px;line-height:1.6;color:#4F5A4B\">Add an AgriHaul truck when you agree terms. The driver's delivery confirmation is what releases escrow.</p>",
    "<p style=\"margin:0;font-size:15.5px;line-height:1.6;color:#4F5A4B\">Request an AgriHaul truck when you agree terms, and our team helps you find a transporter for the load.</p>")
rep("<p style=\"margin:0;font-size:15.5px;line-height:1.6;color:#4F5A4B\">QualityScan reports show moisture, visible defects and a shelf-life range. For export lots you can ask for a lab test before paying.</p>",
    "<p style=\"margin:0;font-size:15.5px;line-height:1.6;color:#4F5A4B\">Ask the seller for a QualityScan grade, which our team gives from a photo of a sample. For export lots you can ask for a lab test before paying.</p>")
rep("Signing up is free and takes a phone number. An AgriTRUST agent in your region can help you set up your Farm Passport.",
    "Signing up is free and takes a phone number. If you would rather have help, ask us and someone from the team will call you.")
rep("<p style=\"margin:0\">Our AI tools explain why they suggest a price or a grade. If you disagree with a QualityScan result, you can ask for a human review at no cost.</p>",
    "<p style=\"margin:0\">While our AI tools are being trained, QualityScan grades come from people on our team. If you disagree with a grade, tell us and we will look again at no cost.</p>")
rep("<p style=\"margin:0\">You can download everything we hold about your farm, or ask us to delete it, from your account settings.</p>",
    "<p style=\"margin:0\">Ask us through the Contact page and we will send you a copy of everything we hold about you, or delete it. Our <button onClick=\"{{ goPrivacy }}\" style=\"border:0;background:transparent;padding:0;cursor:pointer;font-size:16.5px;font-weight:600;color:#2E5E2F\">privacy policy</button> explains the details.</p>")

# ---- marketplace: one-listing view and WhatsApp sharing ----
rep('''          <input value="{{ q }}" onChange="{{ onQ }}" placeholder="Search maize, goats, Omusati…"''',
'''          <sc-if value="{{ hasFocus }}" hint-placeholder-val="{{ false }}"><div style="display:flex;justify-content:space-between;align-items:center;gap:12px;flex-wrap:wrap;background:#EAF1DC;border-radius:8px;padding:12px 16px;font-size:15px;color:#1F4221"><span>You are looking at one listing that was shared with you.</span><button onClick="{{ seeAll }}" style="border:0;cursor:pointer;background:#2E5E2F;color:#fff;font-size:14px;font-weight:600;padding:9px 14px;border-radius:6px">See all listings</button></div></sc-if>
          <sc-if value="{{ focusMissing }}" hint-placeholder-val="{{ false }}"><div style="background:#fff;border:1px dashed #D6D1BF;border-radius:8px;padding:32px;text-align:center;color:#5B6657">This listing has been sold or removed by the seller.</div></sc-if>
          <input value="{{ q }}" onChange="{{ onQ }}" placeholder="Search maize, goats, Omusati…"''')
rep('''                  <button onClick="{{ l.open }}" style="margin-top:auto;border:0;cursor:pointer;background:{{ l.btnBg }};color:{{ l.btnColor }};font-size:15px;font-weight:600;padding:12px;border-radius:6px">{{ l.btn }}</button>''',
'''                  <button onClick="{{ l.open }}" style="margin-top:auto;border:0;cursor:pointer;background:{{ l.btnBg }};color:{{ l.btnColor }};font-size:15px;font-weight:600;padding:12px;border-radius:6px">{{ l.btn }}</button>
                  <sc-if value="{{ l.canShare }}" hint-placeholder-val="{{ false }}"><a href="{{ l.share }}" target="_blank" rel="noopener" style="display:flex;align-items:center;justify-content:center;gap:8px;border:1px solid #CFE3C4;border-radius:6px;padding:9px;font-size:14px;font-weight:600;color:#1F7A3A;text-decoration:none"><svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2.5a9.4 9.4 0 0 0-8.1 14.2L2.5 21.5l4.9-1.3A9.4 9.4 0 1 0 12 2.5Zm0 17.1c-1.5 0-2.9-.4-4.2-1.1l-.3-.2-2.9.8.8-2.8-.2-.3A7.7 7.7 0 1 1 12 19.6Zm4.3-5.7c-.2-.1-1.4-.7-1.6-.8-.2-.1-.4-.1-.5.1l-.7.9c-.1.2-.3.2-.5.1a6.3 6.3 0 0 1-3.1-2.7c-.2-.4.2-.4.7-1.3.1-.1 0-.3 0-.4l-.7-1.7c-.2-.4-.4-.4-.5-.4h-.5a.9.9 0 0 0-.6.3 2.7 2.7 0 0 0-.9 2c0 1.2.9 2.4 1 2.5.1.2 1.7 2.7 4.2 3.7 1.6.7 2.2.7 3 .6.5-.1 1.4-.6 1.6-1.1.2-.6.2-1 .1-1.1l-.5-.2Z"></path></svg>Share on WhatsApp</a></sc-if>''')

# ---- community: replies ----
rep('<span style="color:#5B6657">{{ p.meta }}</span>',
    '<button onClick="{{ p.toggleReplies }}" style="border:0;background:transparent;cursor:pointer;padding:0;font-size:14px;font-weight:600;color:#2E5E2F">{{ p.replyBtn }}</button><span style="color:#7A8475;margin-left:auto">{{ p.meta }}</span>')
rep('''                    <button onClick="{{ p.like }}" style="border:0;background:transparent;cursor:pointer;padding:0;font-size:14px;font-weight:600;color:{{ p.likeColor }}">♥ {{ p.likes }}</button>''',
    '''                    <button onClick="{{ p.like }}" style="border:0;background:transparent;cursor:pointer;padding:0;font-size:14px;font-weight:600;color:{{ p.likeColor }}">♥ {{ p.likes }}</button>''')
rep('''                  </div>
                </div>
              </sc-for>
            </div>''','''                  </div>
                  <sc-if value="{{ p.open }}" hint-placeholder-val="{{ false }}">
                    <div style="display:flex;flex-direction:column;gap:10px;padding-top:4px">
                      <sc-for list="{{ p.replies }}" as="rp" hint-placeholder-count="2">
                        <div style="background:#F7F5EE;border-radius:8px;padding:10px 12px;display:flex;flex-direction:column;gap:3px"><span style="font-size:13px;font-weight:700;color:#1C2A1D">{{ rp.who }} <span style="font-weight:400;color:#7A8475">· {{ rp.when }}</span></span><span style="font-size:14.5px;line-height:1.5;color:#3E4A3C">{{ rp.body }}</span></div>
                      </sc-for>
                      <sc-if value="{{ p.noReplies }}" hint-placeholder-val="{{ false }}"><div style="font-size:14px;color:#7A8475">No replies yet. Be the first to answer.</div></sc-if>
                      <div style="display:flex;gap:8px"><input value="{{ replyDraft }}" onChange="{{ onReplyDraft }}" onKeyDown="{{ replyKey }}" placeholder="Write a reply…" style="flex:1;min-width:0;border:1px solid #D6D1BF;border-radius:20px;padding:10px 14px;font-size:14.5px;background:#fff"><button onClick="{{ sendReply }}" style="border:0;background:#2E5E2F;color:#fff;border-radius:20px;padding:0 16px;font-size:14px;font-weight:600;cursor:pointer;flex:none">Reply</button></div>
                    </div>
                  </sc-if>
                </div>
              </sc-for>
            </div>''')

# ---- listing editor ----
rep('''      <sc-if value="{{ MD.mine }}" hint-placeholder-val="{{ false }}">
        <div style="display:flex;flex-direction:column;gap:12px">
          <p style="margin:0;font-size:15px;color:#3E4A3C;line-height:1.55">{{ manageName }}</p>
          <p style="margin:0;font-size:14px;color:#5B6657;line-height:1.55">Mark it as sold once the deal is done, or remove it if you no longer have it. Either way buyers will stop seeing it.</p>
          <button onClick="{{ removeListing }}" style="align-self:flex-start;border:1px solid #E5B9B2;background:#fff;color:#A93226;border-radius:6px;padding:10px 14px;font-size:14.5px;font-weight:600;cursor:pointer">Remove listing</button>
        </div>
      </sc-if>''','''      <sc-if value="{{ MD.mine }}" hint-placeholder-val="{{ false }}">
        <div style="display:flex;flex-direction:column;gap:14px;border-top:1px solid #F0EDE2;padding-top:14px">
          <p style="margin:0;font-size:14px;color:#5B6657;line-height:1.55">Change the details above and save, or close the listing once it is sold. Buyers stop seeing sold or removed listings.</p>
          <div style="display:flex;gap:10px;flex-wrap:wrap">
            <button onClick="{{ soldListing }}" style="border:1px solid #9BBC5F;background:#F3F7EA;color:#1F4221;border-radius:6px;padding:10px 14px;font-size:14.5px;font-weight:600;cursor:pointer">Mark as sold</button>
            <button onClick="{{ removeListing }}" style="border:1px solid #E5B9B2;background:#fff;color:#A93226;border-radius:6px;padding:10px 14px;font-size:14.5px;font-weight:600;cursor:pointer">Remove listing</button>
          </div>
        </div>
      </sc-if>''')
# reuse the listing form fields for editing
rep('<sc-if value="{{ MD.listing }}" hint-placeholder-val="{{ false }}">', '<sc-if value="{{ MD.listingForm }}" hint-placeholder-val="{{ false }}">')

# ---- settings: language note ----
rep('''<sc-for list="{{ langs }}" as="lg" hint-placeholder-count="5"><option value="{{ lg }}">{{ lg }}</option></sc-for></select></label>''',
    '''<sc-for list="{{ langs }}" as="lg" hint-placeholder-count="5"><option value="{{ lg }}">{{ lg }}</option></sc-for></select><span style="font-size:12.5px;font-weight:400;color:#5B6657">{{ langNote }}</span></label>''')

# ---- privacy policy and terms pages ----
PAGE = lambda label, title, body: f'''
  <sc-if value="{{{{ P.{label} }}}}" hint-placeholder-val="{{{{ false }}}}">
  <div data-screen-label="Website · {title}">
    <section style="max-width:820px;margin:0 auto;padding:{{{{ L.pageHeroPad }}}};display:flex;flex-direction:column;gap:18px;font-size:16.5px;line-height:1.7;color:#3E4A3C">
      <div style="font:600 14px {FONT};color:#8C7431">Last updated 15 October 2026</div>
      <h1 style="margin:0;font:700 {{{{ L.h2 }}}} {FONT};line-height:1.08;color:#1C2A1D">{title}</h1>
      {body}
    </section>
  </div>
  </sc-if>
'''
H = lambda t: f'<h2 style="margin:14px 0 0;font:700 21px {FONT};color:#1C2A1D">{t}</h2>'
Pp = lambda t: f'<p style="margin:0">{t}</p>'
privacy_body = ''.join([
  Pp('AgriTRUST is run by Cloud Computing Investment CC in Windhoek, Namibia. This page explains what we collect when you use agritrusthub.com, why we collect it and who can see it. We wrote it in plain language because farmers should not need a lawyer to understand where their information goes.'),
  H('What we collect'),
  Pp('When you create an account we keep your name, phone number, region, the roles you picked and your password, which is stored in a scrambled form that even we cannot read. If you add a photo, we keep that too.'),
  Pp('When you use the platform we keep what you post and do: listings and their photos, offers, counter-offers and signed agreements, chat messages, community posts and replies, barter and land requests, theft reports, disputes, truck requests, loan applications, QualityScan photos and the income and costs you record in Farm Accounting.'),
  Pp('When you use a form on the website without an account, such as Contact, the Buyer Request Board or a request for an agent to call, we keep what you type into it.'),
  H('Who can see what'),
  Pp('Anyone can see your listings, your name, your region, your profile photo and the number of deals you have signed. Community posts, replies, barter requests and land listings are public too.'),
  Pp('Your phone number is private. Other members do not see it unless you share it with them in a chat. Buyers who post on the Buyer Request Board choose to share their contact details with signed-in members.'),
  Pp('Offers, agreements and chats are seen only by the two people in them. Your Farm Accounting records, disputes, loan applications, truck requests and QualityScan photos are seen only by you and by the small AgriTRUST team who handle them.'),
  H('Why we use it'),
  Pp('We use your information to run the platform, to connect you with the people you choose to trade with, to answer your requests, to keep people safe from fraud and theft, and to improve AgriTRUST. We do not sell your information and we do not use it for advertising.'),
  H('Where it is kept'),
  Pp('Our database and photos are kept with Supabase on servers in the European Union, and the website is hosted by Hostinger. Both protect the data with encryption while it travels and access controls while it is stored.'),
  H('How long we keep it'),
  Pp('We keep your information while your account is open. If you ask us to close your account, we delete your profile and records, except where we must keep a record of a signed agreement or a dispute for a reasonable time to deal with a complaint.'),
  H('Your choices'),
  Pp('You can change your name, region, photo and settings at any time in Profile and settings. You can ask for a copy of everything we hold about you, ask us to correct it, or ask us to delete it, by writing to us through the Contact page.'),
  H('Changes and questions'),
  Pp('If we change how we use your information, we will update this page and tell members in the platform. If you have a question, use the Contact page and a person from the team will reply.'),
])
terms_body = ''.join([
  Pp('These terms apply when you use agritrusthub.com. AgriTRUST is run by Cloud Computing Investment CC in Windhoek, Namibia. By creating an account you agree to them, so please read them.'),
  H('Where AgriTRUST is today'),
  Pp('AgriTRUST is in its pilot stage. Accounts, listings, offers, signed agreements, chat and the other tools work, but some features are not live yet. AgriTRUST does not hold or move money today, escrow is not switched on, and Harvest Finance applications are passed to partner lenders who make their own decisions. QualityScan grades are given by our team from a photo and are an opinion, not a certificate.'),
  H('Your account'),
  Pp('You must give your real name and a phone number you use, and keep your password to yourself. You are responsible for what happens on your account. Tell us straight away if you think someone else has used it.'),
  H('Trading on AgriTRUST'),
  Pp('Deals are between the buyer and the seller. AgriTRUST is not a party to them and does not guarantee the quality, quantity, delivery or payment of anything listed. Check what you are buying, agree payment and collection clearly, and keep everything in the chat and the signed agreement so there is a record if something goes wrong.'),
  Pp('A signed agreement on AgriTRUST records what both sides accepted. If a deal goes wrong, open a dispute and we will look at the record and try to help, but we cannot force either side to pay or deliver.'),
  H('What you must not do'),
  Pp('Do not list anything you do not own or have the right to sell, including stolen livestock or equipment. Do not post false or misleading listings, prices or photos. Do not use AgriTRUST to cheat, threaten or harass anyone, to collect the details of other people for other purposes, or to break any law of Namibia. We may remove content and close accounts that break these rules, and we will report suspected theft to the police.'),
  H('What you post'),
  Pp('You keep ownership of what you post. You allow us to show it on AgriTRUST so the platform can work, for example showing your listing photo to buyers.'),
  H('Our responsibility'),
  Pp('We work hard to keep AgriTRUST running and secure, but we cannot promise it will always be available or free of mistakes. As far as the law allows, we are not responsible for losses that come from deals between members or from relying on a price suggestion or a grade.'),
  H('Changes and the law'),
  Pp('We may update these terms as AgriTRUST grows. We will tell members in the platform when we do. These terms are governed by the laws of Namibia. If you have a question, use the Contact page and a person from the team will reply.'),
])
rep('''  <section style="max-width:1240px;margin:0 auto;padding:{{ L.secPad }}">
    <div style="border-radius:8px;padding:{{ L.ctaPad }};''', PAGE('privacy', 'Privacy policy', privacy_body) + PAGE('terms', 'Terms of use', terms_body) + '''  <section style="max-width:1240px;margin:0 auto;padding:{{ L.secPad }}">
    <div style="border-radius:8px;padding:{{ L.ctaPad }};''')
rep('<div style="max-width:1240px;margin:0 auto;padding:18px {{ L.gutter }} 28px;border-top:1px solid #33443A;font-size:13px;color:#8F998A">© 2026 AgriTRUST. Windhoek, Namibia.</div>',
    '<div style="max-width:1240px;margin:0 auto;padding:18px {{ L.gutter }} 28px;border-top:1px solid #33443A;font-size:13px;color:#8F998A">© 2026 AgriTRUST, run by Cloud Computing Investment CC. Windhoek, Namibia.</div>')

# ---- sign up: agree to terms ----
rep('''      <button onClick="{{ signUp }}" style="border:0;cursor:pointer;background:#2E5E2F;color:#fff;font-size:16px;font-weight:600;padding:14px;border-radius:6px">{{ lbl.signUp }}</button>''',
    '''      <p style="margin:0;font-size:13.5px;color:#5B6657;line-height:1.5">By creating an account you agree to our <button onClick="{{ goTerms }}" style="border:0;background:transparent;padding:0;cursor:pointer;font-size:13.5px;font-weight:600;color:#2E5E2F">terms of use</button> and <button onClick="{{ goPrivacy }}" style="border:0;background:transparent;padding:0;cursor:pointer;font-size:13.5px;font-weight:600;color:#2E5E2F">privacy policy</button>.</p>
      <button onClick="{{ signUp }}" style="border:0;cursor:pointer;background:#2E5E2F;color:#fff;font-size:16px;font-weight:600;padding:14px;border-radius:6px">{{ lbl.signUp }}</button>''')

# ---- admin screen ----
ADMIN = f'''
      <sc-if value="{{{{ S.admin }}}}" hint-placeholder-val="{{{{ false }}}}">
        <div data-screen-label="Platform · Team admin" style="display:flex;flex-direction:column;gap:18px;max-width:1180px">
          <div style="display:flex;justify-content:space-between;align-items:flex-end;gap:16px;flex-wrap:wrap">
            <div><h1 style="margin:0;font:700 {{{{ A.h1 }}}} {FONT};letter-spacing:-.015em">Team admin</h1><p style="margin:6px 0 0;font-size:15.5px;color:#5B6657">Everything members and visitors have asked for. Only people on the team list can see this page.</p></div>
            <button onClick="{{{{ adminRefresh }}}}" style="border:1px solid #D6D1BF;cursor:pointer;background:#fff;color:#1C2A1D;font-size:14.5px;font-weight:600;padding:10px 16px;border-radius:6px">Refresh</button>
          </div>
          <div style="display:flex;gap:8px;flex-wrap:wrap"><sc-for list="{{{{ adminTabs }}}}" as="t" hint-placeholder-count="6"><button onClick="{{{{ t.onClick }}}}" style="border:1px solid {{{{ t.border }}}};background:{{{{ t.bg }}}};color:{{{{ t.color }}}};font-size:14px;font-weight:600;padding:8px 14px;border-radius:6px;cursor:pointer">{{{{ t.label }}}}</button></sc-for></div>
          <sc-if value="{{{{ adminLoading }}}}" hint-placeholder-val="{{{{ false }}}}"><div style="color:#5B6657">Loading…</div></sc-if>
          <sc-if value="{{{{ adminEmpty }}}}" hint-placeholder-val="{{{{ false }}}}"><div style="background:#fff;border:1px dashed #D6D1BF;border-radius:8px;padding:32px;text-align:center;color:#5B6657">Nothing here yet.</div></sc-if>
          <sc-for list="{{{{ adminItems }}}}" as="it" hint-placeholder-count="3">
            <div style="background:#fff;border:1px solid #E3DFD0;border-radius:8px;padding:18px;display:flex;flex-direction:column;gap:10px">
              <div style="display:flex;justify-content:space-between;gap:10px;align-items:flex-start;flex-wrap:wrap"><div style="font:700 17px {FONT};color:#1C2A1D">{{{{ it.title }}}}</div><sc-if value="{{{{ it.isQueue }}}}"><span style="font-size:12.5px;font-weight:700;background:{{{{ it.badgeBg }}}};padding:4px 10px;border-radius:4px">{{{{ it.badge }}}}</span></sc-if></div>
              <sc-if value="{{{{ it.hasImg }}}}" hint-placeholder-val="{{{{ false }}}}"><a href="{{{{ it.img }}}}" target="_blank" rel="noopener"><img src="{{{{ it.img }}}}" alt="" style="width:220px;max-width:100%;height:160px;object-fit:cover;border-radius:6px;background:#EFEBDD"></a></sc-if>
              <sc-for list="{{{{ it.lines }}}}" as="ln" hint-placeholder-count="2"><div style="font-size:14.5px;color:#3E4A3C;line-height:1.5">{{{{ ln.t }}}}</div></sc-for>
              <sc-if value="{{{{ it.isQueue }}}}" hint-placeholder-val="{{{{ true }}}}">
                <div style="display:flex;gap:10px;flex-wrap:wrap;align-items:flex-end;padding-top:8px;border-top:1px solid #F0EDE2">
                  <label style="display:flex;flex-direction:column;gap:5px;font-size:13px;font-weight:600;color:#3E4A3C">Status<select value="{{{{ it.status }}}}" onChange="{{{{ it.onStatus }}}}" style="border:1px solid #D6D1BF;border-radius:6px;padding:9px 10px;font-size:14px;background:#fff"><sc-for list="{{{{ it.statuses }}}}" as="o"><option value="{{{{ o.v }}}}">{{{{ o.v }}}}</option></sc-for></select></label>
                  <sc-if value="{{{{ it.hasNote }}}}" hint-placeholder-val="{{{{ true }}}}"><label style="flex:1;min-width:220px;display:flex;flex-direction:column;gap:5px;font-size:13px;font-weight:600;color:#3E4A3C"><span>{{{{ it.noteLabel }}}}</span><input value="{{{{ it.note }}}}" onChange="{{{{ it.onNote }}}}" style="border:1px solid #D6D1BF;border-radius:6px;padding:9px 10px;font-size:14px"></label></sc-if>
                  <button onClick="{{{{ it.save }}}}" style="border:0;cursor:pointer;background:#2E5E2F;color:#fff;font-size:14px;font-weight:600;padding:10px 16px;border-radius:6px">Save</button>
                </div>
              </sc-if>
              <sc-if value="{{{{ it.isMember }}}}" hint-placeholder-val="{{{{ false }}}}"><button onClick="{{{{ it.reset }}}}" style="align-self:flex-start;border:1px solid #D6D1BF;cursor:pointer;background:#fff;color:#1C2A1D;font-size:14px;font-weight:600;padding:9px 14px;border-radius:6px">Give a temporary password</button></sc-if>
            </div>
          </sc-for>
        </div>
      </sc-if>
'''
rep('''
      <div style="height:{{ A.bottomSpace }}"></div>
    </main>''', ADMIN + '''
      <div style="height:{{ A.bottomSpace }}"></div>
    </main>''')

# ---- temporary password dialog ----
rep('''<sc-if value="{{ hasToast }}" hint-placeholder-val="{{ false }}">''', f'''<sc-if value="{{{{ hasTempPw }}}}" hint-placeholder-val="{{{{ false }}}}">
  <div style="position:absolute;inset:0;z-index:55;background:rgba(28,42,29,.45);display:flex;align-items:center;justify-content:center;padding:12px">
    <div style="width:440px;max-width:100%;background:#fff;border-radius:8px;padding:24px;display:flex;flex-direction:column;gap:12px">
      <div style="font:700 21px {FONT}">Temporary password</div>
      <p style="margin:0;font-size:15px;color:#3E4A3C;line-height:1.55">Call {{{{ tempPw.name }}}} on {{{{ tempPw.phone }}}} and read this out. Ask them to change it in Profile and settings after they sign in. It will not be shown again.</p>
      <div style="font:700 24px ui-monospace,Menlo,Consolas,monospace;background:#F3F7EA;border-radius:6px;padding:14px;text-align:center;color:#1F4221;letter-spacing:.02em">{{{{ tempPw.password }}}}</div>
      <button onClick="{{{{ closeTempPw }}}}" style="align-self:flex-end;border:0;cursor:pointer;background:#2E5E2F;color:#fff;font-size:15px;font-weight:600;padding:11px 18px;border-radius:6px">Done</button>
    </div>
  </div>
</sc-if>

<sc-if value="{{{{ hasToast }}}}" hint-placeholder-val="{{{{ false }}}}">''')


# ---- centre every platform screen in the space beside the menu ----
src = src.replace('max-width:1180px', 'max-width:1180px;width:100%;margin-left:auto;margin-right:auto')
rep('gap:18px;max-width:820px">', 'gap:18px;max-width:820px;width:100%;margin-left:auto;margin-right:auto">')

# ---- swap in the new logic ----
start = src.index('<script type="text/x-dc" data-dc-script')
start = src.index('>', start) + 1
end = src.index('</script>', start)
src = src[:start] + '\n' + logic + '\n' + src[end:]

ver = sys.argv[1] if len(sys.argv) > 1 else 'dev'
src = src.replace('__VER__', ver)
(ROOT / 'site' / 'index.html').write_text(src, encoding='utf-8')
print('built', len(src), 'bytes')
