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
import { useAuth } from "@/context/AuthContext";
import {
  Users,
  Phone,
  FileText,
  Car,
  Calendar,
  CheckCircle,
  Clock,
  AlertTriangle,
} from "lucide-react";

// Mock data for dashboard stats
const mockStats = {
  totalEmployees: 45,
  totalContacts: 128,
  totalDocuments: 234,
  totalVehicles: 12,
  pendingLeaveRequests: 8,
  approvedLeaveRequests: 23,
  documentsExpiringSoon: 5,
  vehiclesNeedingService: 2,
};

const StatCard: React.FC<{
  title: string;
  value: number;
  icon: React.ElementType;
  description?: string;
  variant?: "default" | "warning" | "success";
}> = ({ title, value, icon: Icon, description, variant = "default" }) => {
  const getVariantStyles = () => {
    switch (variant) {
      case "warning":
        return "border-orange-200 bg-orange-50 dark:border-orange-800 dark:bg-orange-950";
      case "success":
        return "border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-950";
      default:
        return "";
    }
  };

  return (
    <Card className={getVariantStyles()}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <Icon className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        {description && (
          <p className="text-xs text-muted-foreground">{description}</p>
        )}
      </CardContent>
    </Card>
  );
};

const EmployeeDashboard: React.FC = () => (
  <div className="space-y-6">
    <div>
      <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
      <p className="text-muted-foreground">
        Welcome back! Here's what's happening today.
      </p>
    </div>

    <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
      <StatCard
        title="My Leave Balance"
        value={15}
        icon={Calendar}
        description="Days remaining this year"
      />
      <StatCard
        title="Pending Requests"
        value={2}
        icon={Clock}
        description="Awaiting approval"
        variant="warning"
      />
      <StatCard
        title="Team Documents"
        value={12}
        icon={FileText}
        description="Shared with you"
      />
      {/* <StatCard
        title="Quick Actions"
        value={4}
        icon={CheckCircle}
        description="Tasks to complete"
      /> */}
    </div>

    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      <Card className="col-span-2">
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
          <CardDescription>Your latest actions and updates</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center space-x-4">
              <div className="h-2 w-2 bg-green-500 rounded-full" />
              <div className="flex-1">
                <p className="text-sm font-medium">Leave request approved</p>
                <p className="text-xs text-muted-foreground">2 hours ago</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="h-2 w-2 bg-blue-500 rounded-full" />
              <div className="flex-1">
                <p className="text-sm font-medium">Document uploaded</p>
                <p className="text-xs text-muted-foreground">1 day ago</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="h-2 w-2 bg-orange-500 rounded-full" />
              <div className="flex-1">
                <p className="text-sm font-medium">Profile updated</p>
                <p className="text-xs text-muted-foreground">3 days ago</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Quick Links</CardTitle>
          <CardDescription>Frequently used actions</CardDescription>
        </CardHeader>
        <CardContent className="space-y-2">
          <button className="w-full text-left p-2 rounded hover:bg-accent transition-colors">
            <div className="flex items-center space-x-2">
              <Calendar className="h-4 w-4" />
              <span className="text-sm">Request Time Off</span>
            </div>
          </button>
          <button className="w-full text-left p-2 rounded hover:bg-accent transition-colors">
            <div className="flex items-center space-x-2">
              <FileText className="h-4 w-4" />
              <span className="text-sm">Upload Document</span>
            </div>
          </button>
          <button className="w-full text-left p-2 rounded hover:bg-accent transition-colors">
            <div className="flex items-center space-x-2">
              <Phone className="h-4 w-4" />
              <span className="text-sm">Add Contact</span>
            </div>
          </button>
        </CardContent>
      </Card>
    </div>
  </div>
);

const ApproverDashboard: React.FC = () => (
  <div className="space-y-6">
    <div>
      <h2 className="text-3xl font-bold tracking-tight"> Dashboard</h2>
      <p className="text-muted-foreground">
        Manage your team and approve requests.
      </p>
    </div>

    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <StatCard
        title="Team Members"
        value={12}
        icon={Users}
        description="Under your supervision"
      />
      <StatCard
        title="Pending Approvals"
        value={mockStats.pendingLeaveRequests}
        icon={Clock}
        description="Require your attention"
        variant="warning"
      />
      <StatCard
        title="Approved This Month"
        value={mockStats.approvedLeaveRequests}
        icon={CheckCircle}
        description="Leave requests processed"
        variant="success"
      />
      <StatCard
        title="Team Documents"
        value={45}
        icon={FileText}
        description="Shared with team"
      />
    </div>
  </div>
);

const AdminDashboard: React.FC = () => (
  <div className="space-y-6">
    <div>
      <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
      <p className="text-muted-foreground">
        System overview and management tools.
      </p>
    </div>

    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <StatCard
        title="Total Employees"
        value={mockStats.totalEmployees}
        icon={Users}
        description="Active in system"
      />
      <StatCard
        title="Total Contacts"
        value={mockStats.totalContacts}
        icon={Phone}
        description="In directory"
      />
      <StatCard
        title="Documents"
        value={mockStats.totalDocuments}
        icon={FileText}
        description="Stored in system"
      />
      <StatCard
        title="Fleet Vehicles"
        value={mockStats.totalVehicles}
        icon={Car}
        description="Under management"
      />
    </div>

    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <StatCard
        title="Pending Leave"
        value={mockStats.pendingLeaveRequests}
        icon={Clock}
        description="Awaiting approval"
        variant="warning"
      />
      <StatCard
        title="Approved Leave"
        value={mockStats.approvedLeaveRequests}
        icon={CheckCircle}
        description="This month"
        variant="success"
      />
      <StatCard
        title="Expiring Documents"
        value={mockStats.documentsExpiringSoon}
        icon={AlertTriangle}
        description="Need attention"
        variant="warning"
      />
      <StatCard
        title="Vehicle Service"
        value={mockStats.vehiclesNeedingService}
        icon={Car}
        description="Due for maintenance"
        variant="warning"
      />
    </div>
  </div>
);

export default function DashboardPage() {
  const { user } = useAuth();

  const renderDashboard = () => {
    switch (user?.role) {
      case "admin":
        return <AdminDashboard />;
      case "approver":
        return <ApproverDashboard />;
      default:
        return <EmployeeDashboard />;
    }
  };

  return <AppShell>{renderDashboard()}</AppShell>;
}
