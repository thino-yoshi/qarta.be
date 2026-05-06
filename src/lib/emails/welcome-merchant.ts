export function welcomeMerchantEmail({
  firstName,
  businessName,
}: {
  firstName: string;
  businessName: string;
}) {
  return {
    subject: `Bienvenue sur QARTA, ${firstName} 👋`,
    html: `<!DOCTYPE html>
<html lang="fr">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Bienvenue sur QARTA</title>
</head>
<body style="margin:0;padding:0;background:#f4f7fb;font-family:'Segoe UI',Arial,sans-serif;-webkit-font-smoothing:antialiased;">
<table width="100%" cellpadding="0" cellspacing="0" style="background:#f4f7fb;padding:40px 0;">
  <tr><td align="center">
    <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;">

      <!-- Header -->
      <tr><td style="background:#0b1220;border-radius:16px 16px 0 0;padding:32px 40px;text-align:center;">
        <div style="display:inline-flex;align-items:center;gap:10px;">
          <div style="width:40px;height:40px;background:#0f2044;border:1px solid rgba(74,158,255,0.3);border-radius:12px;display:inline-block;text-align:center;line-height:40px;">
            <span style="font-size:22px;font-weight:800;color:#4a9eff;letter-spacing:-0.04em;">Q</span>
          </div>
          <span style="font-size:20px;font-weight:700;color:#ffffff;letter-spacing:-0.02em;">QARTA</span>
        </div>
      </td></tr>

      <!-- Body -->
      <tr><td style="background:#ffffff;padding:40px 40px 32px;border-left:1px solid #e2eaf3;border-right:1px solid #e2eaf3;">
        <h1 style="margin:0 0 8px;font-size:26px;font-weight:700;color:#0b1220;letter-spacing:-0.02em;">
          Bienvenue, ${firstName} ! 🎉
        </h1>
        <p style="margin:0 0 24px;font-size:15px;color:#6a7388;line-height:1.6;">
          Votre espace commerçant <strong style="color:#0b1220;">${businessName}</strong> est prêt.
          Voici ce que vous pouvez faire dès maintenant.
        </p>

        <!-- Steps -->
        <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:28px;">
          ${[
            ["01", "Personnalisez votre carte de fidélité", "Couleurs, nom, programme de tampons — tout est configurable depuis le dashboard."],
            ["02", "Partagez votre QR code", "Vos clients scannent et rejoignent votre programme en 10 secondes."],
            ["03", "Activez les rappels automatiques", "Relancez vos clients inactifs sans lever le petit doigt."],
          ].map(([num, title, desc]) => `
          <tr><td style="padding:0 0 14px;">
            <table cellpadding="0" cellspacing="0" width="100%">
              <tr>
                <td style="width:36px;vertical-align:top;padding-top:2px;">
                  <div style="width:28px;height:28px;background:#eaf2fd;border-radius:8px;text-align:center;line-height:28px;font-size:11px;font-weight:700;color:#2c7be5;">${num}</div>
                </td>
                <td style="padding-left:12px;">
                  <div style="font-size:14px;font-weight:600;color:#0b1220;margin-bottom:3px;">${title}</div>
                  <div style="font-size:13px;color:#6a7388;line-height:1.5;">${desc}</div>
                </td>
              </tr>
            </table>
          </td></tr>`).join("")}
        </table>

        <!-- CTA -->
        <table width="100%" cellpadding="0" cellspacing="0">
          <tr><td align="center" style="padding-bottom:24px;">
            <a href="https://www.qarta.be/dashboard"
              style="display:inline-block;padding:14px 36px;background:#0b1220;color:#ffffff;text-decoration:none;border-radius:999px;font-size:15px;font-weight:600;letter-spacing:-0.01em;">
              Accéder à mon dashboard →
            </a>
          </td></tr>
        </table>

        <p style="margin:0;font-size:13px;color:#aab8cc;line-height:1.6;border-top:1px solid #f0f4f8;padding-top:20px;">
          Une question ? Répondez directement à cet email ou contactez-nous sur
          <a href="https://www.qarta.be" style="color:#2c7be5;">qarta.be</a>.
        </p>
      </td></tr>

      <!-- Footer -->
      <tr><td style="background:#f4f7fb;border:1px solid #e2eaf3;border-top:none;border-radius:0 0 16px 16px;padding:20px 40px;text-align:center;">
        <p style="margin:0;font-size:12px;color:#aab8cc;">
          © 2026 QARTA · Tous droits réservés ·
          <a href="https://www.qarta.be" style="color:#aab8cc;">qarta.be</a>
        </p>
      </td></tr>

    </table>
  </td></tr>
</table>
</body>
</html>`,
  };
}
