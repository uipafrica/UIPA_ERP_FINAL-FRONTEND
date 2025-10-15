"use client";

import React, { useState } from "react";
import { AppShell } from "@/components/layout/AppShell";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  FileText,
  AlertTriangle,
  Shield,
  ClipboardCheck,
  Users,
  MessageSquare,
  TrendingUp,
  Plus,
  Search,
  Filter,
  LayoutDashboard,
  ChevronRight,
  Menu,
  X,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

type ViewMode =
  | "dashboard"
  | "documents"
  | "ncr"
  | "capa"
  | "audits"
  | "reviews"
  | "training"
  | "feedback";

export default function QMSPage() {
  const [viewMode, setViewMode] = useState<ViewMode>("dashboard");
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const qmsModules = [
    {
      id: "documents",
      title: "Document Control",
      description: "Manage policies, procedures, and work instructions",
      icon: FileText,
      color: "bg-blue-500",
      stats: { total: 24, pending: 3, overdue: 1 },
    },
    {
      id: "ncr",
      title: "Non-Conformance",
      description: "Track and manage non-conformities",
      icon: AlertTriangle,
      color: "bg-red-500",
      stats: { total: 12, open: 5, critical: 2 },
    },
    {
      id: "capa",
      title: "CAPA Management",
      description: "Corrective and preventive actions",
      icon: Shield,
      color: "bg-orange-500",
      stats: { total: 8, active: 4, overdue: 1 },
    },
    {
      id: "audits",
      title: "Internal Audits",
      description: "Schedule and manage audits",
      icon: ClipboardCheck,
      color: "bg-green-500",
      stats: { total: 6, planned: 2, completed: 4 },
    },
    {
      id: "reviews",
      title: "Management Review",
      description: "Meeting records and decisions",
      icon: Users,
      color: "bg-purple-500",
      stats: { total: 4, scheduled: 1, completed: 3 },
    },
    {
      id: "training",
      title: "Training & Competence",
      description: "Employee training and certifications",
      icon: TrendingUp,
      color: "bg-indigo-500",
      stats: { total: 15, scheduled: 3, completed: 12 },
    },
    {
      id: "feedback",
      title: "Customer Feedback",
      description: "Complaints and feedback management",
      icon: MessageSquare,
      color: "bg-pink-500",
      stats: { total: 9, open: 2, resolved: 7 },
    },
  ];

  const dashboardStats = {
    totalDocuments: 24,
    pendingReviews: 3,
    openNCRs: 5,
    activeCAPAs: 4,
    upcomingAudits: 2,
    pendingTraining: 3,
    openComplaints: 2,
  };

  const recentActivities = [
    {
      type: "document",
      title: "Safety Policy v2.1",
      status: "approved",
      time: "2 hours ago",
    },
    {
      type: "ncr",
      title: "NCR-2024-0012",
      status: "investigation",
      time: "4 hours ago",
    },
    {
      type: "capa",
      title: "CAPA-2024-0008",
      status: "implementation",
      time: "1 day ago",
    },
    {
      type: "audit",
      title: "Quality Audit Q1-2024",
      status: "completed",
      time: "2 days ago",
    },
    {
      type: "training",
      title: "ISO 9001:2015 Training",
      status: "scheduled",
      time: "3 days ago",
    },
  ];

  // Sidebar navigation items
  const sidebarItems = [
    {
      id: "dashboard",
      title: "Dashboard",
      description: "Overview and KPIs",
      icon: LayoutDashboard,
      color: "text-blue-600",
      bgColor: "bg-blue-50 hover:bg-blue-100",
    },
    {
      id: "documents",
      title: "Document Control",
      description: "Policies & Procedures",
      icon: FileText,
      color: "text-blue-600",
      bgColor: "bg-blue-50 hover:bg-blue-100",
    },
    {
      id: "ncr",
      title: "Non-Conformance",
      description: "NCR Management",
      icon: AlertTriangle,
      color: "text-red-600",
      bgColor: "bg-red-50 hover:bg-red-100",
    },
    {
      id: "capa",
      title: "CAPA Management",
      description: "Corrective Actions",
      icon: Shield,
      color: "text-orange-600",
      bgColor: "bg-orange-50 hover:bg-orange-100",
    },
    {
      id: "audits",
      title: "Internal Audits",
      description: "Audit Management",
      icon: ClipboardCheck,
      color: "text-green-600",
      bgColor: "bg-green-50 hover:bg-green-100",
    },
    {
      id: "reviews",
      title: "Management Review",
      description: "Meeting Records",
      icon: Users,
      color: "text-purple-600",
      bgColor: "bg-purple-50 hover:bg-purple-100",
    },
    {
      id: "training",
      title: "Training & Competence",
      description: "Employee Training",
      icon: TrendingUp,
      color: "text-indigo-600",
      bgColor: "bg-indigo-50 hover:bg-indigo-100",
    },
    {
      id: "feedback",
      title: "Customer Feedback",
      description: "Complaints & Feedback",
      icon: MessageSquare,
      color: "text-pink-600",
      bgColor: "bg-pink-50 hover:bg-pink-100",
    },
  ];

  return (
    <AppShell>
      {/* Mobile backdrop */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <div className="flex gap-6 h-full relative">
        {/* Sidebar Navigation */}
        <div
          className={cn(
            "w-64 bg-card border-r border-border p-4 space-y-2 transition-all duration-300",
            "fixed lg:relative z-50 lg:z-auto h-full",
            sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
          )}
        >
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold">QMS Modules</h3>
              <p className="text-sm text-muted-foreground">
                Navigate between QMS features
              </p>
            </div>
            <Button
              variant="ghost"
              size="sm"
              className="lg:hidden"
              onClick={() => setSidebarOpen(false)}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>

          <nav className="space-y-1">
            {sidebarItems.map((item) => {
              const Icon = item.icon;
              const isActive = viewMode === item.id;

              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setViewMode(item.id as ViewMode);
                    setSidebarOpen(false); // Close sidebar on mobile after selection
                  }}
                  className={cn(
                    "w-full flex items-center gap-3 p-3 rounded-lg text-left transition-colors",
                    isActive
                      ? `${item.bgColor} ${item.color} border border-current/20`
                      : "hover:bg-muted text-muted-foreground hover:text-foreground"
                  )}
                >
                  <Icon className="h-5 w-5 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-sm">{item.title}</div>
                    <div className="text-xs opacity-75 truncate">
                      {item.description}
                    </div>
                  </div>
                  {isActive && (
                    <ChevronRight className="h-4 w-4 flex-shrink-0" />
                  )}
                </button>
              );
            })}
          </nav>

          {/* Quick Actions */}
          <div className="pt-6 border-t border-border">
            <h4 className="text-sm font-medium mb-3">Quick Actions</h4>
            <div className="space-y-2">
              <Button
                variant="outline"
                size="sm"
                className="w-full justify-start"
              >
                <Plus className="h-4 w-4 mr-2" />
                Create Document
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="w-full justify-start"
              >
                <AlertTriangle className="h-4 w-4 mr-2" />
                Report NCR
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="w-full justify-start"
              >
                <ClipboardCheck className="h-4 w-4 mr-2" />
                Schedule Audit
              </Button>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 space-y-6">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center gap-3">
              <Button
                variant="ghost"
                size="sm"
                className="lg:hidden"
                onClick={() => setSidebarOpen(true)}
              >
                <Menu className="h-4 w-4" />
              </Button>
              <div>
                <h2 className="text-2xl font-bold">
                  {sidebarItems.find((item) => item.id === viewMode)?.title ||
                    "Quality Management System"}
                </h2>
                <p className="text-muted-foreground">
                  {sidebarItems.find((item) => item.id === viewMode)
                    ?.description ||
                    "Comprehensive QMS for ISO compliance and quality assurance"}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder="Search QMS..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 w-64"
                />
              </div>
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="overdue">Overdue</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Dashboard Overview */}
          {viewMode === "dashboard" && (
            <div className="space-y-6">
              {/* Key Metrics */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                      Total Documents
                    </CardTitle>
                    <FileText className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      {dashboardStats.totalDocuments}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {dashboardStats.pendingReviews} pending review
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                      Open NCRs
                    </CardTitle>
                    <AlertTriangle className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      {dashboardStats.openNCRs}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      2 critical issues
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                      Active CAPAs
                    </CardTitle>
                    <Shield className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      {dashboardStats.activeCAPAs}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      1 overdue action
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                      Upcoming Audits
                    </CardTitle>
                    <ClipboardCheck className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      {dashboardStats.upcomingAudits}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Next: Quality Audit Q2-2024
                    </p>
                  </CardContent>
                </Card>
              </div>

              {/* QMS Modules Overview */}
              <Card>
                <CardHeader>
                  <CardTitle>QMS Modules Overview</CardTitle>
                  <CardDescription>
                    Quick overview of all QMS modules and their current status
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {qmsModules.map((module) => {
                      const Icon = module.icon;
                      return (
                        <div
                          key={module.id}
                          className="flex items-center space-x-3 p-3 rounded-lg border cursor-pointer hover:bg-muted/50 transition-colors"
                          onClick={() => setViewMode(module.id as ViewMode)}
                        >
                          <div
                            className={`p-2 rounded-lg ${module.color} text-white`}
                          >
                            <Icon className="h-4 w-4" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="font-medium text-sm">
                              {module.title}
                            </div>
                            <div className="text-xs text-muted-foreground">
                              {module.stats.total} total
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>

              {/* Recent Activities */}
              <Card>
                <CardHeader>
                  <CardTitle>Recent Activities</CardTitle>
                  <CardDescription>
                    Latest updates across all QMS modules
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {recentActivities.map((activity, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-3 bg-muted/50 rounded-lg"
                      >
                        <div className="flex items-center space-x-3">
                          <div
                            className={`p-2 rounded-lg ${
                              activity.type === "document"
                                ? "bg-blue-100 text-blue-600"
                                : activity.type === "ncr"
                                ? "bg-red-100 text-red-600"
                                : activity.type === "capa"
                                ? "bg-orange-100 text-orange-600"
                                : activity.type === "audit"
                                ? "bg-green-100 text-green-600"
                                : "bg-purple-100 text-purple-600"
                            }`}
                          >
                            {activity.type === "document" && (
                              <FileText className="h-4 w-4" />
                            )}
                            {activity.type === "ncr" && (
                              <AlertTriangle className="h-4 w-4" />
                            )}
                            {activity.type === "capa" && (
                              <Shield className="h-4 w-4" />
                            )}
                            {activity.type === "audit" && (
                              <ClipboardCheck className="h-4 w-4" />
                            )}
                            {activity.type === "training" && (
                              <TrendingUp className="h-4 w-4" />
                            )}
                          </div>
                          <div>
                            <p className="font-medium">{activity.title}</p>
                            <p className="text-sm text-muted-foreground capitalize">
                              Status: {activity.status}
                            </p>
                          </div>
                        </div>
                        <span className="text-sm text-muted-foreground">
                          {activity.time}
                        </span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Module Views */}
          {viewMode !== "dashboard" && (
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="capitalize">
                      {viewMode === "ncr"
                        ? "Non-Conformance Management"
                        : viewMode === "capa"
                        ? "CAPA Management"
                        : viewMode === "audits"
                        ? "Internal Audits"
                        : viewMode === "reviews"
                        ? "Management Reviews"
                        : viewMode === "training"
                        ? "Training & Competence"
                        : viewMode === "feedback"
                        ? "Customer Feedback"
                        : "Document Control"}
                    </CardTitle>
                    <CardDescription>
                      {qmsModules.find((m) => m.id === viewMode)?.description}
                    </CardDescription>
                  </div>
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    Add New
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-center py-12">
                  <div className="text-center">
                    <div className="text-6xl mb-4">🚧</div>
                    <h3 className="text-lg font-semibold mb-2">
                      {viewMode.charAt(0).toUpperCase() + viewMode.slice(1)}{" "}
                      Module
                    </h3>
                    <p className="text-muted-foreground">
                      This module is under development. Full functionality will
                      be available soon.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </AppShell>
  );
}
