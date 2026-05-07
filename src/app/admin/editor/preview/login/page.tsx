import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { getPageContent } from "@/lib/content/getContent";
import LoginForm from "@/app/login/LoginForm";

/** Preview-only page — shows LoginForm without auth redirects.
 *  Access restricted to the QARTA admin. */
export default async function PreviewLoginPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user || user.email !== process.env.QARTA_ADMIN_EMAIL) redirect("/login");

  const content = await getPageContent("login");
  return <LoginForm content={content["login-form"]} />;
}
