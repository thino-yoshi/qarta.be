import { NextRequest, NextResponse } from "next/server";

const RAILWAY = process.env.RAILWAY_API_URL ?? "https://fidelitypass-production.up.railway.app";

export async function POST(req: NextRequest) {
  const { email, password } = await req.json();

  const res = await fetch(`${RAILWAY}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });

  const data = await res.json();

  if (!res.ok) {
    return NextResponse.json({ error: data.detail ?? "Connexion échouée" }, { status: res.status });
  }

  const response = NextResponse.json({
    success: true,
    user_type: data.user_type,
    name: data.name,
  });

  response.cookies.set("qarta_token", data.token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 7 * 24 * 60 * 60,
    path: "/",
  });

  return response;
}
