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
  status?: "open" | "closed" | "in-progress";
  owner?: string;
}

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

function getStatusBadgeClasses(status?: ActionItem["status"]): string {
  if (!status) return "bg-gray-100 text-gray-700";
  if (status === "closed") return "bg-emerald-100 text-emerald-700";
  if (status === "in-progress") return "bg-amber-100 text-amber-700";
  if (status === "open") return "bg-blue-100 text-blue-700";
  return "bg-gray-100 text-gray-700";
}

export default function RecordsPage() {
  return (
    <AppShell>
      <div className="space-y-6">
        <header className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
            QMS • Records Management
          </h1>
          <p className="max-w-prose text-muted-foreground">
            Static preview for records: minutes, training, maintenance,
            calibration, assets.
          </p>
        </header>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Recent Records</CardTitle>
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
                      Owner
                    </TableHead>
                    <TableHead className="w-[120px]">Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {recordSamples.map((item) => (
                    <TableRow
                      key={item.id}
                      className="focus:bg-muted/50"
                      tabIndex={0}
                      aria-label={item.title}
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
    </AppShell>
  );
}
