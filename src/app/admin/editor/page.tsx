import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import EditorShell from "./EditorShell";

export const metadata = { title: "Éditeur de pages — QARTA Admin" };

export default async function EditorPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect("/login");
  if (user.email !== process.env.QARTA_ADMIN_EMAIL) redirect("/dashboard");

  return <EditorShell userEmail={user.email!} />;
}
