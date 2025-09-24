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

interface SupplierItem {
  id: string;
  title: string;
  description?: string;
  status?: "approved";
  owner?: string;
}

const suppliers: SupplierItem[] = [
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

export default function SuppliersPage() {
  return (
    <AppShell>
      <div className="space-y-6">
        <header className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
            QMS • Suppliers
          </h1>
          <p className="max-w-prose text-muted-foreground">
            Approved supplier list with ratings and certifications.
          </p>
        </header>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Suppliers</CardTitle>
            <CardDescription>Static preview</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[120px]">Ref</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead className="hidden sm:table-cell">
                      Owner
                    </TableHead>
                    <TableHead className="w-[120px]">Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {suppliers.map((item) => (
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
                        <span className="inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium bg-emerald-100 text-emerald-700">
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
