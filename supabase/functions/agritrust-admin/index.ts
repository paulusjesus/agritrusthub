// Team-only actions for the AgriTRUST admin page.
// The caller must be signed in and their phone must be on agritrust.admin_phones.
import { createClient } from "npm:@supabase/supabase-js@2.116.0";

const cors = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};
const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), { status, headers: { ...cors, "Content-Type": "application/json" } });

// Easy to read aloud over the phone: no 0/O or 1/l confusion.
function tempPassword(): string {
  const words = ["mahangu", "maize", "sorghum", "cattle", "goats", "harvest", "rain", "field", "kraal", "seed", "honey", "beans"];
  const pick = () => words[crypto.getRandomValues(new Uint32Array(1))[0] % words.length];
  const n = 100 + (crypto.getRandomValues(new Uint32Array(1))[0] % 900);
  return `${pick()}-${pick()}-${n}`;
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: cors });
  if (req.method !== "POST") return json({ error: "Method not allowed" }, 405);

  const auth = req.headers.get("Authorization") ?? "";
  const url = Deno.env.get("SUPABASE_URL")!;
  const asCaller = createClient(url, Deno.env.get("SUPABASE_ANON_KEY")!, {
    global: { headers: { Authorization: auth } },
    auth: { persistSession: false },
    db: { schema: "agritrust" },
  });
  const { data: isAdmin, error: adminErr } = await asCaller.rpc("is_admin");
  if (adminErr || !isAdmin) return json({ error: "Only the AgriTRUST team can do this." }, 403);

  let body: Record<string, unknown>;
  try { body = await req.json(); } catch { return json({ error: "Invalid request" }, 400); }

  const admin = createClient(url, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!, {
    auth: { persistSession: false },
    db: { schema: "agritrust" },
  });

  if (body.action === "reset_password") {
    const userId = String(body.user_id ?? "");
    const { data: member } = await admin.from("profiles").select("id, full_name").eq("id", userId).maybeSingle();
    if (!member) return json({ error: "Member not found." }, 404);
    const password = tempPassword();
    const { error } = await admin.auth.admin.updateUserById(userId, { password });
    if (error) return json({ error: "Could not reset the password. Please try again." }, 500);
    await admin.from("notifications").insert({
      user_id: userId, kind: "team", title: "Password reset",
      body: "The AgriTRUST team reset your password. Please change it in Profile and settings after you sign in.", go: "settings",
    });
    return json({ ok: true, name: member.full_name, password });
  }

  return json({ error: "Unknown action" }, 400);
});
