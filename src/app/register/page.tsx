import { getPageContent } from "@/lib/content/getContent";
import RegisterForm from "./RegisterForm";

export default async function RegisterPage() {
  const content = await getPageContent("register");
  return <RegisterForm content={content["register-form"]} />;
}
