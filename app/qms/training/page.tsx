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

interface TrainingItem {
  id: string;
  title: string;
  description?: string;
  status?: "open" | "closed";
  owner?: string;
}

const training: TrainingItem[] = [
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

function getStatusBadgeClasses(status?: TrainingItem["status"]): string {
  if (!status) return "bg-gray-100 text-gray-700";
  if (status === "closed") return "bg-emerald-100 text-emerald-700";
  if (status === "open") return "bg-blue-100 text-blue-700";
  return "bg-gray-100 text-gray-700";
}

export default function TrainingPage() {
  return (
    <AppShell>
      <div className="space-y-6">
        <header className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
            QMS • Training & Competence
          </h1>
          <p className="max-w-prose text-muted-foreground">
            Employee training records and skill matrix overview.
          </p>
        </header>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Training Records</CardTitle>
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
                  {training.map((item) => (
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
