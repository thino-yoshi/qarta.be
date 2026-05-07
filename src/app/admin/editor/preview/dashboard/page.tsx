import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { getPageContent } from "@/lib/content/getContent";
import DashboardShell from "@/app/dashboard/DashboardShell";

/** Fictional merchant for preview — no real DB data involved. */
const MOCK_MERCHANT = {
  id: "preview",
  business_name: "Café du Coin",
  first_name: "Jean",
  last_name: "Dupont",
  email: "jean@cafecoin.be",
  phone: "+32 470 00 00 00",
  address: "Rue de la Loi 42",
  postal_code: "1000",
  city: "Bruxelles",
  country: "Belgique",
  category: "Coffee shop / Café",
  website: "https://cafecoin.be",
  subscription_status: "active",
  created_at: new Date().toISOString(),
};

const MOCK_LOYALTY_CARD = {
  id: "preview-card",
  merchant_id: "preview",
  design: {
    primaryColor: "#2c7be5",
    secondaryColor: "#0f2044",
    title: "Café du Coin",
    stampCount: 10,
    reward: "Un café offert",
  },
};

/** Preview-only page — shows DashboardShell with mock merchant data. */
export default async function PreviewDashboardPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user || user.email !== process.env.QARTA_ADMIN_EMAIL) redirect("/login");

  const content = await getPageContent("dashboard");

  return (
    <DashboardShell
      user={{ id: "preview", email: "jean@cafecoin.be" }}
      merchant={MOCK_MERCHANT}
      loyaltyCard={MOCK_LOYALTY_CARD}
      content={{
        header: content["dashboard-header"],
        cards:  content["dashboard-cards"],
      }}
    />
  );
}
