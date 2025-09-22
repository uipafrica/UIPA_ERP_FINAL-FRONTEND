"use client";

import React from "react";
import { AppShell } from "@/components/layout/AppShell";

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
      </div>
    </AppShell>
  );
}
