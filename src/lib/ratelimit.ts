import { headers } from "next/headers";
import { db } from "./db";
// Postgres-backed limiter: shared across all server instances.
export async function allow(name: string, max: number, windowSec: number) {
  const ip = (await headers()).get("x-forwarded-for")?.split(",")[0].trim() ?? "local"; const key = `${name}:${ip}`; const now = new Date();
  return db.$transaction(async (tx) => {
    const r = await tx.rateLimit.findUnique({ where: { key } });
    if (!r || r.resetAt < now) { const resetAt = new Date(now.getTime() + windowSec * 1000); await tx.rateLimit.upsert({ where: { key }, update: { count: 1, resetAt }, create: { key, count: 1, resetAt } }); return true; }
    if (r.count >= max) return false;
    await tx.rateLimit.update({ where: { key }, data: { count: { increment: 1 } } }); return true;
  });
}
