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

# ---- swap in the new logic ----
start = src.index('<script type="text/x-dc" data-dc-script')
start = src.index('>', start) + 1
end = src.index('</script>', start)
src = src[:start] + '\n' + logic + '\n' + src[end:]

ver = sys.argv[1] if len(sys.argv) > 1 else 'dev'
src = src.replace('__VER__', ver)
(ROOT / 'site' / 'index.html').write_text(src, encoding='utf-8')
print('built', len(src), 'bytes')
