import { getPageContent } from "@/lib/content/getContent";
import LoginForm from "./LoginForm";

export default async function LoginPage() {
  const content = await getPageContent("login");
  return <LoginForm content={content["login-form"]} />;
}
