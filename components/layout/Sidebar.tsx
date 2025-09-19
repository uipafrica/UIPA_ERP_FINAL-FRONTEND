"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  Phone,
  Car,
  Calendar,
  FileText,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import { UserRole } from "@/types";

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

interface NavItem {
  title: string;
  href: string;
  icon: React.ElementType;
  roles: UserRole[];
}

const navItems: NavItem[] = [
  {
    title: "Dashboard",
    href: "/",
    icon: LayoutDashboard,
    roles: ["employee", "approver", "admin"],
  },
  {
    title: "Employees",
    href: "/employees",
    icon: Users,
    roles: ["approver", "admin"],
  },
  {
    title: "Contacts",
    href: "/contacts",
    icon: Phone,
    roles: ["employee", "approver", "admin"],
  },
  // {
  //   title: "Fleet",
  //   href: "/fleet",
  //   icon: Car,
  //   roles: ["approver", "admin"],
  // },
  {
    title: "Time Off",
    href: "/time-off",
    icon: Calendar,
    roles: ["employee", "approver", "admin"],
  },
  {
    title: "Documents",
    href: "/documents",
    icon: FileText,
    roles: ["employee", "approver", "admin"],
  },
];

export const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const pathname = usePathname();
  const { user } = useAuth();

  const filteredNavItems = navItems.filter((item) =>
    user?.role ? item.roles.includes(user.role) : false
  );

  return (
    <>
      {/* Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-background/80 backdrop-blur-sm lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed left-0 top-0 z-50 h-full w-64 transform border-r bg-card transition-transform duration-200 ease-in-out lg:translate-x-0 lg:static lg:z-0",
          isOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        {/* Header */}
        <div className="flex h-16 items-center justify-between border-b px-4">
          <div className="flex items-center space-x-2">
            <div className="h-8 w-8 rounded bg-primary flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-sm">
                U
              </span>
            </div>
            <span className="font-bold text-lg">UIP Africa</span>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="lg:hidden"
          >
            <X className="h-5 w-5" />
          </Button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 space-y-1 p-4">
          {filteredNavItems.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onClose}
                className={cn(
                  "flex items-center space-x-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground",
                  isActive
                    ? "bg-primary text-primary-foreground hover:bg-primary/90"
                    : "text-muted-foreground"
                )}
              >
                <Icon className="h-5 w-5" />
                <span>{item.title}</span>
              </Link>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="border-t p-4">
          <div className="flex items-center space-x-3 text-sm text-muted-foreground">
            <div className="flex items-center space-x-2">
              <div className="h-2 w-2 rounded-full bg-green-500" />
              <span>System Online</span>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};
