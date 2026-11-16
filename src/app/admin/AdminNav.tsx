"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  CalendarDays,
  FileText,
  Images,
  LayoutDashboard,
  Package,
  Settings2,
  Wrench,
  Flame,
} from "lucide-react";

const links = [
  { label: "Overview", href: "/admin", icon: LayoutDashboard },
  { label: "Bookings", href: "/admin/bookings", icon: CalendarDays },
  { label: "Quote requests", href: "/admin/quotes", icon: FileText },
  { label: "Products", href: "/admin/products", icon: Package },
  { label: "Services", href: "/admin/services", icon: Wrench },
  { label: "Gallery", href: "/admin/gallery", icon: Images },
  { label: "Settings", href: "/admin/settings", icon: Settings2 },
];

export default function AdminNav() {
  const pathname = usePathname();

  return (
    <aside className="admin-sidebar">
      <Link href="/admin" className="admin-brand">
        <span className="admin-brand-mark"><Flame aria-hidden="true" size={20} /></span>
        <span className="admin-brand-copy">
          <strong>ESSTOFA</strong>
          <small>CONTROL DESK</small>
        </span>
      </Link>
      <p className="admin-nav-label">Workspace</p>
      <nav className="admin-nav" aria-label="Admin navigation">
        {links.map(({ label, href, icon: Icon }) => {
          const active = href === "/admin"
            ? pathname === href
            : pathname === href || pathname.startsWith(`${href}/`);
          return (
            <Link
              key={href}
              href={href}
              className={`admin-nav-link${active ? " is-active" : ""}`}
              aria-current={active ? "page" : undefined}
            >
              <Icon aria-hidden="true" size={18} />
              <span>{label}</span>
            </Link>
          );
        })}
      </nav>
      <div className="admin-sidebar-footer">
        <span className="admin-sidebar-status" />
        <div><strong>Private workspace</strong><small>Admin access is active</small></div>
      </div>
    </aside>
  );
}