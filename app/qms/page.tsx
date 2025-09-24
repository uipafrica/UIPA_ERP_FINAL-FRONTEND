"use client";

import React from "react";
import { AppShell } from "@/components/layout/AppShell";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

// -----------------------
// types
// -----------------------
interface QuickStat {
  label: string;
  value: string;
  hint?: string;
}

interface ActionItem {
  id: string;
  title: string;
  description?: string;
  status?:
    | "draft"
    | "review"
    | "approved"
    | "overdue"
    | "open"
    | "closed"
    | "in-progress";
  dueDate?: string;
  owner?: string;
}

interface KpiItem {
  name: string;
  value: string;
  trend: "up" | "down" | "flat";
  department: string;
}

// -----------------------
// static content
// -----------------------
const documentStats: QuickStat[] = [
  { label: "Published Docs", value: "128" },
  { label: "Pending Approval", value: "6" },
  { label: "Drafts", value: "14" },
];

const sampleDocuments: ActionItem[] = [
  {
    id: "DOC-001",
    title: "Quality Manual",
    description: "QM-01 v4",
    status: "approved",
    owner: "QA",
    dueDate: "—",
  },
  {
    id: "WI-104",
    title: "Work Instruction: Incoming Inspection",
    description: "WI-104 v2",
    status: "review",
    owner: "Ops",
    dueDate: "Sep 28",
  },
  {
    id: "SOP-212",
    title: "SOP: CAPA Handling",
    description: "SOP-212 v1",
    status: "draft",
    owner: "QA",
    dueDate: "Oct 03",
  },
];

const recordSamples: ActionItem[] = [
  {
    id: "TR-087",
    title: "Forklift Training - J. Moyo",
    description: "Completed: Aug 10",
    status: "closed",
    owner: "HR",
  },
  {
    id: "MT-233",
    title: "Compressor Preventive Maintenance",
    description: "Scheduled: Sep 30",
    status: "in-progress",
    owner: "Maintenance",
  },
  {
    id: "CL-511",
    title: "Calipers Calibration",
    description: "Due: Oct 15",
    status: "open",
    owner: "Metrology",
  },
];

const auditPlan: ActionItem[] = [
  {
    id: "AUD-24-09",
    title: "Internal Audit - Procurement",
    description: "Checklist: PRC-CHK-02",
    status: "in-progress",
    owner: "Lead Auditor",
    dueDate: "Sep 27",
  },
  {
    id: "AUD-24-10",
    title: "Internal Audit - IT Service",
    description: "Checklist: IT-CHK-05",
    status: "open",
    owner: "QA",
    dueDate: "Oct 12",
  },
];

const auditFindings: ActionItem[] = [
  {
    id: "NC-1023",
    title: "PO approval missing evidence",
    description: "Major NC",
    status: "open",
    owner: "Procurement",
    dueDate: "Oct 05",
  },
  {
    id: "OFI-334",
    title: "Improve onboarding checklist clarity",
    description: "OFI",
    status: "open",
    owner: "HR",
    dueDate: "—",
  },
];

const riskRegister: ActionItem[] = [
  {
    id: "RSK-044",
    title: "Supplier single-sourcing risk",
    description: "Impact: High • Likelihood: Medium",
    status: "in-progress",
    owner: "Procurement",
  },
  {
    id: "RSK-059",
    title: "Server downtime",
    description: "Impact: Medium • Likelihood: Medium",
    status: "open",
    owner: "IT",
  },
];

const kpis: KpiItem[] = [
  {
    name: "On-time Delivery",
    value: "96.4%",
    trend: "up",
    department: "Operations",
  },
  {
    name: "Supplier PPM",
    value: "1,250",
    trend: "down",
    department: "Procurement",
  },
  {
    name: "Audit Closure (30d)",
    value: "82%",
    trend: "flat",
    department: "QA",
  },
];

const capaItems: ActionItem[] = [
  {
    id: "CAPA-210",
    title: "Customer complaint #5521",
    description: "Root cause: Pending 5 Whys",
    status: "overdue",
    owner: "QA",
    dueDate: "Sep 18",
  },
  {
    id: "CAPA-214",
    title: "Line scrap spike - Week 37",
    description: "Fishbone in progress",
    status: "in-progress",
    owner: "Production",
    dueDate: "Oct 02",
  },
];

const trainingMatrix: ActionItem[] = [
  {
    id: "TRN-OPS-01",
    title: "Welding Certification - A. Ndlovu",
    description: "Expires: Nov 30",
    status: "open",
    owner: "Ops",
  },
  {
    id: "TRN-QA-04",
    title: "ISO 9001 Awareness - Team QA",
    description: "Completed: Sep 12",
    status: "closed",
    owner: "QA",
  },
];

const suppliers: ActionItem[] = [
  {
    id: "SUP-033",
    title: "ABC Metals",
    description: "Rating: 4.3 ⭐ • ISO 9001 Cert: Valid",
    status: "approved",
    owner: "Procurement",
  },
  {
    id: "SUP-067",
    title: "Delta Logistics",
    description: "Rating: 3.8 ⭐ • On-time: 92%",
    status: "approved",
    owner: "Procurement",
  },
];

const auditTrail: ActionItem[] = [
  {
    id: "EVT-9012",
    title: "Document approved",
    description: "SOP-212 by QA Manager",
    status: "closed",
  },
  {
    id: "EVT-9013",
    title: "Record uploaded",
    description: "Calibration record CL-511",
    status: "closed",
  },
];

const notifications: ActionItem[] = [
  {
    id: "NTF-001",
    title: "2 approvals pending",
    description: "SOP-212, WI-104",
    status: "open",
  },
  {
    id: "NTF-002",
    title: "1 document expiring soon",
    description: "TRN-OPS-01",
    status: "open",
  },
];

const isoClauses: ActionItem[] = [
  {
    id: "ISO-4.2",
    title: "Quality Manual",
    description: "Maps to 4.2.2, 7.5",
    status: "approved",
  },
  {
    id: "ISO-9.2",
    title: "Internal Audit Process",
    description: "Maps to 9.2",
    status: "approved",
  },
];

// -----------------------
// helpers
// -----------------------
function getStatusBadgeClasses(status?: ActionItem["status"]): string {
  if (!status) return "bg-gray-100 text-gray-700";
  if (status === "approved" || status === "closed")
    return "bg-emerald-100 text-emerald-700";
  if (status === "review" || status === "in-progress")
    return "bg-amber-100 text-amber-700";
  if (status === "draft" || status === "open")
    return "bg-blue-100 text-blue-700";
  if (status === "overdue") return "bg-red-100 text-red-700";
  return "bg-gray-100 text-gray-700";
}

function getTrendIcon(trend: KpiItem["trend"]): string {
  if (trend === "up") return "▲";
  if (trend === "down") return "▼";
  return "■";
}

// -----------------------
// subcomponents
// -----------------------
function SectionHeader({
  title,
  description,
}: {
  title: string;
  description?: string;
}) {
  return (
    <div className="flex items-start justify-between gap-4">
      <div>
        <h2 className="text-xl font-semibold tracking-tight">{title}</h2>
        {description ? (
          <p className="text-sm text-muted-foreground">{description}</p>
        ) : null}
      </div>
      <div className="flex flex-wrap gap-2">
        <Button
          aria-label="Add new"
          variant="secondary"
          disabled
          title="Static demo"
        >
          Add New
        </Button>
        <Button
          aria-label="View all"
          variant="outline"
          disabled
          title="Static demo"
        >
          View All
        </Button>
      </div>
    </div>
  );
}

function StatCard({ label, value, hint }: QuickStat) {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardDescription className="text-xs uppercase tracking-wider text-muted-foreground">
          {label}
        </CardDescription>
        <CardTitle className="text-2xl">{value}</CardTitle>
      </CardHeader>
      {hint ? (
        <CardContent className="pt-0 text-sm text-muted-foreground">
          {hint}
        </CardContent>
      ) : null}
    </Card>
  );
}

function ItemsTable({
  items,
  emptyLabel,
}: {
  items: ActionItem[];
  emptyLabel: string;
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Recent</CardTitle>
        <CardDescription>Static preview for layout and IA</CardDescription>
      </CardHeader>
      <CardContent>
        {items.length === 0 ? (
          <p className="text-sm text-muted-foreground">{emptyLabel}</p>
        ) : (
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[120px]">Ref</TableHead>
                  <TableHead>Title</TableHead>
                  <TableHead className="hidden sm:table-cell">Owner</TableHead>
                  <TableHead className="hidden md:table-cell">Due</TableHead>
                  <TableHead className="w-[120px]">Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {items.map((item) => (
                  <TableRow
                    key={item.id}
                    tabIndex={0}
                    aria-label={`${item.title}`}
                    className="focus:bg-muted/50"
                  >
                    <TableCell className="font-medium">{item.id}</TableCell>
                    <TableCell>
                      <div className="flex flex-col">
                        <span className="font-medium">{item.title}</span>
                        {item.description ? (
                          <span className="text-xs text-muted-foreground">
                            {item.description}
                          </span>
                        ) : null}
                      </div>
                    </TableCell>
                    <TableCell className="hidden sm:table-cell">
                      {item.owner ?? "—"}
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                      {item.dueDate ?? "—"}
                    </TableCell>
                    <TableCell>
                      <span
                        className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${getStatusBadgeClasses(
                          item.status
                        )}`}
                        aria-label={`status ${item.status ?? "unknown"}`}
                      >
                        {item.status ?? "—"}
                      </span>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function KpiGrid({ items }: { items: KpiItem[] }) {
  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
      {items.map((kpi) => (
        <Card key={kpi.name}>
          <CardHeader className="pb-2">
            <CardDescription className="text-xs uppercase tracking-wider text-muted-foreground">
              {kpi.department}
            </CardDescription>
            <div className="flex items-baseline justify-between">
              <CardTitle className="text-base">{kpi.name}</CardTitle>
              <span className="text-sm text-muted-foreground" aria-hidden>
                {getTrendIcon(kpi.trend)}
              </span>
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            <p className="text-2xl font-semibold">{kpi.value}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

// -----------------------
// page
// -----------------------
export default function Page() {
  return (
    <AppShell>
      <div className="space-y-6">
        <header className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Quality Management System (ISO 9001)
          </h1>
          <p className="max-w-prose text-muted-foreground">
            Explore a static preview of the QMS modules. Actions are disabled in
            this demo.
          </p>
        </header>

        <Card className="border-amber-300 bg-amber-50 dark:border-amber-900 dark:bg-amber-950/30">
          <CardHeader>
            <CardTitle className="text-base">
              Service Not Yet Available
            </CardTitle>
            <CardDescription>
              This module is a static preview. Core QMS services are under
              development and will be enabled soon.
            </CardDescription>
          </CardHeader>
        </Card>

        {/* Document Control */}
        {/* <section id="documents" className="space-y-3 scroll-mt-24">
          <SectionHeader
            title="Document Control"
            description="Upload, version, and approve documents"
          />
          <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
            {documentStats.map((s) => (
              <StatCard key={s.label} {...s} />
            ))}
          </div>
          <ItemsTable items={sampleDocuments} emptyLabel="No documents yet" />
        </section>

        {/* Records Management */}
        {/* <section id="records" className="space-y-3 scroll-mt-24">
          <SectionHeader
            title="Records Management"
            description="Secure storage with metadata"
          />
          <ItemsTable items={recordSamples} emptyLabel="No records yet" />
        </section>

        {/* Internal Audit Management */}
        {/* <section id="audits" className="space-y-3 scroll-mt-24">
          <SectionHeader
            title="Internal Audits"
            description="Plan audits, record findings, track closures"
          />
          <div className="grid grid-cols-1 gap-3 lg:grid-cols-2">
            <ItemsTable items={auditPlan} emptyLabel="No audits planned" />
            <ItemsTable items={auditFindings} emptyLabel="No findings" />
          </div>
        </section> */}

        {/* Risk & Opportunity Management */}
        {/* <section id="risks" className="space-y-3 scroll-mt-24">
          <SectionHeader
            title="Risks & Opportunities"
            description="Register, assess, and mitigate"
          />
          <ItemsTable items={riskRegister} emptyLabel="No risks logged" />
        </section> */}

        {/* KPI & Performance */}
        {/* <section id="kpis" className="space-y-3 scroll-mt-24">
          <SectionHeader
            title="KPIs & Performance"
            description="Track objectives and trends"
          />
          <KpiGrid items={kpis} />
        </section> */}

        {/* CAPA */}
        {/* <section id="capa" className="space-y-3 scroll-mt-24">
          <SectionHeader
            title="Corrective & Preventive Actions (CAPA)"
            description="Log NCRs, analyze root cause, assign actions"
          />
          <ItemsTable items={capaItems} emptyLabel="No CAPAs logged" />
        </section> */}

        {/* Training & Competence */}
        {/* <section id="training" className="space-y-3 scroll-mt-24">
          <SectionHeader
            title="Training & Competence"
            description="Records, skill matrix, refresher schedules"
          />
          <ItemsTable items={trainingMatrix} emptyLabel="No training records" />
        </section> */}

        {/* Procurement & Supplier Evaluation */}
        {/* <section id="suppliers" className="space-y-3 scroll-mt-24">
          <SectionHeader
            title="Procurement & Supplier Evaluation"
            description="Approved list, ratings, certifications"
          />
          <ItemsTable items={suppliers} emptyLabel="No suppliers added" />
        </section>

        {/* Audit Trail */}
        {/* <section id="audit-trail" className="space-y-3 scroll-mt-24">
          <SectionHeader
            title="Audit Trail & Traceability"
            description="Every action logged for inspections"
          />
          <ItemsTable items={auditTrail} emptyLabel="No events yet" />
        </section>

        {/* Notifications */}
        {/* <section id="notifications" className="space-y-3 scroll-mt-24"> */}
        {/* <SectionHeader
          title="Notifications & Reminders"
          description="Approvals, CAPA due, expiries, upcoming audits"
        />
        <ItemsTable items={notifications} emptyLabel="No notifications" /> */}
        {/* </section> */}
        {/* ISO Clause Mapping (Nice to have) */}
        {/* <section id="iso-mapping" className="space-y-3 scroll-mt-24">
          <SectionHeader
            title="ISO Clause Mapping"
            description="Link processes and documents to ISO 9001:2015"
          />
          <ItemsTable items={isoClauses} emptyLabel="No mappings yet" />
          </section> */}
      </div>
    </AppShell>
  );
}
