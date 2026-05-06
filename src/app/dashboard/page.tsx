import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { redirect } from "next/navigation";
import DashboardShell from "./DashboardShell";

export default async function DashboardPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  // Rediriger l'admin vers son espace dédié
  if (user.email === process.env.QARTA_ADMIN_EMAIL) redirect("/admin");

  const admin = createAdminClient();

  const { data: merchant } = await admin
    .from("merchants")
    .select("*")
    .eq("id", user.id)
    .single();

  if (!merchant) redirect("/register");

  const { data: loyaltyCard } = await admin
    .from("merchant_card_designs")
    .select("*")
    .eq("merchant_id", user.id)
    .maybeSingle();

  return (
    <DashboardShell
      user={{ id: user.id, email: user.email! }}
      merchant={merchant}
      loyaltyCard={loyaltyCard ?? null}
    />
  );
}
