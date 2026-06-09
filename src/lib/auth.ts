import { cookies } from "next/headers";
import type { SessionRole } from "@/types/reviews";
import {
  COOKIE_NAME,
  MAX_AGE,
  checkPassword,
  createSessionToken,
  verifySessionToken,
} from "@/lib/session";

export { COOKIE_NAME, MAX_AGE, checkPassword, verifySessionToken };

export async function getSessionRole(): Promise<SessionRole | null> {
  const jar = await cookies();
  const token = jar.get(COOKIE_NAME)?.value;
  if (!token) return null;
  return verifySessionToken(token);
}

export async function setSessionCookie(role: SessionRole) {
  const jar = await cookies();
  const token = await createSessionToken(role);
  jar.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: MAX_AGE,
    path: "/",
  });
}

export async function clearSessionCookie() {
  const jar = await cookies();
  jar.delete(COOKIE_NAME);
}
