"use client";

import React from "react";
import { AppShell } from "@/components/layout/AppShell";
import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function QmsIndexPage() {
  return (
    <AppShell>
      <div className="space-y-6">
        <header className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Quality Management System
          </h1>
          <p className="max-w-prose text-muted-foreground">
            Choose a module from the sidebar to begin.
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

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {[
            { title: "Document Control", href: "/qms/documents" },
            { title: "Records", href: "/qms/records" },
            { title: "Internal Audits", href: "/qms/audits" },
            { title: "Risks & Opportunities", href: "/qms/risks" },
            { title: "KPIs & Performance", href: "/qms/kpis" },
            { title: "CAPA", href: "/qms/capa" },
            { title: "Training & Competence", href: "/qms/training" },
            { title: "Suppliers", href: "/qms/suppliers" },
            { title: "Audit Trail", href: "/qms/audit-trail" },
            { title: "Notifications", href: "/qms/notifications" },
            { title: "ISO Clause Mapping", href: "/qms/iso-mapping" },
          ].map((m) => (
            <Card key={m.href} className="hover:bg-accent">
              <CardHeader>
                <CardTitle className="text-base">
                  <Link href={m.href} className="hover:underline">
                    {m.title}
                  </Link>
                </CardTitle>
                <CardDescription>Static preview</CardDescription>
              </CardHeader>
              <CardContent></CardContent>
            </Card>
          ))}
        </div>
      </div>
    </AppShell>
  );
}
