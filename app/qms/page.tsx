"use client";

import React from "react";
import { AppShell } from "@/components/layout/AppShell";

export default function Page() {
  return (
    <AppShell>
      <div className="space-y-3">
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
          Quality Management System (ISO 9001)
        </h1>
        <p className="max-w-prose text-muted-foreground">
          This service is not yet available. We are working to bring the ISO
          9001 QMS experience to the platform.
        </p>
      </div>
    </AppShell>
  );
}
