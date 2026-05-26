import Link from "next/link";
import Image from "next/image";
import { redirect } from "next/navigation";
import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth-helpers";
import { formatDate } from "@/lib/format";
import SignOutButton from "@/app/components/portal/SignOutButton";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Staff intranet" };

// Internal announcements — static scenario content for the exercise.
const NOTICES = [
  {
    tag: "IT Security",
    urgent: true,
    title: "Mandatory credential review — action required",
    date: "26 May 2026",
    body: "Following heightened information-security activity in the region, all staff must review their account and set a strong, unique password. Default and onboarding passwords are being phased out. Contact the IT Helpdesk if you need assistance.",
  },
  {
    tag: "IT Security",
    urgent: false,
    title: "Phishing campaign targeting municipal addresses",
    date: "26 May 2026",
    body: "CERT-EE reports a wave of 'urgent invoice' emails. Do not open unexpected attachments. Enable multi-factor authentication where available and report suspicious mail to the Helpdesk.",
  },
  {
    tag: "Facilities",
    urgent: false,
    title: "Access changes at Stenbock House during Spring Storm",
    date: "25 May 2026",
    body: "Increased security checks are in place at the Toompea entrance this week. Please carry your staff pass at all times and allow extra time on arrival.",
  },
  {
    tag: "HR",
    urgent: false,
    title: "Summer leave requests now open",
    date: "22 May 2026",
    body: "Submit summer leave requests through the absences system by 13 June. Cover arrangements must be agreed with your line manager.",
  },
];

const QUICK_LINKS = [
  "Webmail",
  "VPN access",
  "Leave & absences",
  "IT Helpdesk",
  "Document library",
  "Payroll & HR",
];

export default async function PortalPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/sign-in?callbackUrl=/portal");

  const staff = await prisma.user.findMany({
    orderBy: [{ role: "asc" }, { displayName: "asc" }],
    select: {
      id: true,
      displayName: true,
      email: true,
      jobTitle: true,
      department: true,
      phone: true,
      role: true,
    },
  });

  return (
    <div className="bg-soft min-h-[70vh]">
      {/* Internal top bar */}
      <div className="bg-govblue-dark text-white">
        <div className="container py-3 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Image src="/img/coat-of-arms.png" alt="" width={34} height={34} />
            <div className="leading-tight">
              <div className="font-semibold">Staff intranet · Siseveeb</div>
              <div className="text-xs text-white/70">Government Office</div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/" className="text-sm text-white/80 hover:text-white hidden sm:inline">
              Public site
            </Link>
            {user.role === "admin" && (
              <Link
                href="/admin"
                className="text-sm bg-white/15 rounded-md px-3 py-1.5 hover:bg-white/25"
              >
                Newsroom
              </Link>
            )}
            <SignOutButton />
          </div>
        </div>
      </div>

      <div className="container py-8">
        <h1 className="text-2xl font-semibold mb-1">Welcome, {user.displayName}</h1>
        <p className="text-muted mb-6 text-sm">
          {user.jobTitle ? `${user.jobTitle} · ` : ""}
          {user.department ?? "Government Office"}
        </p>

        <div className="grid gap-8 lg:grid-cols-3">
          {/* Announcements + quick links */}
          <div className="lg:col-span-2 space-y-8">
            <section>
              <h2 className="text-lg font-semibold border-b-2 border-govblue pb-2 mb-4">
                Internal announcements
              </h2>
              <div className="space-y-3">
                {NOTICES.map((n, i) => (
                  <article
                    key={i}
                    className="bg-white border border-line rounded-lg p-4 gov-card"
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <span
                        className={`text-[0.7rem] font-semibold uppercase tracking-wide px-2 py-0.5 rounded-sm text-white ${
                          n.urgent ? "bg-red-600" : "bg-govblue"
                        }`}
                      >
                        {n.tag}
                      </span>
                      <span className="text-xs text-muted">{n.date}</span>
                    </div>
                    <h3 className="font-semibold">{n.title}</h3>
                    <p className="text-sm text-muted mt-1">{n.body}</p>
                  </article>
                ))}
              </div>
            </section>

            <section>
              <h2 className="text-lg font-semibold border-b-2 border-govblue pb-2 mb-4">
                Internal tools
              </h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {QUICK_LINKS.map((l) => (
                  <span
                    key={l}
                    className="bg-white border border-line rounded-md p-3 text-sm font-medium text-center cursor-default gov-card"
                  >
                    {l}
                  </span>
                ))}
              </div>
            </section>
          </div>

          {/* My account + directory */}
          <aside className="space-y-8">
            <section className="bg-white border border-line rounded-lg p-5 gov-card">
              <h2 className="font-semibold mb-3">My account</h2>
              <dl className="text-sm space-y-1.5">
                <div className="flex justify-between gap-3">
                  <dt className="text-muted">Name</dt>
                  <dd className="text-right">{user.displayName}</dd>
                </div>
                <div className="flex justify-between gap-3">
                  <dt className="text-muted">Email</dt>
                  <dd className="text-right break-all">{user.email}</dd>
                </div>
                <div className="flex justify-between gap-3">
                  <dt className="text-muted">Role</dt>
                  <dd className="text-right capitalize">{user.role}</dd>
                </div>
                {user.department && (
                  <div className="flex justify-between gap-3">
                    <dt className="text-muted">Department</dt>
                    <dd className="text-right">{user.department}</dd>
                  </div>
                )}
                <div className="flex justify-between gap-3">
                  <dt className="text-muted">Member since</dt>
                  <dd className="text-right">{formatDate(user.createdAt)}</dd>
                </div>
              </dl>
            </section>

            <section>
              <h2 className="text-lg font-semibold border-b-2 border-govblue pb-2 mb-4">
                Staff directory
              </h2>
              <ul className="space-y-2">
                {staff.map((s) => (
                  <li key={s.id} className="bg-white border border-line rounded-md p-3 gov-card">
                    <div className="font-medium text-sm">
                      {s.displayName}
                      {s.role === "admin" && (
                        <span className="ml-2 text-[0.65rem] uppercase tracking-wide text-govblue">
                          admin
                        </span>
                      )}
                    </div>
                    {s.jobTitle && <div className="text-xs text-muted">{s.jobTitle}</div>}
                    <div className="text-xs text-muted">{s.department}</div>
                    <div className="text-xs text-govblue mt-1 break-all">{s.email}</div>
                    {s.phone && <div className="text-xs text-muted">{s.phone}</div>}
                  </li>
                ))}
              </ul>
            </section>
          </aside>
        </div>
      </div>
    </div>
  );
}
