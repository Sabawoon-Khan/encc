import { NextResponse } from "next/server";
import { checkPassword, setSessionCookie } from "@/lib/auth";

export async function POST(request: Request) {
  try {
    const { password } = (await request.json()) as { password?: string };
    if (!password?.trim()) {
      return NextResponse.json({ error: "Password required" }, { status: 400 });
    }
    const role = checkPassword(password.trim());
    if (!role) {
      return NextResponse.json({ error: "Invalid password" }, { status: 401 });
    }
    await setSessionCookie(role);
    return NextResponse.json({ ok: true, role });
  } catch {
    return NextResponse.json({ error: "Login failed" }, { status: 500 });
  }
}
