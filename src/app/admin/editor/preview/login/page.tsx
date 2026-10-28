import { getSession } from "@/lib/session";
import { redirect } from "next/navigation";
import { getPageContent } from "@/lib/content/getContent";
import LoginForm from "@/app/login/LoginForm";
import { sql } from "@/lib/neon";

/** Preview-only page — shows LoginForm without auth redirects.
 *  Access restricted to the QARTA admin. */
export default async function PreviewLoginPage() {
  const session = await getSession();
  if (!session) redirect("/login");
  const [row] = await sql`SELECT email FROM users WHERE id = ${session.id} LIMIT 1`;
  if ((row?.email as string) !== process.env.QARTA_ADMIN_EMAIL) redirect("/login");

  const content = await getPageContent("login");
  return <LoginForm content={content["login-form"]} />;
}
