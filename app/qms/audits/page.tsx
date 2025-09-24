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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface ActionItem {
  id: string;
  title: string;
  description?: string;
  status?: "open" | "in-progress" | "closed";
  owner?: string;
  dueDate?: string;
}

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

function getStatusBadgeClasses(status?: ActionItem["status"]): string {
  if (!status) return "bg-gray-100 text-gray-700";
  if (status === "closed") return "bg-emerald-100 text-emerald-700";
  if (status === "in-progress") return "bg-amber-100 text-amber-700";
  if (status === "open") return "bg-blue-100 text-blue-700";
  return "bg-gray-100 text-gray-700";
}

export default function AuditsPage() {
  return (
    <AppShell>
      <div className="space-y-6">
        <header className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
            QMS • Internal Audits
          </h1>
          <p className="max-w-prose text-muted-foreground">
            Plan and schedule audits; record NCs, observations, and OFIs.
          </p>
        </header>

        <div className="grid grid-cols-1 gap-3 lg:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Audit Plan</CardTitle>
              <CardDescription>Upcoming & in-progress audits</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[120px]">Ref</TableHead>
                      <TableHead>Title</TableHead>
                      <TableHead className="hidden sm:table-cell">
                        Owner
                      </TableHead>
                      <TableHead className="hidden md:table-cell">
                        Due
                      </TableHead>
                      <TableHead className="w-[120px]">Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {auditPlan.map((item) => (
                      <TableRow
                        key={item.id}
                        tabIndex={0}
                        aria-label={item.title}
                        className="focus:bg-muted/50"
                      >
                        <TableCell className="font-medium">{item.id}</TableCell>
                        <TableCell>
                          <div className="flex flex-col">
                            <span className="font-medium">{item.title}</span>
                            <span className="text-xs text-muted-foreground">
                              {item.description}
                            </span>
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
                          >
                            {item.status ?? "—"}
                          </span>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Findings</CardTitle>
              <CardDescription>NCs, Observations, OFIs</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[120px]">Ref</TableHead>
                      <TableHead>Title</TableHead>
                      <TableHead className="hidden sm:table-cell">
                        Owner
                      </TableHead>
                      <TableHead className="hidden md:table-cell">
                        Due
                      </TableHead>
                      <TableHead className="w-[120px]">Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {auditFindings.map((item) => (
                      <TableRow
                        key={item.id}
                        tabIndex={0}
                        aria-label={item.title}
                        className="focus:bg-muted/50"
                      >
                        <TableCell className="font-medium">{item.id}</TableCell>
                        <TableCell>
                          <div className="flex flex-col">
                            <span className="font-medium">{item.title}</span>
                            <span className="text-xs text-muted-foreground">
                              {item.description}
                            </span>
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
                          >
                            {item.status ?? "—"}
                          </span>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </AppShell>
  );
}
