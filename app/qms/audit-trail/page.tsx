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

interface AuditEvent {
  id: string;
  title: string;
  description?: string;
}

const events: AuditEvent[] = [
  {
    id: "EVT-9012",
    title: "Document approved",
    description: "SOP-212 by QA Manager",
  },
  {
    id: "EVT-9013",
    title: "Record uploaded",
    description: "Calibration record CL-511",
  },
];

export default function AuditTrailPage() {
  return (
    <AppShell>
      <div className="space-y-6">
        <header className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
            QMS • Audit Trail
          </h1>
          <p className="max-w-prose text-muted-foreground">
            Every action is logged for ISO inspections.
          </p>
        </header>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Recent Events</CardTitle>
            <CardDescription>Static preview</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[120px]">Ref</TableHead>
                    <TableHead>Title</TableHead>
                    <TableHead className="hidden sm:table-cell">
                      Details
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {events.map((item) => (
                    <TableRow
                      key={item.id}
                      tabIndex={0}
                      aria-label={item.title}
                      className="focus:bg-muted/50"
                    >
                      <TableCell className="font-medium">{item.id}</TableCell>
                      <TableCell>{item.title}</TableCell>
                      <TableCell className="hidden sm:table-cell">
                        {item.description ?? "—"}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
    </AppShell>
  );
}
