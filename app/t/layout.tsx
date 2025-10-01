import React from "react";

export default function PublicTransferLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="border-b">
        <div className="mx-auto flex max-w-4xl items-center justify-between px-4 py-4">
          <div className="flex items-center space-x-2">
            <div className="h-8 w-8 rounded bg-primary flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-sm">
                U
              </span>
            </div>
            <span className="font-semibold">UIP Africa</span>
          </div>
        </div>
      </header>
      <main className="mx-auto max-w-4xl px-4 py-8">{children}</main>
      <footer className="border-t">
        <div className="mx-auto max-w-4xl px-4 py-6 text-xs text-muted-foreground">
          Powered by UIP Africa
        </div>
      </footer>
    </div>
  );
}
