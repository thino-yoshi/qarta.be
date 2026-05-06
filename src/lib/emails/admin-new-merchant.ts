export function adminNewMerchantEmail({
  firstName,
  lastName,
  businessName,
  category,
  email,
  phone,
  city,
  numLocations,
}: {
  firstName: string;
  lastName: string;
  businessName: string;
  category: string;
  email: string;
  phone: string;
  city: string;
  numLocations: string | number;
}) {
  return {
    subject: `🆕 Nouveau commerçant inscrit — ${businessName}`,
    html: `<!DOCTYPE html>
<html lang="fr">
<head><meta charset="UTF-8"></head>
<body style="margin:0;padding:0;background:#f4f7fb;font-family:'Segoe UI',Arial,sans-serif;">
<table width="100%" cellpadding="0" cellspacing="0" style="background:#f4f7fb;padding:40px 0;">
  <tr><td align="center">
    <table width="560" cellpadding="0" cellspacing="0" style="max-width:560px;width:100%;">

      <!-- Header -->
      <tr><td style="background:#0b1220;border-radius:16px 16px 0 0;padding:24px 32px;">
        <span style="font-size:13px;font-weight:600;color:#4a9eff;letter-spacing:0.1em;text-transform:uppercase;">QARTA Admin</span>
        <h2 style="margin:4px 0 0;font-size:20px;font-weight:700;color:#ffffff;">Nouveau commerçant inscrit</h2>
      </td></tr>

      <!-- Body -->
      <tr><td style="background:#ffffff;padding:28px 32px;border-left:1px solid #e2eaf3;border-right:1px solid #e2eaf3;">

        <!-- Badge -->
        <div style="display:inline-block;background:#eaf2fd;border:1px solid #bcd9f5;border-radius:8px;padding:6px 14px;font-size:13px;font-weight:600;color:#2c7be5;margin-bottom:20px;">
          ${businessName}
        </div>

        <!-- Info table -->
        <table width="100%" cellpadding="0" cellspacing="0" style="border:1px solid #e8f0f8;border-radius:12px;overflow:hidden;">
          ${[
            ["Commerce", businessName],
            ["Catégorie", category],
            ["Nom", `${firstName} ${lastName}`],
            ["Email", email],
            ["Téléphone", phone],
            ["Ville", city],
            ["Établissements", String(numLocations)],
          ].map(([label, value], i) => `
          <tr style="background:${i % 2 === 0 ? "#f8fbff" : "#ffffff"};">
            <td style="padding:10px 16px;font-size:13px;font-weight:600;color:#6a7388;width:140px;white-space:nowrap;">${label}</td>
            <td style="padding:10px 16px;font-size:13px;font-weight:500;color:#0b1220;">${value}</td>
          </tr>`).join("")}
        </table>

        <!-- CTA admin -->
        <table width="100%" cellpadding="0" cellspacing="0" style="margin-top:24px;">
          <tr><td>
            <a href="https://www.qarta.be/admin"
              style="display:inline-block;padding:11px 24px;background:#0b1220;color:#ffffff;text-decoration:none;border-radius:999px;font-size:14px;font-weight:600;">
              Voir dans l'admin →
            </a>
          </td></tr>
        </table>
      </td></tr>

      <!-- Footer -->
      <tr><td style="background:#f4f7fb;border:1px solid #e2eaf3;border-top:none;border-radius:0 0 16px 16px;padding:16px 32px;text-align:center;">
        <p style="margin:0;font-size:12px;color:#aab8cc;">QARTA · Notification interne automatique</p>
      </td></tr>

    </table>
  </td></tr>
</table>
</body>
</html>`,
  };
}
