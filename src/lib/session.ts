import type { SessionRole } from "@/types/reviews";

export const COOKIE_NAME = "encc_session";
export const MAX_AGE = 60 * 60 * 24 * 7; // 7 days

function getSecret() {
  return process.env.ENCC_SESSION_SECRET || "dev-secret-change-me";
}

function toBase64Url(bytes: Uint8Array): string {
  let binary = "";
  for (const b of bytes) binary += String.fromCharCode(b);
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

function fromBase64Url(str: string): Uint8Array {
  const padded = str.replace(/-/g, "+").replace(/_/g, "/");
  const pad = padded.length % 4 === 0 ? "" : "=".repeat(4 - (padded.length % 4));
  const binary = atob(padded + pad);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
  return bytes;
}

async function sign(payload: string): Promise<string> {
  const enc = new TextEncoder();
  const key = await crypto.subtle.importKey(
    "raw",
    enc.encode(getSecret()),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
  const sig = await crypto.subtle.sign("HMAC", key, enc.encode(payload));
  return toBase64Url(new Uint8Array(sig));
}

async function verify(payload: string, signature: string): Promise<boolean> {
  const enc = new TextEncoder();
  const key = await crypto.subtle.importKey(
    "raw",
    enc.encode(getSecret()),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["verify"]
  );
  try {
    return await crypto.subtle.verify(
      "HMAC",
      key,
      fromBase64Url(signature) as BufferSource,
      enc.encode(payload)
    );
  } catch {
    return false;
  }
}

export async function createSessionToken(role: SessionRole): Promise<string> {
  const payload = JSON.stringify({
    role,
    exp: Date.now() + MAX_AGE * 1000,
  });
  const sig = await sign(payload);
  const token = `${toBase64Url(new TextEncoder().encode(payload))}.${sig}`;
  return token;
}

export async function verifySessionToken(
  token: string
): Promise<SessionRole | null> {
  try {
    const dot = token.indexOf(".");
    if (dot === -1) return null;
    const payloadB64 = token.slice(0, dot);
    const sig = token.slice(dot + 1);
    const payload = new TextDecoder().decode(fromBase64Url(payloadB64));
    const valid = await verify(payload, sig);
    if (!valid) return null;
    const data = JSON.parse(payload) as { role: SessionRole; exp: number };
    if (data.exp < Date.now()) return null;
    return data.role;
  } catch {
    return null;
  }
}

export function checkPassword(password: string): SessionRole | null {
  const client = process.env.ENCC_CLIENT_PASSWORD || "encc-review-2026";
  const admin = process.env.ENCC_ADMIN_PASSWORD || "yaqeen-admin-2026";
  if (password === admin) return "admin";
  if (password === client) return "client";
  return null;
}
