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

interface NotificationItem {
  id: string;
  title: string;
  description?: string;
}

const notifications: NotificationItem[] = [
  {
    id: "NTF-001",
    title: "2 approvals pending",
    description: "SOP-212, WI-104",
  },
  {
    id: "NTF-002",
    title: "1 document expiring soon",
    description: "TRN-OPS-01",
  },
];

export default function NotificationsPage() {
  return (
    <AppShell>
      <div className="space-y-6">
        <header className="space-y-2">
          {/* <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
            QMS • Notifications
          </h1>
          <p className="max-w-prose text-muted-foreground">
            Approvals, CAPA due, document expiry, upcoming audits.
          </p> */}
        </header>
        {/* 
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Recent Notifications</CardTitle>
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
                  {notifications.map((item) => (
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
        </Card> */}
      </div>
    </AppShell>
  );
}
