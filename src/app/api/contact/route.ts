import { NextRequest, NextResponse } from "next/server";
import { resend, FROM_EMAIL } from "@/lib/resend";

const CONTACT_EMAIL = "qarta.contact@gmail.com";

export async function POST(req: NextRequest) {
  const { name, email, message } = await req.json();

  if (!name || !email || !message) {
    return NextResponse.json({ error: "Champs manquants" }, { status: 400 });
  }

  const { error } = await resend.emails.send({
    from: FROM_EMAIL,
    to: CONTACT_EMAIL,
    reply_to: email,
    subject: `Message de ${name} via qarta.be`,
    html: `
      <div style="font-family:'Manrope',sans-serif;max-width:560px;margin:0 auto;color:#0f2044;">
        <div style="background:#0f2044;border-radius:12px 12px 0 0;padding:28px 32px;">
          <span style="color:#4a9eff;font-size:22px;font-weight:800;letter-spacing:-0.03em;">QARTA</span>
          <p style="color:rgba(255,255,255,0.5);font-size:12px;margin:4px 0 0;">Nouveau message via le formulaire de contact</p>
        </div>
        <div style="background:#fff;border:1px solid #e2eaf5;border-top:none;border-radius:0 0 12px 12px;padding:32px;">
          <table style="width:100%;border-collapse:collapse;margin-bottom:24px;">
            <tr>
              <td style="padding:8px 0;font-size:12px;color:#7a96b0;font-weight:600;text-transform:uppercase;letter-spacing:0.08em;width:90px;">Nom</td>
              <td style="padding:8px 0;font-size:14px;color:#0f2044;font-weight:600;">${name}</td>
            </tr>
            <tr>
              <td style="padding:8px 0;font-size:12px;color:#7a96b0;font-weight:600;text-transform:uppercase;letter-spacing:0.08em;">Email</td>
              <td style="padding:8px 0;font-size:14px;color:#2c7be5;"><a href="mailto:${email}" style="color:#2c7be5;text-decoration:none;">${email}</a></td>
            </tr>
          </table>
          <div style="background:#f6f8fb;border-radius:10px;padding:20px;font-size:14px;color:#0f2044;line-height:1.7;white-space:pre-wrap;">${message}</div>
          <p style="margin-top:24px;font-size:11px;color:#b0bcd0;">Vous pouvez répondre directement à cet email — la réponse partira vers ${email}</p>
        </div>
      </div>
    `,
  });

  if (error) {
    console.error("[contact]", error);
    return NextResponse.json({ error: "Erreur d'envoi" }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
