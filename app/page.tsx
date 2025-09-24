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
import { Calendar as LeaveCalendar } from "@/components/ui/calendar";

import { useRouter } from "next/navigation";
import {
  employeeApi,
  leaveBalanceApi,
  leaveRequestApi,
  notificationApi,
} from "@/lib/api";
import { useQuery } from "@tanstack/react-query";
import { Badge } from "@/components/ui/badge";

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

const LeaveBalanceCard = (leaveBalance: any) => {
  console.log("leaveBalance from the leave balance card", leaveBalance);
  return (
    <Card>
      <CardHeader>
        <CardTitle>Leave Balance</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">
          {/* this is an array of the leave balances */}
          {leaveBalance?.leaveBalance?.map((balance: any) => (
            <div key={balance._id}>
              {/* <Badge>{balance.leaveTypeId.name}</Badge> */}
              <Badge className="bg-primary text-xs text-primary-foreground">
                {balance.leaveTypeId.name}: {balance.remaining}
              </Badge>
            </div>
          ))}
          {/* {leaveBalance.leaveBalance?.length} */}
        </div>
      </CardContent>
    </Card>
  );
};

const EmployeeDashboard: React.FC = () => {
  const router = useRouter();
  // fetch the leave balance from the api
  const { data: leaveBalance } = useQuery({
    queryKey: ["leaveBalance"],
    queryFn: () =>
      leaveBalanceApi.getMy(localStorage.getItem("access_token") || undefined),
  });

  console.log("leaveBalance", leaveBalance);

  const user = useAuth();
  // console.log("user", user);

  // fetch my leave requests from the api
  const { data: leaveRequests } = useQuery({
    queryKey: ["leaveRequests"],
    queryFn: () => leaveRequestApi.getAll(undefined),
  });
  // console.log("leaveRequests", leaveRequests);

  const myLeaveRequestPending = leaveRequests?.filter(
    (request: any) =>
      request.employeeId._id === user?.user?.id &&
      request.status === "submitted"
  );

  // console.log("myLeaveRequestPending", myLeaveRequestPending);

  const recentActivity = useQuery({
    queryKey: ["recentActivity"],
    queryFn: () => notificationApi.getAll(undefined),
  });

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
        <p className="text-muted-foreground">
          Welcome back! Here's what's happening today.
        </p>
      </div>

      <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-">
        {/* <StatCard
          title="My Leave Balance"
          value={leaveBalance?.length || 0}
          icon={Calendar}
          description="Days remaining this year"
        /> */}

        <LeaveBalanceCard leaveBalance={leaveBalance} />
        <StatCard
          title="Pending Requests"
          value={myLeaveRequestPending?.length || 0}
          icon={Clock}
          description="Awaiting approval"
          variant="warning"
        />
        {/* <StatCard
          title="Team Documents"
          value={12}
          icon={FileText}
          description="Shared with you"
        /> */}
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
              {recentActivity.data?.notifications.map((activity: any) => (
                <div className="flex items-center space-x-4">
                  <div className="h-2 w-2 bg-blue-500 rounded-full" />
                  <div className="flex-1">
                    <p className="text-sm font-medium">{activity.title}</p>
                  </div>
                </div>
              ))}

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
            <button
              onClick={() => router.push("/time-off")}
              className="w-full text-left p-2 rounded hover:bg-accent transition-colors"
            >
              <div className="flex items-center space-x-2">
                <Calendar className="h-4 w-4" />
                <span className="text-sm">Request Time Off</span>
              </div>
            </button>
            <button
              onClick={() => router.push("/documents")}
              className="w-full text-left p-2 rounded hover:bg-accent transition-colors"
            >
              <div className="flex items-center space-x-2">
                <FileText className="h-4 w-4" />
                <span className="text-sm">Upload Document</span>
              </div>
            </button>
            <button
              onClick={() => router.push("/contacts")}
              className="w-full text-left p-2 rounded hover:bg-accent transition-colors"
            >
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
};

const ApproverDashboard: React.FC = () => {
  const router = useRouter();
  return (
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
};

const AdminDashboard: React.FC = () => {
  const router = useRouter();

  const token =
    typeof window !== "undefined"
      ? localStorage.getItem("access_token") || undefined
      : undefined;

  const { data: employees } = useQuery({
    queryKey: ["employees", "all"],
    queryFn: () => employeeApi.getAll(token),
  });

  const { data: submittedRequests } = useQuery({
    queryKey: ["leaveRequests", "submitted"],
    queryFn: () => leaveRequestApi.getAll({ status: "submitted" }),
  });

  const { data: approvedRequests } = useQuery({
    queryKey: ["leaveRequests", "approved_final"],
    queryFn: () => leaveRequestApi.getAll({ status: "approved_final" }),
  });

  // Calendar dates from approved requests
  const approvedDates: string[] = React.useMemo(() => {
    if (!approvedRequests) return [];
    const dates: string[] = [];
    for (const req of approvedRequests as any[]) {
      if (!req.startDate || !req.endDate) continue;
      const start = new Date(req.startDate);
      const end = new Date(req.endDate);
      const d = new Date(start);
      while (d <= end) {
        dates.push(d.toISOString().split("T")[0]);
        d.setDate(d.getDate() + 1);
      }
    }
    return dates;
  }, [approvedRequests]);

  // Counters per employee
  const { data: employeeBalancesSummary } = useQuery({
    queryKey: ["leaveBalance", "summary"],
    enabled: !!employees?.length,
    queryFn: async () => {
      const results = await Promise.all(
        (employees as any[]).map(async (emp: any) => {
          try {
            const balances = await leaveBalanceApi.getByEmployee(
              emp._id,
              token
            );
            // Sum remaining across leave types, excluding pending:
            // remainingAvailable = allocated + carryOver - used
            const remainingDays = (balances || []).reduce(
              (sum: number, b: any) => {
                const allocated =
                  typeof b.allocated === "number" ? b.allocated : 0;
                const carryOver =
                  typeof b.carryOver === "number" ? b.carryOver : 0;
                const used = typeof b.used === "number" ? b.used : 0;
                return sum + (allocated + carryOver - used);
              },
              0
            );

            return {
              employeeId: emp._id,
              employeeName: emp.name,
              remainingDays,
            };
          } catch {
            return {
              employeeId: emp._id,
              employeeName: emp.name,
              remainingDays: 0,
            };
          }
        })
      );
      return results;
    },
  });

  const currentYear = new Date().getFullYear();

  const employeeRows = React.useMemo(() => {
    const pendingByEmployee = new Map<string, number>();
    (submittedRequests || []).forEach((req: any) => {
      const empId = req.employeeId?._id || req.employee?._id;
      if (!empId) return;
      pendingByEmployee.set(empId, (pendingByEmployee.get(empId) || 0) + 1);
    });

    const approvedByEmployeeThisYear = new Map<string, number>();
    (approvedRequests || []).forEach((req: any) => {
      const empId = req.employeeId?._id || req.employee?._id;
      if (!empId) return;
      const start = new Date(req.startDate);
      if (start.getFullYear() !== currentYear) return;
      const taken = req.totalDays ?? req.days ?? 0;
      approvedByEmployeeThisYear.set(
        empId,
        (approvedByEmployeeThisYear.get(empId) || 0) +
          (typeof taken === "number" ? taken : 0)
      );
    });

    return (employees || []).map((emp: any) => {
      const balance = (employeeBalancesSummary || []).find(
        (b: any) => b.employeeId === emp._id
      );
      return {
        id: emp._id,
        name: emp.name,
        department: emp.department,
        remainingDays: balance?.remainingDays ?? 0,
        pendingCount: pendingByEmployee.get(emp._id) || 0,
        takenYtd: approvedByEmployeeThisYear.get(emp._id) || 0,
      };
    });
  }, [
    employees,
    employeeBalancesSummary,
    submittedRequests,
    approvedRequests,
    currentYear,
  ]);

  const approvedThisMonth = React.useMemo(() => {
    if (!approvedRequests) return 0;
    const now = new Date();
    const m = now.getMonth();
    const y = now.getFullYear();
    return (approvedRequests as any[]).filter((r) => {
      const d = new Date(r.startDate);
      return d.getMonth() === m && d.getFullYear() === y;
    }).length;
  }, [approvedRequests]);

  console.log("approvedDates", approvedDates);

  // Employees on leave today (based on approved requests)
  const employeesOnLeaveToday = React.useMemo(() => {
    if (!approvedRequests || !employees)
      return [] as {
        id: string;
        name: string;
        department?: string;
        daysTaken: number;
      }[];

    const startOfDay = (date: Date) => {
      const d = new Date(date);
      d.setHours(0, 0, 0, 0);
      return d;
    };

    const today = startOfDay(new Date());

    const byId = new Map<string, any>();
    (employees as any[]).forEach((e) => byId.set(e._id, e));

    const resultMap = new Map<
      string,
      { id: string; name: string; department?: string; daysTaken: number }
    >();

    (approvedRequests as any[]).forEach((req) => {
      if (!req.startDate || !req.endDate) return;
      const start = startOfDay(new Date(req.startDate));
      const end = startOfDay(new Date(req.endDate));
      if (today >= start && today <= end) {
        const empId = req.employeeId?._id || req.employee?._id;
        const empName =
          req.employeeId?.name ||
          req.employee?.name ||
          byId.get(empId)?.name ||
          "Unknown";
        const dept = byId.get(empId)?.department;
        // Determine total days for this approved request; fallback to inclusive diff
        const requestDays =
          typeof req.totalDays === "number" && !isNaN(req.totalDays)
            ? req.totalDays
            : typeof req.days === "number" && !isNaN(req.days)
            ? req.days
            : Math.max(
                1,
                Math.round(
                  (end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)
                ) + 1
              );

        if (empId) {
          const existing = resultMap.get(empId);
          if (existing) {
            // Sum if multiple overlapping approved requests exist (edge case)
            existing.daysTaken += requestDays;
          } else {
            resultMap.set(empId, {
              id: empId,
              name: empName,
              department: dept,
              daysTaken: requestDays,
            });
          }
        }
      }
    });

    return Array.from(resultMap.values());
  }, [approvedRequests, employees]);

  return (
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
          value={employees?.length || 0}
          icon={Users}
          description="Active in system"
        />
        <StatCard
          title="Awaiting Approvals"
          value={submittedRequests?.length || 0}
          icon={Clock}
          description="Leave requests pending"
          variant="warning"
        />
        <StatCard
          title="Approved This Month"
          value={approvedThisMonth}
          icon={CheckCircle}
          description="Leave requests processed"
          variant="success"
        />
        <StatCard
          title="Documents"
          value={12}
          icon={FileText}
          description="Stored in system"
        />
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Approved Leave Calendar</CardTitle>
            <CardDescription>All approved leave dates</CardDescription>
          </CardHeader>
          <CardContent>
            {/* Reuse Calendar component with approved dates */}
            <LeaveCalendar approvedDates={approvedDates} requestedDates={[]} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>On Leave </CardTitle>
            {/* <CardDescription>Approved leaves for the day</CardDescription> */}
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {employeesOnLeaveToday.length === 0 ? (
                <p className="text-sm text-muted-foreground">
                  No employees are on leave today.
                </p>
              ) : (
                employeesOnLeaveToday.map((e) => (
                  <div
                    key={e.id}
                    className="flex items-center justify-between border rounded-md px-3 py-2"
                  >
                    <div className="flex flex-col">
                      <span className="text-sm font-medium">{e.name}</span>
                      {/* <span className="text-xs text-muted-foreground">
                        {e.department || "-"}
                      </span> */}
                    </div>
                    <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded">
                      {e.daysTaken} {e.daysTaken === 1 ? "day" : "days"}
                    </span>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Employee Leave Counters</CardTitle>
          <CardDescription>
            Remaining, taken year-to-date, and pending
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="text-muted-foreground">
                <tr>
                  <th className="text-left py-2">Employee</th>
                  <th className="text-left py-2">Department</th>
                  <th className="text-left py-2">Remaining</th>
                  <th className="text-left py-2">Taken YTD</th>
                  <th className="text-left py-2">Pending</th>
                </tr>
              </thead>
              <tbody>
                {(employeeRows || []).map((row) => (
                  <tr key={row.id} className="border-t">
                    <td className="py-2">{row.name}</td>
                    <td className="py-2">{row.department || "-"}</td>
                    <td className="py-2">{row.remainingDays}</td>
                    <td className="py-2">{row.takenYtd}</td>
                    <td className="py-2">{row.pendingCount}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default function DashboardPage() {
  const { user } = useAuth();
  const router = useRouter();
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
