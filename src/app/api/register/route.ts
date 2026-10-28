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

  if (!res.ok) {
    return NextResponse.json({ error: data.detail ?? "Inscription échouée" }, { status: res.status });
  }

  const response = NextResponse.json({ success: true });

  response.cookies.set("qarta_token", data.token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 7 * 24 * 60 * 60,
    path: "/",
  });

  return response;
}
