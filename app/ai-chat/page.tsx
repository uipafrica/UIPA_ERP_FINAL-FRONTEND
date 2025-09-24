"use client";

import React from "react";
import { AppShell } from "@/components/layout/AppShell";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function Page() {
  return (
    <AppShell>
      <div className="space-y-3">
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
          AI Chat
        </h1>
        <p className="max-w-prose text-muted-foreground">
          This service is not yet available. Chat with AI is coming soon.
        </p>
        <Card className="border-amber-300 bg-amber-50 dark:border-amber-900 dark:bg-amber-950/30">
          <CardHeader>
            <CardTitle className="text-base">
              Service Not Yet Available
            </CardTitle>
            <CardDescription>
              This module is a static preview. Core AI Chat services are under
              development and will be enabled soon.
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    </AppShell>
  );
}
