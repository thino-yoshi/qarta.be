"use client";

interface Merchant {
  id: string;
  business_name: string;
  category: string;
  logo_url: string | null;
}

interface Props {
  merchant: Merchant | null;
  merchantId: string;
}

const APP_STORE_URL = "https://apps.apple.com/app/qarta/idXXXXXXXXXX";
const PLAY_STORE_URL = "https://play.google.com/store/apps/details?id=com.yassin.fidelitypassapp";
const DEEP_LINK = (id: string) => `qarta://join/${id}`;

export default function JoinClient({ merchant, merchantId }: Props) {
  const name = merchant?.business_name ?? "ce commerçant";
  const category = merchant?.category ?? "";

  const handleOpen = () => {
    const deepLink = DEEP_LINK(merchantId);
    window.location.href = deepLink;

    // Fallback : si l'app n'est pas installée, redirige vers le store après 1,5s
    const isIOS = /iPhone|iPad|iPod/.test(navigator.userAgent);
    setTimeout(() => {
      window.location.href = isIOS ? APP_STORE_URL : PLAY_STORE_URL;
    }, 1500);
  };

  return (
    <div style={{
      minHeight: "100vh",
      background: "linear-gradient(135deg, #04132D 0%, #0B1F4A 50%, #0E1A3D 100%)",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      padding: "24px",
      fontFamily: "'Sora', -apple-system, BlinkMacSystemFont, sans-serif",
    }}>
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link href="https://fonts.googleapis.com/css2?family=Sora:wght@400;600;700;800&display=swap" rel="stylesheet" />

      {/* Logo Qarta */}
      <div style={{ marginBottom: 32, opacity: 0.6 }}>
        <span style={{ color: "#4A9EFF", fontSize: 13, fontWeight: 700, letterSpacing: 3 }}>QARTA</span>
      </div>

      {/* Card preview */}
      <div style={{
        width: "100%",
        maxWidth: 360,
        background: "linear-gradient(135deg, #1a2744 0%, #0d1b36 100%)",
        borderRadius: 20,
        padding: "24px 24px 20px",
        border: "1px solid rgba(74, 158, 255, 0.15)",
        boxShadow: "0 20px 60px rgba(0,0,0,0.5)",
        marginBottom: 32,
      }}>
        <div style={{ fontSize: 9, color: "rgba(255,255,255,0.5)", letterSpacing: 2, marginBottom: 4 }}>
          CARTE DE FIDÉLITÉ
        </div>

        {/* Logo + Nom */}
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20 }}>
          {merchant?.logo_url ? (
            <img
              src={merchant.logo_url}
              alt={name}
              style={{ width: 44, height: 44, borderRadius: 10, objectFit: "cover" }}
            />
          ) : (
            <div style={{
              width: 44, height: 44, borderRadius: 10,
              background: "linear-gradient(135deg, #4A9EFF, #2C7BE5)",
              display: "flex", alignItems: "center", justifyContent: "center",
              color: "white", fontWeight: 800, fontSize: 18,
            }}>
              {name.charAt(0).toUpperCase()}
            </div>
          )}
          <div>
            <div style={{ color: "white", fontWeight: 800, fontSize: 18, lineHeight: 1.1 }}>{name.toUpperCase()}</div>
            {category && <div style={{ color: "rgba(255,255,255,0.5)", fontSize: 11, marginTop: 2 }}>{category}</div>}
          </div>
        </div>

        {/* Tampons */}
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          {Array.from({ length: 10 }).map((_, i) => (
            <div key={i} style={{
              width: 28, height: 28, borderRadius: "50%",
              background: i === 0 ? "linear-gradient(135deg, #4A9EFF, #2C7BE5)" : "rgba(255,255,255,0.08)",
              border: "1.5px solid rgba(255,255,255,0.12)",
            }} />
          ))}
        </div>

        <div style={{ color: "rgba(255,255,255,0.4)", fontSize: 10, marginTop: 12 }}>
          Scanne chez {name} pour collecter tes tampons
        </div>
      </div>

      {/* Message */}
      <p style={{
        color: "rgba(255,255,255,0.85)",
        fontSize: 15,
        fontWeight: 600,
        textAlign: "center",
        maxWidth: 300,
        lineHeight: 1.5,
        marginBottom: 28,
      }}>
        Tu as été invité à rejoindre le programme de fidélité de <span style={{ color: "#4A9EFF" }}>{name}</span>
      </p>

      {/* Bouton principal */}
      <button
        onClick={handleOpen}
        style={{
          width: "100%",
          maxWidth: 320,
          padding: "16px 24px",
          borderRadius: 14,
          background: "linear-gradient(135deg, #4A9EFF, #2C7BE5)",
          color: "white",
          fontWeight: 700,
          fontSize: 16,
          border: "none",
          cursor: "pointer",
          marginBottom: 12,
          letterSpacing: 0.3,
        }}
      >
        Rejoindre avec Qarta
      </button>

      {/* Sous-titre téléchargement */}
      <p style={{ color: "rgba(255,255,255,0.4)", fontSize: 12, textAlign: "center", marginBottom: 16 }}>
        Pas encore l&apos;app ? Elle s&apos;ouvre directement dans le store.
      </p>

      {/* Badges store */}
      <div style={{ display: "flex", gap: 12 }}>
        <a href={APP_STORE_URL} style={{
          padding: "10px 18px",
          borderRadius: 10,
          background: "rgba(255,255,255,0.06)",
          border: "1px solid rgba(255,255,255,0.1)",
          color: "white",
          fontSize: 12,
          fontWeight: 600,
          textDecoration: "none",
        }}>
          🍎 App Store
        </a>
        <a href={PLAY_STORE_URL} style={{
          padding: "10px 18px",
          borderRadius: 10,
          background: "rgba(255,255,255,0.06)",
          border: "1px solid rgba(255,255,255,0.1)",
          color: "white",
          fontSize: 12,
          fontWeight: 600,
          textDecoration: "none",
        }}>
          ▶ Play Store
        </a>
      </div>

      <div style={{ color: "rgba(255,255,255,0.2)", fontSize: 10, marginTop: 40 }}>
        © Qarta — Cartes de fidélité digitales
      </div>
    </div>
  );
}
