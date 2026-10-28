import { getSession } from "@/lib/session";
import { redirect } from "next/navigation";
import { sql } from "@/lib/neon";
import EditorShell from "./EditorShell";

export const metadata = { title: "Éditeur de pages — QARTA Admin" };

export default async function EditorPage() {
  const session = await getSession();
  if (!session) redirect("/login");

  const [userRow] = await sql`SELECT email FROM users WHERE id = ${session.id} LIMIT 1`;
  if ((userRow?.email as string) !== process.env.QARTA_ADMIN_EMAIL) redirect("/dashboard");

  return <EditorShell userEmail={(userRow?.email as string) ?? ""} />;
}
