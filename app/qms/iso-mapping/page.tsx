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

interface MappingItem {
  id: string;
  title: string;
  description?: string;
}

const mappings: MappingItem[] = [
  { id: "ISO-4.2", title: "Quality Manual", description: "Maps to 4.2.2, 7.5" },
  {
    id: "ISO-9.2",
    title: "Internal Audit Process",
    description: "Maps to 9.2",
  },
];

export default function IsoMappingPage() {
  return (
    <AppShell>
      <div className="space-y-6">
        <header className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
            QMS • ISO Clause Mapping
          </h1>
          <p className="max-w-prose text-muted-foreground">
            Link internal processes and documents to ISO 9001:2015 clauses.
          </p>
        </header>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Mappings</CardTitle>
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
                  {mappings.map((item) => (
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
