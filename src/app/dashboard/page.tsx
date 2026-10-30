import { getSession } from "@/lib/session";
import { redirect } from "next/navigation";
import { getPageContent } from "@/lib/content/getContent";
import { sql } from "@/lib/neon";
import DashboardShell from "./DashboardShell";

export default async function DashboardPage(props: {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
}) {
  const rawParams      = await props.searchParams;
  const stripeSuccess  = rawParams?.stripe_success === "1";

  const session = await getSession();
  if (!session) redirect("/login");

  const userId = session.id;

  const [userRows, merchantRows, loyaltyCardRows, content] = await Promise.all([
    sql`SELECT email FROM users WHERE id = ${userId} LIMIT 1`,
    sql`SELECT * FROM merchants WHERE id = ${userId} LIMIT 1`,
    sql`SELECT * FROM merchant_card_designs WHERE merchant_id = ${userId} LIMIT 1`,
    getPageContent("dashboard"),
  ]);

  const userRow     = userRows[0];
  const merchant    = merchantRows[0];
  const loyaltyCard = loyaltyCardRows[0] ?? null;

  if ((userRow?.email as string) === process.env.QARTA_ADMIN_EMAIL) redirect("/admin");

  if (!merchant) redirect("/register");
  if (!loyaltyCard) redirect("/onboarding.html");

  // ── Stats ────────────────────────────────────────────────────────────────────
  const merchantId = userId;
  const since30    = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString();

  const [cardsCountRes, stampsRes, rewardsCountRes, scanRes, newClientsRes, recentCardsRes] =
    await Promise.all([
      sql`SELECT COUNT(*) AS count FROM loyalty_cards WHERE merchant_id = ${merchantId}`,
      sql`SELECT stamps_count FROM loyalty_cards WHERE merchant_id = ${merchantId}`,
      sql`SELECT COUNT(*) AS count FROM scan_history WHERE merchant_id = ${merchantId} AND reward_reached = true`,
      sql`SELECT client_id FROM scan_history WHERE merchant_id = ${merchantId}`,
      sql`SELECT created_at FROM loyalty_cards WHERE merchant_id = ${merchantId} AND created_at >= ${since30}`,
      sql`SELECT client_id, created_at, stamps_count FROM loyalty_cards WHERE merchant_id = ${merchantId} ORDER BY created_at DESC LIMIT 5`,
    ]);

  const totalClients = Number(cardsCountRes[0]?.count ?? 0);
  const totalStamps  = (stampsRes as Array<{ stamps_count: number }>)
    .reduce((s, c) => s + (c.stamps_count ?? 0), 0);
  const totalRewards = Number(rewardsCountRes[0]?.count ?? 0);

  const scanCountByClient: Record<string, number> = {};
  for (const s of scanRes as Array<{ client_id: string }>) {
    scanCountByClient[s.client_id] = (scanCountByClient[s.client_id] ?? 0) + 1;
  }
  const returning  = Object.values(scanCountByClient).filter(n => n >= 2).length;
  const returnRate = totalClients ? Math.round((returning / totalClients) * 100) : 0;

  const dailyMap: Record<string, number> = {};
  for (let i = 0; i < 30; i++) {
    const d = new Date(Date.now() - (29 - i) * 24 * 60 * 60 * 1000);
    dailyMap[d.toISOString().split("T")[0]] = 0;
  }
  for (const c of newClientsRes as Array<{ created_at: string | Date }>) {
    const day = new Date(c.created_at).toISOString().split("T")[0];
    if (day in dailyMap) dailyMap[day]++;
  }
  const dailyData = Object.values(dailyMap);

  const stampsRequired    = (merchant.stamps_required    as number) ?? 10;
  const inactiveThreshold = (merchant.inactive_threshold_days as number) ?? 30;

  const allCardsRes = await sql`
    SELECT client_id, stamps_count, created_at FROM loyalty_cards WHERE merchant_id = ${merchantId}
  `;
  const allCards = allCardsRes as Array<{ client_id: string; stamps_count: number; created_at: string }>;

  const nearRewardCards = allCards.filter(c => {
    const remaining = stampsRequired - (c.stamps_count ?? 0);
    return remaining > 0 && remaining <= 10;
  });
  const nearRewardCount = nearRewardCards.length;

  const clientIds    = (recentCardsRes as Array<{ client_id: string }>).map(c => c.client_id);
  const nearClientIds = nearRewardCards.slice(0, 5).map(c => c.client_id);
  const allClientIds  = [...new Set([...clientIds, ...nearClientIds])];

  const usersRes = allClientIds.length > 0
    ? await sql`SELECT id, name, email FROM users WHERE id = ANY(${allClientIds})`
    : [];

  type UserRow = { id: string; name?: string; email?: string };
  const userMap = Object.fromEntries((usersRes as UserRow[]).map(u => [u.id, u]));

  const recentClients = (recentCardsRes as Array<{ client_id: string; stamps_count: number; created_at: string | Date }>).map(c => ({
    clientId: c.client_id,
    name:     userMap[c.client_id]?.name ?? userMap[c.client_id]?.email ?? "Client",
    stamps:   c.stamps_count ?? 0,
    joinedAt: new Date(c.created_at).toISOString(),
  }));

  const nearRewardClients = nearRewardCards.slice(0, 5).map(c => ({
    clientId:  c.client_id,
    name:      userMap[c.client_id]?.name ?? userMap[c.client_id]?.email ?? "Client",
    stamps:    c.stamps_count ?? 0,
    remaining: stampsRequired - (c.stamps_count ?? 0),
  }));

  return (
    <DashboardShell
      user={{ id: userId, email: (userRow?.email as string) ?? "" }}
      merchant={merchant}
      loyaltyCard={loyaltyCard}
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
