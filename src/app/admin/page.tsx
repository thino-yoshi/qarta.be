import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { Users, Store, CreditCard, TrendingUp, LogOut, Settings, ShieldCheck } from "lucide-react";
import { QartaLogo, QartaWordmark } from "../components/QartaLogo";

async function setMerchantStatus(formData: FormData) {
  "use server";
  const id = formData.get("id") as string;
  const newStatus = formData.get("new_status") as string;
  const admin = createAdminClient();
  await admin.from("merchants").update({ subscription_status: newStatus }).eq("id", id);
  revalidatePath("/admin");
}

export default async function AdminPage() {
  /* ── Auth vérification ── */
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");
  const adminEmail = process.env.QARTA_ADMIN_EMAIL;
  if (user.email !== adminEmail) redirect("/dashboard");

  /* ── Données via service role ── */
  const admin = createAdminClient();

  const { data: merchants } = await admin
    .from("merchants")
    .select("*")
    .order("created_at", { ascending: false });

  const total = merchants?.length ?? 0;
  const active = merchants?.filter((m) => m.subscription_status === "active").length ?? 0;
  const pending = merchants?.filter((m) => m.subscription_status === "pending").length ?? 0;

  const now = new Date();
  const firstOfMonth = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();
  const newThisMonth = merchants?.filter((m) => m.created_at >= firstOfMonth).length ?? 0;

  return (
    <div className="min-h-screen" style={{ background: "#0b1220", fontFamily: "Manrope, sans-serif", color: "#fff" }}>
      {/* Glows */}
      <div className="fixed -top-40 -right-40 w-[600px] h-[600px] rounded-full opacity-20 blur-3xl pointer-events-none"
        style={{ background: "radial-gradient(circle, rgba(74,158,255,0.5), transparent 65%)" }} />
      <div className="fixed bottom-0 -left-40 w-[400px] h-[400px] rounded-full opacity-15 blur-3xl pointer-events-none"
        style={{ background: "radial-gradient(circle, rgba(44,123,229,0.5), transparent 65%)" }} />

      {/* Header */}
      <header className="relative z-10 flex items-center justify-between px-8 py-5 border-b" style={{ borderColor: "rgba(255,255,255,0.07)" }}>
        <div className="flex items-center gap-3">
          <QartaLogo size={36} variant="badge" />
          <QartaWordmark color="#ffffff" />
          <div className="ml-3 flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-widest"
            style={{ background: "rgba(74,158,255,0.12)", border: "1px solid rgba(74,158,255,0.25)", color: "#4a9eff" }}>
            <ShieldCheck size={11} strokeWidth={2.5} />
            Propriétaire
          </div>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-[13px] text-white/40">{user.email}</span>
          <form action="/api/logout" method="POST">
            <button type="submit" className="flex items-center gap-2 text-[13px] text-white/40 hover:text-white/70 transition-colors px-4 py-2 rounded-xl"
              style={{ border: "1px solid rgba(255,255,255,0.08)" }}>
              <LogOut size={14} /> Déconnexion
            </button>
          </form>
        </div>
      </header>

      <div className="relative z-10 max-w-7xl mx-auto px-8 py-10">

        {/* Titre */}
        <div className="mb-10">
          <p className="text-[12px] text-white/35 uppercase tracking-widest mb-2">Tableau de bord</p>
          <h1 className="text-[28px] font-bold" style={{ letterSpacing: "-0.02em" }}>Espace propriétaire QARTA</h1>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
          {[
            { label: "Commerçants total", value: total, icon: Store, color: "#4a9eff" },
            { label: "Abonnements actifs", value: active, icon: CreditCard, color: "#27ae60" },
            { label: "En attente", value: pending, icon: Settings, color: "#f39c12" },
            { label: "Nouveaux ce mois", value: newThisMonth, icon: TrendingUp, color: "#9b59b6" },
          ].map(({ label, value, icon: Icon, color }) => (
            <div key={label} className="rounded-2xl p-5" style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}>
              <div className="flex items-center justify-between mb-4">
                <span className="text-[12px] text-white/40 uppercase tracking-wider">{label}</span>
                <div className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ background: `${color}18` }}>
                  <Icon size={15} color={color} strokeWidth={2} />
                </div>
              </div>
              <p className="text-[32px] font-bold" style={{ color }}>{value}</p>
            </div>
          ))}
        </div>

        {/* Table commerçants */}
        <div className="rounded-2xl overflow-hidden" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)" }}>
          <div className="flex items-center justify-between px-6 py-4 border-b" style={{ borderColor: "rgba(255,255,255,0.07)" }}>
            <div className="flex items-center gap-2">
              <Users size={16} color="#4a9eff" strokeWidth={2} />
              <h2 className="text-[15px] font-semibold">Liste des commerçants</h2>
            </div>
            <span className="text-[12px] text-white/30">{total} inscrits</span>
          </div>

          {total === 0 ? (
            <div className="py-16 text-center text-white/25 text-[14px]">Aucun commerçant inscrit pour l'instant.</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-[13px]">
                <thead>
                  <tr style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
                    {["Commerce", "Propriétaire", "Email", "Ville", "Catégorie", "Statut", "Inscrit le", "Action"].map((h) => (
                      <th key={h} className="text-left px-6 py-3 text-[11px] uppercase tracking-wider text-white/30 font-semibold">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {merchants?.map((m, i) => (
                    <tr key={m.id}
                      style={{ borderBottom: i < total - 1 ? "1px solid rgba(255,255,255,0.04)" : "none" }}
                      className="hover:bg-white/[0.02] transition-colors">
                      <td className="px-6 py-4 font-semibold text-white">{m.business_name || "—"}</td>
                      <td className="px-6 py-4 text-white/70">{m.first_name} {m.last_name}</td>
                      <td className="px-6 py-4 text-white/50">{m.email}</td>
                      <td className="px-6 py-4 text-white/50">{m.city || "—"}</td>
                      <td className="px-6 py-4 text-white/50">{m.category || "—"}</td>
                      <td className="px-6 py-4">
                        <StatusBadge status={m.subscription_status} />
                      </td>
                      <td className="px-6 py-4 text-white/35">
                        {m.created_at ? new Date(m.created_at).toLocaleDateString("fr-BE") : "—"}
                      </td>
                      <td className="px-6 py-4">
                        <form action={setMerchantStatus}>
                          <input type="hidden" name="id" value={m.id} />
                          <input type="hidden" name="new_status" value={m.subscription_status === "active" ? "pending" : "active"} />
                          <button
                            type="submit"
                            className="px-3 py-1.5 rounded-xl text-[11px] font-bold transition-all hover:scale-105 whitespace-nowrap"
                            style={
                              m.subscription_status === "active"
                                ? { background: "rgba(231,76,60,0.12)", border: "1px solid rgba(231,76,60,0.3)", color: "#e74c3c" }
                                : { background: "rgba(39,174,96,0.12)", border: "1px solid rgba(39,174,96,0.3)", color: "#27ae60" }
                            }
                          >
                            {m.subscription_status === "active" ? "✕ Désactiver" : "✓ Activer"}
                          </button>
                        </form>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const styles: Record<string, { bg: string; color: string; label: string }> = {
    active:   { bg: "rgba(39,174,96,0.15)",  color: "#27ae60", label: "Actif" },
    pending:  { bg: "rgba(243,156,18,0.15)", color: "#f39c12", label: "En attente" },
    inactive: { bg: "rgba(231,76,60,0.15)",  color: "#e74c3c", label: "Inactif" },
    trial:    { bg: "rgba(74,158,255,0.15)", color: "#4a9eff", label: "Essai" },
  };
  const s = styles[status] ?? { bg: "rgba(255,255,255,0.08)", color: "rgba(255,255,255,0.4)", label: status };
  return (
    <span className="px-2.5 py-1 rounded-full text-[11px] font-semibold"
      style={{ background: s.bg, color: s.color }}>
      {s.label}
    </span>
  );
}
