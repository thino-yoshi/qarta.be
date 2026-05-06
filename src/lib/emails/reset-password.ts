export function resetPasswordEmail({ resetLink }: { resetLink: string }) {
  return {
    subject: "Réinitialisation de votre mot de passe QARTA",
    html: `<!DOCTYPE html>
<html lang="fr">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head>
<body style="margin:0;padding:0;background:#f4f7fb;font-family:'Segoe UI',Arial,sans-serif;-webkit-font-smoothing:antialiased;">
<table width="100%" cellpadding="0" cellspacing="0" style="background:#f4f7fb;padding:40px 0;">
  <tr><td align="center">
    <table width="560" cellpadding="0" cellspacing="0" style="max-width:560px;width:100%;">

      <!-- Header -->
      <tr><td style="background:#0b1220;border-radius:16px 16px 0 0;padding:28px 36px;text-align:center;">
        <div style="display:inline-block;width:40px;height:40px;background:#0f2044;border:1px solid rgba(74,158,255,0.3);border-radius:12px;text-align:center;line-height:40px;">
          <span style="font-size:22px;font-weight:800;color:#4a9eff;">Q</span>
        </div>
        <span style="display:inline-block;font-size:18px;font-weight:700;color:#ffffff;vertical-align:middle;margin-left:10px;">QARTA</span>
      </td></tr>

      <!-- Body -->
      <tr><td style="background:#ffffff;padding:36px 36px 28px;border-left:1px solid #e2eaf3;border-right:1px solid #e2eaf3;">
        <h1 style="margin:0 0 8px;font-size:22px;font-weight:700;color:#0b1220;letter-spacing:-0.02em;">
          Réinitialiser votre mot de passe
        </h1>
        <p style="margin:0 0 28px;font-size:15px;color:#6a7388;line-height:1.6;">
          Vous avez demandé à réinitialiser votre mot de passe. Cliquez sur le bouton ci-dessous.
          Ce lien est valable <strong style="color:#0b1220;">1 heure</strong>.
        </p>

        <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:28px;">
          <tr><td align="center">
            <a href="${resetLink}"
              style="display:inline-block;padding:14px 36px;background:#0b1220;color:#ffffff;text-decoration:none;border-radius:999px;font-size:15px;font-weight:600;letter-spacing:-0.01em;">
              Réinitialiser mon mot de passe
            </a>
          </td></tr>
        </table>

        <p style="margin:0 0 8px;font-size:13px;color:#aab8cc;line-height:1.6;">
          Si vous n'avez pas demandé cette réinitialisation, ignorez simplement cet email.
        </p>
        <p style="margin:0;font-size:12px;color:#c5d0dc;word-break:break-all;">
          Lien : <a href="${resetLink}" style="color:#2c7be5;">${resetLink}</a>
        </p>
      </td></tr>

      <!-- Footer -->
      <tr><td style="background:#f4f7fb;border:1px solid #e2eaf3;border-top:none;border-radius:0 0 16px 16px;padding:18px 36px;text-align:center;">
        <p style="margin:0;font-size:12px;color:#aab8cc;">© 2026 QARTA · <a href="https://www.qarta.be" style="color:#aab8cc;">qarta.be</a></p>
      </td></tr>

    </table>
  </td></tr>
</table>
</body>
</html>`,
  };
}
