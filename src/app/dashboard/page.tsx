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
  if (!loyaltyCardResult.data) redirect("/onboarding.html");

  // ── Stats ──────────────────────────────────────────────────────────────────
  const merchantId = user.id;
  const since30 = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString();

  const [cardsRes, stampsRes, rewardsRes, scanRes, newClientsRes, recentCardsRes] = await Promise.all([
    admin.from("loyalty_cards").select("*", { count: "exact", head: true }).eq("merchant_id", merchantId),
    admin.from("loyalty_cards").select("stamps_count").eq("merchant_id", merchantId),
    admin.from("scan_history").select("*", { count: "exact", head: true }).eq("merchant_id", merchantId).eq("reward_reached", true),
    admin.from("scan_history").select("client_id").eq("merchant_id", merchantId),
    admin.from("loyalty_cards").select("created_at").eq("merchant_id", merchantId).gte("created_at", since30),
    admin.from("loyalty_cards").select("client_id, created_at, stamps_count").eq("merchant_id", merchantId).order("created_at", { ascending: false }).limit(5),
  ]);

  const totalClients = cardsRes.count ?? 0;
  const totalStamps  = (stampsRes.data ?? []).reduce((s, c) => s + (c.stamps_count ?? 0), 0);
  const totalRewards = rewardsRes.count ?? 0;

  // Taux de retour : clients avec >= 2 scans
  const scanCountByClient: Record<string, number> = {};
  for (const s of scanRes.data ?? []) {
    scanCountByClient[s.client_id] = (scanCountByClient[s.client_id] ?? 0) + 1;
  }
  const returning   = Object.values(scanCountByClient).filter(n => n >= 2).length;
  const returnRate  = totalClients ? Math.round((returning / totalClients) * 100) : 0;

  // Graphique 30j
  const dailyMap: Record<string, number> = {};
  for (let i = 0; i < 30; i++) {
    const d = new Date(Date.now() - (29 - i) * 24 * 60 * 60 * 1000);
    dailyMap[d.toISOString().split("T")[0]] = 0;
  }
  for (const c of newClientsRes.data ?? []) {
    const day = (c.created_at as string).split("T")[0];
    if (day in dailyMap) dailyMap[day]++;
  }
  const dailyData = Object.values(dailyMap);

  // Derniers clients + clients proches de récompense
  const stampsRequired      = (merchantResult.data.stamps_required as number) ?? 10;
  const inactiveThreshold   = (merchantResult.data.inactive_threshold_days as number) ?? 30;
  const allCardsRes         = await admin.from("loyalty_cards").select("client_id, stamps_count, created_at").eq("merchant_id", merchantId);
  const allCards            = allCardsRes.data ?? [];
  const nearRewardCards     = allCards.filter(c => {
    const remaining = stampsRequired - (c.stamps_count ?? 0);
    return remaining > 0 && remaining <= 2;
  });
  const nearRewardCount     = nearRewardCards.length;

  // Noms de tous les clients nécessaires (derniers + proches récompense)
  const clientIds           = (recentCardsRes.data ?? []).map(c => c.client_id);
  const nearClientIds       = nearRewardCards.slice(0, 5).map(c => c.client_id);
  const allClientIds        = [...new Set([...clientIds, ...nearClientIds])];
  const usersRes            = allClientIds.length
    ? await admin.from("users").select("id, name, email").in("id", allClientIds)
    : { data: [] };
  const userMap = Object.fromEntries((usersRes.data ?? []).map(u => [u.id, u]));

  const recentClients = (recentCardsRes.data ?? []).map(c => ({
    clientId: c.client_id,
    name:     (userMap[c.client_id] as { name?: string; email?: string })?.name
              ?? (userMap[c.client_id] as { name?: string; email?: string })?.email
              ?? "Client",
    stamps:   c.stamps_count ?? 0,
    joinedAt: c.created_at as string,
  }));

  const nearRewardClients = nearRewardCards.slice(0, 5).map(c => ({
    clientId:  c.client_id,
    name:      (userMap[c.client_id] as { name?: string; email?: string })?.name
               ?? (userMap[c.client_id] as { name?: string; email?: string })?.email
               ?? "Client",
    stamps:    c.stamps_count ?? 0,
    remaining: stampsRequired - (c.stamps_count ?? 0),
  }));

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
      stats={{ totalClients, totalStamps, totalRewards, returnRate, dailyData, recentClients, nearRewardCount, nearRewardClients, inactiveThreshold }}
    />
  );
}
