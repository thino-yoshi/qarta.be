import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export default async function DashboardPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  return (
    <div
      className="min-h-screen flex items-center justify-center"
      style={{ background: "#0b1220", color: "white", fontFamily: "Manrope, sans-serif" }}
    >
      <div className="text-center">
        <div className="text-[13px] text-white/40 uppercase tracking-widest mb-3">Dashboard commerçant</div>
        <h1 className="text-[2rem] font-bold">Bienvenue 👋</h1>
        <p className="text-white/50 mt-2 text-[15px]">{user.email}</p>
        <form action="/api/logout" method="POST" className="mt-8">
          <button
            type="submit"
            className="px-6 py-2.5 rounded-full text-[14px] font-semibold text-white/70 border border-white/15 hover:border-white/30 transition-colors"
          >
            Se déconnecter
          </button>
        </form>
      </div>
    </div>
  );
}
