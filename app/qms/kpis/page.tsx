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

interface KpiItem {
  name: string;
  value: string;
  trend: "up" | "down" | "flat";
  department: string;
}

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

function getTrendIcon(trend: KpiItem["trend"]): string {
  if (trend === "up") return "▲";
  if (trend === "down") return "▼";
  return "■";
}

export default function KpisPage() {
  return (
    <AppShell>
      <div className="space-y-6">
        <header className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
            QMS • KPIs & Performance
          </h1>
          <p className="max-w-prose text-muted-foreground">
            Track objectives and trends across departments.
          </p>
        </header>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {kpis.map((kpi) => (
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
      </div>
    </AppShell>
  );
}
