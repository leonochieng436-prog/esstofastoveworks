import { jwtVerify } from "jose";

export const ADMIN_SESSION_SECONDS = 12 * 60 * 60;
export const ADMIN_SESSION_COOKIE = "admin_session";

export function getAuthKey() {
  const secret = process.env.AUTH_SECRET;
  if (!secret || new TextEncoder().encode(secret).length < 32) {
    throw new Error("AUTH_SECRET must be configured with at least 32 random bytes.");
  }
  return new TextEncoder().encode(secret);
}

export function isAdminRole(role: unknown): role is "ADMIN" | "STAFF" {
  return role === "ADMIN" || role === "STAFF";
}

export async function verifyAdminToken(token: string | undefined) {
  if (!token) return null;
  const key = getAuthKey();
  try {
    const { payload } = await jwtVerify(token, key, { algorithms: ["HS256"] });
    if (typeof payload.id !== "string" || !payload.id || !isAdminRole(payload.role)) return null;
    return { id: payload.id, role: payload.role };
  } catch {
    return null;
  }
}