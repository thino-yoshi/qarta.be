import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { redirect } from "next/navigation";
import { getPageContent } from "@/lib/content/getContent";
import DashboardShell from "./DashboardShell";

export default async function DashboardPage(props: {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
}) {
  const rawParams   = await props.searchParams;
  const stripeSuccess = rawParams?.stripe_success === "1";
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  // Rediriger l'admin vers son espace dédié
  if (user.email === process.env.QARTA_ADMIN_EMAIL) redirect("/admin");

  const admin = createAdminClient();

  const [merchantResult, loyaltyCardResult, content] = await Promise.all([
    admin.from("merchants").select("*").eq("id", user.id).single(),
    admin.from("merchant_card_designs").select("*").eq("merchant_id", user.id).maybeSingle(),
    getPageContent("dashboard"),
  ]);

  if (!merchantResult.data) redirect("/register");

  // Rediriger vers l'onboarding si le commerçant n'a pas encore créé sa carte
  if (!loyaltyCardResult.data) redirect("/onboarding.html");

  return (
    <DashboardShell
      user={{ id: user.id, email: user.email! }}
      merchant={merchantResult.data}
      loyaltyCard={loyaltyCardResult.data ?? null}
      stripeSuccess={stripeSuccess}
      content={{
        header:       content["dashboard-header"],
        cards:        content["dashboard-cards"],
        subscription: content["dashboard-subscription"],
        stats:        content["dashboard-stats"],
      }}
    />
  );
}
