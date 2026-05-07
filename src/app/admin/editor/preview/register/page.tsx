import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { getPageContent } from "@/lib/content/getContent";
import RegisterForm from "@/app/register/RegisterForm";

/** Preview-only page — shows RegisterForm (all 3 steps navigable) without auth redirects. */
export default async function PreviewRegisterPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user || user.email !== process.env.QARTA_ADMIN_EMAIL) redirect("/login");

  const content = await getPageContent("register");
  return <RegisterForm content={content["register-form"]} />;
}
