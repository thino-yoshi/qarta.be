import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { resend, FROM_EMAIL } from "@/lib/resend";
import { resetPasswordEmail } from "@/lib/emails/reset-password";

export async function POST(req: NextRequest) {
  const { email } = await req.json();
  if (!email) return NextResponse.json({ error: "Email requis" }, { status: 400 });

  const supabase = await createClient();

  /* Génère le lien via Supabase */
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.qarta.be";
  const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${siteUrl}/reset-password`,
  });

  if (error) {
    console.error("[send-reset-email]", error);
    /* On renvoie success quand même pour ne pas divulguer si l'email existe */
    return NextResponse.json({ success: true });
  }

  void data; /* lien non retourné côté client par Supabase — l'email est envoyé par Supabase Auth */

  /* Envoyer notre propre email stylé via Resend */
  const resetLink = `${siteUrl}/reset-password`;
  const tpl = resetPasswordEmail({ resetLink });

  await resend.emails.send({
    from: FROM_EMAIL,
    to: email,
    subject: tpl.subject,
    html: tpl.html,
  });

  return NextResponse.json({ success: true });
}
