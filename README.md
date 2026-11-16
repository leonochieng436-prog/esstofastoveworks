# Esstofa Stove Works (Next.js + Tailwind)
1. Run `npm install`.
2. Copy `.env.example` to `.env` and set `DATABASE_URL`.
3. Generate an `AUTH_SECRET` with `node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"` and set unique `ADMIN_EMAIL` and `ADMIN_PASSWORD` values. Use a password at least 12 characters long; do not commit `.env`.
4. Run `npx prisma migrate dev --name init`, then `npm run db:seed`.
5. Start with `npm run dev`.

The admin at `/admin` requires the seeded email and password. Successful sign-in creates a fixed 12-hour session; sign in again after it expires. Re-running the seed updates the account password to `ADMIN_PASSWORD`. Uploads need `CLOUDINARY_*`; email notices need `RESEND_API_KEY`.
Seeded products are labelled sample listings. Replace them with verified details. Add the workshop address, map URL and TikTok link in Admin > Settings.

Prisma CLI settings, including the seed command, are in `prisma.config.ts`. On Windows, stop the Next.js development server before running `npx prisma generate` or `npm run build`, then restart it; a running server can lock Prisma's query-engine DLL.
