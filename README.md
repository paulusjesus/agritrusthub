# AgriTRUST

The website and platform behind [agritrusthub.com](https://agritrusthub.com).

AgriTRUST helps farmers in Namibia sell produce and livestock to buyers they can check, agree each deal in writing, find land to farm and keep simple farm records. The design was made in Claude Design and is now wired to a real database, so accounts, listings, offers and messages are saved.

## What is in this repository

| Folder | What it holds |
| --- | --- |
| `site/` | Everything that is uploaded to Hostinger. This is the live website. |
| `src/` | The original Claude Design export (`template-original.html`) and the app logic (`logic.js`). |
| `build.py` | Combines the two files in `src/` into `site/index.html`. |
| `supabase/migrations/` | The database tables, security rules, photo storage and live updates. |
| `supabase/functions/agritrust-signup/` | The sign-up service that creates an account from a phone number and password. |
| `supabase/functions/agritrust-admin/` | Team-only actions, such as giving a member a temporary password. |

## How it works

* The site is plain HTML and JavaScript, so any web host can serve it. React and the Supabase client are kept in `site/vendor/` rather than loaded from outside services.
* Data lives in Supabase, in its own `agritrust` schema inside the Ubuntu Finance project. Every table has row level security, so people can only change their own records and only read what they are meant to see.
* Farmers sign in with their phone number and a password. The sign-up service turns the phone number into a private login address and confirms it straight away, so no SMS or email is needed.
* The demo ("Try the demo") still runs on sample data in the browser and saves nothing. Real accounts only ever see real data.

## What is real and what is not yet

Working with real data: accounts and profiles, profile photos, Marketplace listings with photos (edit, sold, remove, share on WhatsApp), saving listings, offers and counter-offers, signing deal agreements, chat, notifications, Barter Exchange, LandShare, Theft Alerts, Community posts, likes and replies, Farm Accounting, Dispute Centre, truck requests, loan applications, QualityScan photo submissions, course sign-ups, the contact form, agent call requests and the Buyer Request Board.

Not live yet, and labelled as such on the site: escrow payments, the QualityScan AI model (photos are graded by hand for now), lending through Harvest Finance, the FarmScore, Academy course content and SMS or WhatsApp alerts.

## Page addresses

Every page has its own address, so the back button works and links can be shared: `/about`, `/privacy`, `/terms`, `/app/market`, `/app/deal`, `/listing/12` and so on. The `.htaccess` file sends every address to `index.html`, and the app opens the right page. `sitemap.xml` lists the public pages for Google.

## The team admin page

Team members open it at `/app/admin` after signing in. It lists call requests, contact messages, buyer requests, loan applications, truck requests, QualityScan photos to grade, disputes and theft reports, each with a status and a note. Members are told in their notifications when the team updates their request. The Members tab can give someone a temporary password over the phone.

Only people on the team list can open it. The team member signs up on the site first. Then run this in the Supabase SQL editor with their number in international form, and check that the name it shows is really them:

```sql
insert into agritrust.admin_phones (phone, note, user_id)
select pp.phone, p.full_name, pp.id
from agritrust.profile_private pp join agritrust.profiles p using (id)
where pp.phone = '264811234567'
returning phone, note;
```

The row is tied to that account, so registering the same number again later does not give anyone else access.

## Backups

Every Sunday at 03:00 Windhoek time a full copy of the AgriTRUST records is saved inside the database (the `agritrust-weekly-backup` job). Team admins see the copies under Backups on the admin page, can take a copy straight away and can download any copy as a file to keep in Google Drive. Photos are not in the copy; they stay in the `agritrust` storage bucket.

## Security

* Members can only change the columns the app edits. Nobody can change their own phone number, give a listing a grade, edit another person's chat message or mark a deal signed on their own.
* Admin access is tied to the account as well as the phone number.
* Sign-up allows 10 attempts an hour from one connection, and the public forms slow down if they are flooded.
* Sign-up does not check the phone number by SMS yet, so treat a new account's number as unconfirmed until an agent has spoken to the person.

## Making changes

1. Edit `src/logic.js` for behaviour, or add a change to `build.py` for the page layout.
2. Run `python3 build.py <version>` to rebuild `site/index.html`.
3. Upload the changed files in `site/` to `public_html` on Hostinger.

## Where to see what people send

Contact messages, agent call requests, buyer requests, disputes, loan applications, truck requests and QualityScan photos are all tables in the `agritrust` schema in the Supabase dashboard.

## Licence

GNU Affero General Public Licence version 3. See `LICENSE`.
