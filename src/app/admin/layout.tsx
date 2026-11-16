import Link from "next/link";
import { ExternalLink, LogOut } from "lucide-react";
import { getSession } from "@/lib/auth";
import { logout } from "./actions";
import AdminNav from "./AdminNav";
export const metadata = { robots: { index: false, follow: false, googleBot: { index: false, follow: false, noimageindex: true, nosnippet: true } } };
export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const s = await getSession();
  if (!s) return <div className="admin-login-layout">{children}</div>;

  return (
    <div className="admin-shell">
      <AdminNav />
      <div className="admin-workspace">
        <header className="admin-topbar">
          <div>
            <p className="admin-topbar-kicker">Esstofa Stove Works</p>
            <p className="admin-topbar-title">Admin workspace</p>
          </div>
          <div className="admin-topbar-actions">
            <Link href="/" className="admin-topbar-link"><ExternalLink aria-hidden="true" size={16} /><span>View site</span></Link>
            <form action={logout}>
              <button className="admin-logout"><LogOut aria-hidden="true" size={16} /><span>Sign out</span></button>
            </form>
          </div>
        </header>
        <main className="admin-page">
          <div className="admin-page-inner">{children}</div>
        </main>
      </div>
    </div>
  );
}
