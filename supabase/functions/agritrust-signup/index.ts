// Creates an AgriTRUST account from a phone number and password.
// Farmers sign in with their phone, so the login email is derived from it
// and confirmed straight away. No SMS or email is sent.
import { createClient } from "npm:@supabase/supabase-js@2.116.0";

const cors = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};
const REGIONS = ["Erongo", "Hardap", "//Karas", "Kavango East", "Kavango West", "Khomas", "Kunene", "Ohangwena", "Omaheke", "Omusati", "Oshana", "Oshikoto", "Otjozondjupa", "Zambezi"];
const ROLES = ["Farmer", "Landowner", "Buyer", "Transporter"];

export function normalisePhone(raw: string): string | null {
  let d = String(raw || "").replace(/\D/g, "");
  if (d.startsWith("00")) d = d.slice(2);
  if (d.length === 10 && d.startsWith("0")) d = "264" + d.slice(1);
  if (d.length === 9 && d.startsWith("8")) d = "264" + d;
  return d.length >= 9 && d.length <= 15 ? d : null;
}

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), { status, headers: { ...cors, "Content-Type": "application/json" } });

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: cors });
  if (req.method !== "POST") return json({ error: "Method not allowed" }, 405);
  let b: Record<string, unknown>;
  try { b = await req.json(); } catch { return json({ error: "Invalid request" }, 400); }

  const name = String(b.name ?? "").trim().slice(0, 120);
  const phone = normalisePhone(String(b.phone ?? ""));
  const password = String(b.password ?? "");
  const region = REGIONS.includes(String(b.region)) ? String(b.region) : "Khomas";
  const roles = String(b.roles ?? "Farmer").split(",").map((r) => r.trim()).filter((r) => ROLES.includes(r));

  if (name.length < 2) return json({ error: "Please add your full name." }, 400);
  if (!phone) return json({ error: "Please enter a valid phone number." }, 400);
  if (password.length < 8) return json({ error: "Your password needs at least 8 characters." }, 400);

  const admin = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!, {
    auth: { persistSession: false },
    db: { schema: "agritrust" },
  });

  const { data: taken } = await admin.from("profile_private").select("id").eq("phone", phone).maybeSingle();
  if (taken) return json({ error: "This phone number already has an account. Please sign in." }, 409);

  const { data, error } = await admin.auth.admin.createUser({
    email: `${phone}@phone.agritrusthub.com`,
    password,
    email_confirm: true,
    user_metadata: { app: "agritrust", full_name: name, phone },
  });
  if (error || !data.user) {
    const msg = /already/i.test(error?.message ?? "") ? "This phone number already has an account. Please sign in." : "We could not create your account. Please try again.";
    return json({ error: msg }, 400);
  }
  const id = data.user.id;
  const p1 = await admin.from("profiles").insert({ id, full_name: name, region, roles: (roles.length ? roles : ["Farmer"]).join(", ") });
  const p2 = await admin.from("profile_private").insert({ id, phone });
  if (p1.error || p2.error) {
    await admin.auth.admin.deleteUser(id);
    return json({ error: "We could not finish setting up your account. Please try again." }, 500);
  }
  return json({ ok: true, login: `${phone}@phone.agritrusthub.com` });
});
