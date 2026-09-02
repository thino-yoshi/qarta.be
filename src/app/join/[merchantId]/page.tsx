import { createClient } from "@/lib/supabase/server";
import { Metadata } from "next";
import JoinClient from "./JoinClient";

interface Props {
  params: Promise<{ merchantId: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { merchantId } = await params;
  const supabase = await createClient();
  const { data } = await supabase
    .from("merchants")
    .select("business_name, category")
    .eq("id", merchantId)
    .single();

  const name = data?.business_name ?? "Qarta";
  return {
    title: `${name} — Carte de fidélité`,
    description: `Rejoins le programme de fidélité de ${name} sur l'app Qarta !`,
    other: {
      // Smart banner iOS (App Store app ID à renseigner)
      "apple-itunes-app": "app-id=XXXXXX,app-argument=https://qarta.be/join/" + merchantId,
    },
  };
}

export default async function JoinPage({ params }: Props) {
  const { merchantId } = await params;
  const supabase = await createClient();

  const { data: merchant } = await supabase
    .from("merchants")
    .select("id, business_name, category, logo_url")
    .eq("id", merchantId)
    .single();

  return <JoinClient merchant={merchant} merchantId={merchantId} />;
}
