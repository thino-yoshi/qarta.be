import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const response = NextResponse.redirect(new URL("/login", request.url), { status: 303 });
  response.cookies.delete("qarta_token");
  return response;
}
