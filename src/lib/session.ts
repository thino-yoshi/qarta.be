import { cookies } from "next/headers";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.RAILWAY_JWT_SECRET!;
const COOKIE = "qarta_token";

export interface SessionPayload {
  id: string;
  user_type: string;
}

export async function getSession(): Promise<SessionPayload | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(COOKIE)?.value;
  if (!token) return null;
  try {
    const payload = jwt.verify(token, JWT_SECRET) as { sub: string; user_type: string };
    return { id: payload.sub, user_type: payload.user_type };
  } catch {
    return null;
  }
}
