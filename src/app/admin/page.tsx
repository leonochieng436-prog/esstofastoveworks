import { db } from "@/lib/db";
export const dynamic = "force-dynamic";
export default async function Dash() {
  const [enq, nb, pb, cb, done, nq, prod, svc, proj] = await Promise.all([db.enquiry.count(), db.booking.count({ where: { createdAt: { gte: new Date(Date.now() - 7 * 864e5) } } }), db.booking.count({ where: { status: "PENDING" } }), db.booking.count({ where: { status: "CONFIRMED" } }), db.booking.count({ where: { status: "COMPLETED" } }), db.questionnaire.count({ where: { status: "NEW" } }), db.product.count(), db.service.count(), db.galleryProject.count()]);
  const cards = [["Website enquiries", enq], ["New bookings (7 days)", nb], ["Pending bookings", pb], ["Confirmed appointments", cb], ["Completed projects", done], ["New quote requests", nq], ["Products", prod], ["Services", svc], ["Gallery projects", proj]];
  return (
    <section className="admin-dashboard">
      <header className="admin-page-heading">
        <p className="admin-page-eyebrow">Your business at a glance</p>
        <h1>Overview</h1>
        <p>Keep track of enquiries, bookings and the content on your website.</p>
      </header>
      <div className="admin-dashboard-grid">
        {cards.map(([label, value]) => (
          <article key={label} className="admin-stat-card">
            <p>{label}</p>
            <strong className="admin-stat-value">{value}</strong>
          </article>
        ))}
      </div>
    </section>
  );
}
