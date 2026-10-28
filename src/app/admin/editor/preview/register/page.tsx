import { getSession } from "@/lib/session";
import { redirect } from "next/navigation";
import { getPageContent } from "@/lib/content/getContent";
import RegisterForm from "@/app/register/RegisterForm";
import { sql } from "@/lib/neon";

/** Preview-only page — shows RegisterForm (all 3 steps navigable) without auth redirects. */
export default async function PreviewRegisterPage() {
  const session = await getSession();
  if (!session) redirect("/login");
  const [row] = await sql`SELECT email FROM users WHERE id = ${session.id} LIMIT 1`;
  if ((row?.email as string) !== process.env.QARTA_ADMIN_EMAIL) redirect("/login");

  const content = await getPageContent("register");
  return <RegisterForm content={content["register-form"]} />;
}
