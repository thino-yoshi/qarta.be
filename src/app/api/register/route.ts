import { NextRequest, NextResponse } from "next/server";

const RAILWAY = process.env.RAILWAY_API_URL ?? "https://fidelitypass-production.up.railway.app";
const ADMIN_KEY = process.env.RAILWAY_JWT_SECRET!;

export async function POST(req: NextRequest) {
  const { email, password, first_name, last_name } = await req.json();
  const name = `${first_name ?? ""} ${last_name ?? ""}`.trim();

  const res = await fetch(`${RAILWAY}/auth/admin/create-merchant`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password, name, admin_key: ADMIN_KEY }),
  });

  const data = await res.json();

  let token: string | null = null;

  if (!res.ok) {
    // Email déjà dans Neon → tenter un login avec les mêmes credentials
    if (res.status === 400 && data.detail === "Email déjà utilisé") {
      const loginRes = await fetch(`${RAILWAY}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      if (!loginRes.ok) {
        return NextResponse.json({ error: "Email déjà utilisé et mot de passe incorrect" }, { status: 409 });
      }
      const loginData = await loginRes.json();
      token = loginData.token;
    } else {
      return NextResponse.json({ error: data.detail ?? "Inscription échouée" }, { status: res.status });
    }
  } else {
    token = data.token;
  }

  const response = NextResponse.json({ success: true });

  response.cookies.set("qarta_token", token!, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 7 * 24 * 60 * 60,
    path: "/",
  });

  return response;
}
