"use client";

import React, { useState } from "react";
import { Navbar } from "./Navbar";
import { Sidebar } from "./Sidebar";

interface AppShellProps {
  children: React.ReactNode;
}

export const AppShell: React.FC<AppShellProps> = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleMenuClick = () => {
    setSidebarOpen(true);
  };

  const handleSidebarClose = () => {
    setSidebarOpen(false);
  };

  return (
    <div className="min-h-screen bg-background flex flex-row">
      <Sidebar isOpen={sidebarOpen} onClose={handleSidebarClose} />

      <div className="w-full">
        <Navbar onMenuClick={handleMenuClick} />

        <main className="flex-1">
          <div className="container  p-4 lg:p-6">{children}</div>
        </main>
      </div>
    </div>
  );
};
