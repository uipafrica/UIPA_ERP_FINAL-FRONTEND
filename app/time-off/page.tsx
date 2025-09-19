"use client";

import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { AppShell } from "@/components/layout/AppShell";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Calendar as CalendarIcon,
  Plus,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  Filter,
  Loader2,
  User,
  Search,
} from "lucide-react";
import { LeaveRequest, LeaveStatus, Employee, LeaveType } from "@/types";
import { formatDate } from "@/lib/utils";
import { leaveRequestApi, leaveBalanceApi, leaveTypeApi } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";
import { Calendar } from "@/components/ui/calendar";
import { AddLeaveTypeModal } from "@/components/time-off/AddLeaveTypeModal";
import { RequestTimeOffModal } from "@/components/time-off/RequestTimeOffModal";

const getStatusIcon = (status: LeaveStatus) => {
  switch (status) {
    case "submitted":
      return <Clock className="h-4 w-4 text-orange-500" />;
    case "approved_lvl1":
      return <AlertCircle className="h-4 w-4 text-blue-500" />;
    case "approved_final":
      return <CheckCircle className="h-4 w-4 text-green-500" />;
    case "rejected":
      return <XCircle className="h-4 w-4 text-red-500" />;
    case "cancelled":
      return <XCircle className="h-4 w-4 text-gray-500" />;
    default:
      return <Clock className="h-4 w-4 text-gray-500" />;
  }
};

const getStatusColor = (status: LeaveStatus): string => {
  switch (status) {
    case "submitted":
      return "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300";
    case "approved_lvl1":
      return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300";
    case "approved_final":
      return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300";
    case "rejected":
      return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300";
    case "cancelled":
      return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300";
    default:
      return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300";
  }
};

const LeaveBalanceCard: React.FC<{ balance: any }> = ({ balance }) => {
  const remaining = balance.remaining || 0;
  const used = balance.used || 0;
  const allocated = balance.allocated || 0;

  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">
            {balance.leaveType?.name || "Unknown Type"}
          </h3>
          <div className="text-right">
            <div className="text-2xl font-bold text-primary">{remaining}</div>
            <div className="text-sm text-muted-foreground">days left</div>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Used: {used} days</span>
            <span>Total: {allocated} days</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2 dark:bg-gray-700">
            <div
              className="bg-primary h-2 rounded-full transition-all"
              style={{
                width: allocated > 0 ? `${(used / allocated) * 100}%` : "0%",
              }}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default function TimeOffPage() {
  const [activeTab, setActiveTab] = useState<"requests" | "balance" | "admin">(
    "requests"
  );
  const [showMyRequestsOnly, setShowMyRequestsOnly] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState<LeaveStatus | "all">(
    "all"
  );
  const [showAddLeaveTypeModal, setShowAddLeaveTypeModal] = useState(false);
  const [showRequestTimeOffModal, setShowRequestTimeOffModal] = useState(false);
  const { user } = useAuth();
  const router = useRouter();
  const isAdmin = user?.role === "admin";

  // Fetch leave requests
  const {
    data: leaveRequests = [],
    isLoading: requestsLoading,
    error: requestsError,
    refetch: refetchRequests,
  } = useQuery({
    queryKey: ["leaveRequests", { myOnly: showMyRequestsOnly }],
    queryFn: () => {
      // For regular employees, always show only their requests
      // For admins/approvers, respect the filter toggle
      const shouldShowMyOnly = user?.role === "employee" || showMyRequestsOnly;
      return leaveRequestApi.getAll(
        shouldShowMyOnly ? {} : undefined, // Empty object gets all, undefined gets user's own
        localStorage.getItem("access_token") || undefined
      );
    },
    enabled: !!user,
  });

  // console.log(leaveRequests);

  // Fetch leave balances
  const {
    data: leaveBalances = [],
    isLoading: balancesLoading,
    error: balancesError,
    refetch: refetchBalances,
  } = useQuery({
    queryKey: ["leaveBalances"],
    queryFn: () =>
      leaveBalanceApi.getMy(localStorage.getItem("access_token") || undefined),
    enabled: !!user,
  });

  // Fetch leave types (for admin)
  const {
    data: leaveTypes = [],
    isLoading: typesLoading,
    error: typesError,
    refetch: refetchTypes,
  } = useQuery({
    queryKey: ["leaveTypes"],
    queryFn: () =>
      leaveTypeApi.getAll(localStorage.getItem("access_token") || undefined),
    enabled: !!user && isAdmin,
  });

  // console.log(leaveTypes);

  const handleFilterToggle = () => {
    setShowMyRequestsOnly(!showMyRequestsOnly);
  };

  const canViewAllRequests =
    user?.role === "admin" || user?.role === "approver";

  const handleViewLeaveDetails = (request: any) => {
    router.push(`/time-off/requests/${request._id || request.id}`);
  };

  // Filter leave requests based on search and status
  const filteredLeaveRequests = leaveRequests?.filter((request: any) => {
    // Search filter
    const searchLower = searchTerm.toLowerCase();
    const matchesSearch =
      !searchTerm ||
      request.employeeId?.name?.toLowerCase().includes(searchLower) ||
      request.employee?.name?.toLowerCase().includes(searchLower) ||
      request.leaveTypeId?.name?.toLowerCase().includes(searchLower) ||
      request.leaveType?.name?.toLowerCase().includes(searchLower) ||
      request.reason?.toLowerCase().includes(searchLower) ||
      request.employeeId?.department?.toLowerCase().includes(searchLower) ||
      request.employee?.department?.toLowerCase().includes(searchLower);

    // Status filter
    const matchesStatus =
      selectedStatus === "all" || request.status === selectedStatus;

    return matchesSearch && matchesStatus;
  });

  // Available status options
  // "submitted" | "approved_lvl1" | "approved_final" | "rejected" | "cancelled";
  const statusOptions: (LeaveStatus | "all")[] = [
    "all",
    "submitted",
    "approved_lvl1",
    "approved_final",
    "rejected",
    "cancelled",
  ];

  const getStatusLabel = (status: LeaveStatus | "all"): string => {
    switch (status) {
      case "all":
        return "All Status";
      case "submitted":
        return "Submitted";
      case "approved_lvl1":
        return "Level 1 Approved";
      case "approved_final":
        return "Approved";
      case "rejected":
        return "Rejected";
      case "cancelled":
        return "Cancelled";
    }
  };

  return (
    <AppShell>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Time Off</h1>
            <p className="text-muted-foreground">
              Manage leave requests and view your time off balance
            </p>
          </div>
          <Button onClick={() => setShowRequestTimeOffModal(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Request Time Off
          </Button>
        </div>

        <div className="flex space-x-1 bg-muted p-1 rounded-lg w-fit">
          <Button
            variant={activeTab === "requests" ? "default" : "ghost"}
            size="sm"
            onClick={() => setActiveTab("requests")}
          >
            Leave Requests
          </Button>
          <Button
            variant={activeTab === "balance" ? "default" : "ghost"}
            size="sm"
            onClick={() => setActiveTab("balance")}
          >
            Leave Balance
          </Button>
          {isAdmin && (
            <Button
              variant={activeTab === "admin" ? "default" : "ghost"}
              size="sm"
              onClick={() => setActiveTab("admin")}
            >
              Admin Panel
            </Button>
          )}
        </div>

        {activeTab === "requests" && (
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Leave Requests</CardTitle>
                  <CardDescription>
                    {showMyRequestsOnly
                      ? "Your leave requests"
                      : "All leave requests"}
                  </CardDescription>
                </div>
                {canViewAllRequests && (
                  <Button
                    variant={showMyRequestsOnly ? "outline" : "default"}
                    size="sm"
                    onClick={handleFilterToggle}
                  >
                    <Filter className="h-4 w-4 mr-2" />
                    {showMyRequestsOnly
                      ? "Show All Requests"
                      : "Show My Requests"}
                  </Button>
                )}
              </div>
            </CardHeader>
            <CardContent>
              {/* Search and Filters */}
              <div className="flex flex-col space-y-4 mb-6">
                {/* Search Input */}
                <div className="flex items-center space-x-2">
                  <div className="relative flex-1">
                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search by employee, leave type, reason, or department..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-8"
                    />
                  </div>
                </div>

                {/* Status Filter Buttons */}
                <div className="flex flex-wrap gap-2">
                  {statusOptions.map((status) => (
                    <Button
                      key={status}
                      variant={
                        selectedStatus === status ? "default" : "outline"
                      }
                      size="sm"
                      onClick={() => setSelectedStatus(status)}
                      className="capitalize"
                    >
                      {status === "all" ? (
                        "All Status"
                      ) : (
                        <div className="flex items-center space-x-1">
                          {getStatusIcon(status as LeaveStatus)}
                          <span>{getStatusLabel(status)}</span>
                        </div>
                      )}
                    </Button>
                  ))}
                </div>
              </div>

              {/* Loading State */}
              {requestsLoading && (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                  <span className="ml-2 text-muted-foreground">
                    Loading leave requests...
                  </span>
                </div>
              )}

              {/* Error State */}
              {requestsError && (
                <div className="flex items-center justify-center py-8">
                  <AlertCircle className="h-8 w-8 text-destructive mr-2" />
                  <div className="text-center">
                    <p className="text-destructive font-medium">
                      Failed to load leave requests
                    </p>
                    <p className="text-sm text-muted-foreground mt-1">
                      {requestsError instanceof Error
                        ? requestsError.message
                        : "An error occurred"}
                    </p>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => refetchRequests()}
                      className="mt-2"
                    >
                      Try Again
                    </Button>
                  </div>
                </div>
              )}

              {/* Table Display */}
              {!requestsLoading && !requestsError && (
                <>
                  {filteredLeaveRequests?.length > 0 ? (
                    <div className="rounded-md border">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Employee</TableHead>
                            <TableHead>Leave Type</TableHead>
                            <TableHead>Dates</TableHead>
                            <TableHead>Days</TableHead>
                            <TableHead>Reason</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Submitted</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {filteredLeaveRequests?.map((request: any) => (
                            <TableRow
                              key={request._id || request.id}
                              className="cursor-pointer hover:bg-muted/50"
                              onClick={() => handleViewLeaveDetails(request)}
                            >
                              <TableCell>
                                <div className="flex items-center space-x-2">
                                  <User className="h-4 w-4 text-muted-foreground" />
                                  <div>
                                    <p className="font-medium">
                                      {request.employeeId?.name ||
                                        request.employee?.name ||
                                        "Unknown Employee"}
                                    </p>
                                    <p className="text-xs text-muted-foreground">
                                      {request.employeeId?.department ||
                                        request.employee?.department ||
                                        "No department"}
                                    </p>
                                  </div>
                                </div>
                              </TableCell>
                              <TableCell>
                                <span className="font-medium">
                                  {request.leaveTypeId?.name ||
                                    request.leaveType?.name ||
                                    "Unknown Type"}
                                </span>
                              </TableCell>
                              <TableCell>
                                <div className="text-sm">
                                  <p>{formatDate(request.startDate)}</p>
                                  <p className="text-muted-foreground">
                                    to {formatDate(request.endDate)}
                                  </p>
                                </div>
                              </TableCell>
                              <TableCell>
                                <span
                                  className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium  bg-primary text-white`}
                                >
                                  {request.totalDays}
                                </span>
                              </TableCell>
                              <TableCell>
                                <p
                                  className="text-sm max-w-[200px] truncate"
                                  title={request.reason}
                                >
                                  {request.reason}
                                </p>
                              </TableCell>
                              <TableCell>
                                <div className="flex items-center space-x-2">
                                  {getStatusIcon(request.status)}
                                  <span
                                    className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                                      request.status
                                    )}`}
                                  >
                                    {request.status.replace("_", " ")}
                                  </span>
                                </div>
                              </TableCell>
                              <TableCell>
                                <span className="text-sm text-muted-foreground">
                                  {formatDate(request.createdAt)}
                                </span>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <p className="text-muted-foreground">
                        {leaveRequests?.length === 0
                          ? showMyRequestsOnly
                            ? "You haven't submitted any leave requests yet."
                            : "No leave requests found."
                          : "No leave requests match your current filters."}
                      </p>
                      {leaveRequests?.length > 0 &&
                        (searchTerm || selectedStatus !== "all") && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              setSearchTerm("");
                              setSelectedStatus("all");
                            }}
                            className="mt-2"
                          >
                            Clear Filters
                          </Button>
                        )}
                    </div>
                  )}
                </>
              )}
            </CardContent>
          </Card>
        )}

        {activeTab === "balance" && (
          <Card>
            <CardHeader>
              <CardTitle>Leave Balance</CardTitle>
              <CardDescription>
                Your current leave allocation and usage
              </CardDescription>

              {/* add button to add leave */}
            </CardHeader>
            <CardContent>
              {/* Loading State */}
              {balancesLoading && (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                  <span className="ml-2 text-muted-foreground">
                    Loading leave balances...
                  </span>
                </div>
              )}

              {/* Error State */}
              {balancesError && (
                <div className="flex items-center justify-center py-8">
                  <AlertCircle className="h-8 w-8 text-destructive mr-2" />
                  <div className="text-center">
                    <p className="text-destructive font-medium">
                      Failed to load leave balances
                    </p>
                    <p className="text-sm text-muted-foreground mt-1">
                      {balancesError instanceof Error
                        ? balancesError.message
                        : "An error occurred"}
                    </p>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => refetchBalances()}
                      className="mt-2"
                    >
                      Try Again
                    </Button>
                  </div>
                </div>
              )}

              {/* Balance Cards */}
              {!balancesLoading && !balancesError && (
                <>
                  {leaveBalances?.length > 0 ? (
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                      {leaveBalances.map((balance: any) => (
                        <LeaveBalanceCard
                          key={balance._id || balance.id}
                          balance={balance}
                        />
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <p className="text-muted-foreground">
                        No leave balances found. Contact HR to set up your leave
                        allocation.
                      </p>
                    </div>
                  )}
                </>
              )}
            </CardContent>
          </Card>
        )}

        {/* Admin Panel */}
        {activeTab === "admin" && isAdmin && (
          <div className="space-y-6">
            {/* Leave Types Management */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Leave Types Management</CardTitle>
                    <CardDescription>
                      Manage available leave types for employees
                    </CardDescription>
                  </div>
                  <Button onClick={() => setShowAddLeaveTypeModal(true)}>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Leave Type
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {/* Loading State */}
                {typesLoading && (
                  <div className="flex items-center justify-center py-8">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                    <span className="ml-2 text-muted-foreground">
                      Loading leave types...
                    </span>
                  </div>
                )}

                {/* Error State */}
                {typesError && (
                  <div className="flex items-center justify-center py-8">
                    <AlertCircle className="h-8 w-8 text-destructive mr-2" />
                    <div className="text-center">
                      <p className="text-destructive font-medium">
                        Failed to load leave types
                      </p>
                      <p className="text-sm text-muted-foreground mt-1">
                        {typesError instanceof Error
                          ? typesError.message
                          : "An error occurred"}
                      </p>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => refetchTypes()}
                        className="mt-2"
                      >
                        Try Again
                      </Button>
                    </div>
                  </div>
                )}

                {/* Leave Types Table */}
                {!typesLoading && !typesError && (
                  <>
                    {leaveTypes?.length > 0 ? (
                      <div className="rounded-md border">
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>Name</TableHead>
                              <TableHead>Description</TableHead>
                              <TableHead>Max Days</TableHead>
                              <TableHead>Carry Over</TableHead>
                              <TableHead>Status</TableHead>
                              <TableHead>Created</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {leaveTypes?.map((type: any) => (
                              <TableRow key={type._id || type.id}>
                                <TableCell>
                                  <span className="font-medium">
                                    {type.name}
                                  </span>
                                </TableCell>
                                <TableCell>
                                  <span className="text-sm text-muted-foreground">
                                    {type.description || "No description"}
                                  </span>
                                </TableCell>
                                <TableCell>
                                  <span className="font-medium">
                                    {type.maxDays} days
                                  </span>
                                </TableCell>
                                <TableCell>
                                  <span
                                    className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                                      type.carryOver
                                        ? "bg-green-100 text-green-800"
                                        : "bg-gray-100 text-gray-800"
                                    }`}
                                  >
                                    {type.carryOver ? "Yes" : "No"}
                                  </span>
                                </TableCell>
                                <TableCell>
                                  <span
                                    className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                                      type.isActive
                                        ? "bg-green-100 text-green-800"
                                        : "bg-red-100 text-red-800"
                                    }`}
                                  >
                                    {type.isActive ? "Active" : "Inactive"}
                                  </span>
                                </TableCell>
                                <TableCell>
                                  <span className="text-sm text-muted-foreground">
                                    {formatDate(type.createdAt)}
                                  </span>
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </div>
                    ) : (
                      <div className="text-center py-8">
                        <p className="text-muted-foreground">
                          No leave types found. Create your first leave type to
                          get started.
                        </p>
                      </div>
                    )}
                  </>
                )}
              </CardContent>
            </Card>

            {/* Leave Calendar */}
            <div className="grid gap-6 lg:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Leave Calendar</CardTitle>
                  <CardDescription>
                    View approved leave days for this month
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Calendar
                    approvedDates={leaveRequests
                      .filter((req: any) => req.status === "approved_final")
                      .flatMap((req: any) => {
                        const start = new Date(req.startDate);
                        const end = new Date(req.endDate);
                        const dates = [];
                        for (
                          let d = new Date(start);
                          d <= end;
                          d.setDate(d.getDate() + 1)
                        ) {
                          dates.push(d.toISOString().split("T")[0]);
                        }
                        return dates;
                      })}
                  />
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Quick Stats</CardTitle>
                  <CardDescription>Overview of leave requests</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">
                        Total Requests
                      </span>
                      <span className="text-2xl font-bold">
                        {leaveRequests.length}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Pending</span>
                      <span className="text-xl font-semibold text-orange-600">
                        {
                          leaveRequests.filter(
                            (req: any) => req.status === "submitted"
                          ).length
                        }
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Approved</span>
                      <span className="text-xl font-semibold text-green-600">
                        {
                          leaveRequests.filter(
                            (req: any) => req.status === "approved_final"
                          ).length
                        }
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Rejected</span>
                      <span className="text-xl font-semibold text-red-600">
                        {
                          leaveRequests.filter(
                            (req: any) => req.status === "rejected"
                          ).length
                        }
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )}

        {/* Modals */}
        <RequestTimeOffModal
          open={showRequestTimeOffModal}
          onOpenChange={setShowRequestTimeOffModal}
        />

        <AddLeaveTypeModal
          open={showAddLeaveTypeModal}
          onOpenChange={setShowAddLeaveTypeModal}
        />
      </div>
    </AppShell>
  );
}
