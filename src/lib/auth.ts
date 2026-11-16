import { SignJWT } from "jose";
import { cookies } from "next/headers";
import { notFound, redirect } from "next/navigation";
import { ADMIN_SESSION_COOKIE, ADMIN_SESSION_SECONDS, getAuthKey, isAdminRole, verifyAdminToken } from "./auth-config";
export const COOKIE = ADMIN_SESSION_COOKIE;
export async function createSession(id: string, role: string) {
  if (!id || !isAdminRole(role)) throw new Error("Cannot create an admin session for an invalid user.");
  const t = await new SignJWT({ id, role })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(`${ADMIN_SESSION_SECONDS}s`)
    .sign(getAuthKey());
  (await cookies()).set(COOKIE, t, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: ADMIN_SESSION_SECONDS,
  });
}
export async function getSession() {
  return verifyAdminToken((await cookies()).get(COOKIE)?.value);
}
export async function requireAdmin() { const s = await getSession(); if (!s) redirect("/admin/login"); return s; }
export async function requireAdminRole() {
  const session = await requireAdmin();
  if (session.role !== "ADMIN") notFound();
  return session;
}
