"use client";

import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useRouter, useParams } from "next/navigation";
import { AppShell } from "@/components/layout/AppShell";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  ArrowLeft,
  Calendar as CalendarIcon,
  Clock,
  User,
  FileText,
  CheckCircle,
  XCircle,
  AlertCircle,
  Loader2,
  Building2,
  RotateCcw,
} from "lucide-react";
import { LeaveStatus } from "@/types";
import { formatDate, getInitials } from "@/lib/utils";
import { leaveRequestApi } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";
import { Calendar } from "@/components/ui/calendar";
import { ApprovalModal } from "@/components/time-off/ApprovalModal";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

const getStatusIcon = (status: LeaveStatus) => {
  switch (status) {
    case "submitted":
      return <Clock className="h-5 w-5 text-orange-500" />;
    case "approved_lvl1":
      return <AlertCircle className="h-5 w-5 text-blue-500" />;
    case "approved_final":
      return <CheckCircle className="h-5 w-5 text-green-500" />;
    case "rejected":
      return <XCircle className="h-5 w-5 text-red-500" />;
    case "cancelled":
      return <XCircle className="h-5 w-5 text-gray-500" />;
    default:
      return <Clock className="h-5 w-5 text-gray-500" />;
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

export default function LeaveRequestDetailPage() {
  const router = useRouter();
  const params = useParams();
  const { user } = useAuth();
  const requestId = params.id as string;
  const [showApprovalModal, setShowApprovalModal] = useState(false);
  const [cancelOpen, setCancelOpen] = useState(false);
  const [isCancelling, setIsCancelling] = useState(false);
  const [isUndoing, setIsUndoing] = useState(false);

  // Fetch leave request details
  const {
    data: leaveRequest,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ["leaveRequest", requestId],
    queryFn: () =>
      leaveRequestApi.getById(
        requestId,
        localStorage.getItem("access_token") || undefined
      ),
    enabled: !!user && !!requestId,
  });

  // console.log("leaveRequest", leaveRequest);
  // console.log("user", user);

  const handleBack = () => {
    router.back();
  };

  const handleApproval = () => {
    setShowApprovalModal(true);
  };

  // Check if user can approve this request
  const canApprove = () => {
    if (!user || !leaveRequest) return false;

    // Only approvers and admins can approve
    if (user.role !== "approver" && user.role !== "admin") return false;

    // Can't approve own requests
    const requestUserId =
      leaveRequest.employeeId?._id ||
      leaveRequest.employeeId ||
      leaveRequest.employee?.userId;
    if (requestUserId === user.id) return false;

    // Only pending/submitted requests can be approved
    if (
      leaveRequest.status !== "submitted" &&
      leaveRequest.status !== "approved_lvl1"
    )
      return false;

    return true;
  };

  const canUndoFinal = () => {
    // console.log();
    if (!user || !leaveRequest) return false;
    return user.role === "admin" && leaveRequest.status === "approved_final";
  };

  // console.log(canUndoFinal());

  const handleUndoFinal = async () => {
    if (!leaveRequest) return;
    try {
      setIsUndoing(true);
      await leaveRequestApi.undoFinal(
        (leaveRequest as any)._id || (leaveRequest as any).id,
        localStorage.getItem("access_token") || undefined
      );
      await refetch();
    } catch (e) {
      console.error(e);
    } finally {
      setIsUndoing(false);
    }
  };

  const getApprovalButtonText = () => {
    if (leaveRequest?.status === "submitted") {
      return user?.role === "admin" ? "Level 1 Approve" : "Approve";
    } else if (leaveRequest?.status === "approved_lvl1") {
      return "Level 2 Approve";
    }
    return "Review";
  };

  const isOwner = () => {
    if (!user || !leaveRequest) return false;
    const empField = (leaveRequest as any).employeeId;
    const requestUserId =
      typeof empField === "string" ? empField : empField?._id;
    return requestUserId === user.id;
  };

  const handleCancel = () => {
    if (!leaveRequest || !isOwner()) return;
    setCancelOpen(true);
  };

  const handleConfirmCancel = async () => {
    if (!leaveRequest || !isOwner()) return;
    try {
      setIsCancelling(true);
      await leaveRequestApi.cancel(
        (leaveRequest as any)._id || (leaveRequest as any).id,
        localStorage.getItem("access_token") || undefined
      );
      setCancelOpen(false);
      router.push("/time-off");
    } catch (e) {
      console.error(e);
    } finally {
      setIsCancelling(false);
    }
  };

  if (isLoading) {
    return (
      <AppShell>
        <div className="flex items-center justify-center py-8">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <span className="ml-2 text-muted-foreground">
            Loading leave request details...
          </span>
        </div>
      </AppShell>
    );
  }

  if (error) {
    return (
      <AppShell>
        <div className="flex items-center justify-center py-8">
          <AlertCircle className="h-8 w-8 text-destructive mr-2" />
          <div className="text-center">
            <p className="text-destructive font-medium">
              Failed to load leave request details
            </p>
            <p className="text-sm text-muted-foreground mt-1">
              {error instanceof Error ? error.message : "An error occurred"}
            </p>
            <Button
              variant="outline"
              size="sm"
              onClick={() => refetch()}
              className="mt-2"
            >
              Try Again
            </Button>
          </div>
        </div>
      </AppShell>
    );
  }

  if (!leaveRequest) {
    return (
      <AppShell>
        <div className="text-center py-8">
          <p className="text-muted-foreground">Leave request not found.</p>
          <Button variant="outline" onClick={handleBack} className="mt-2">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Go Back
          </Button>
        </div>
      </AppShell>
    );
  }

  // Generate dates array for calendar
  const leaveDates = [];
  if (leaveRequest.startDate && leaveRequest.endDate) {
    const start = new Date(leaveRequest.startDate);
    const end = new Date(leaveRequest.endDate);
    for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
      leaveDates.push(d.toISOString().split("T")[0]);
    }
  }

  const employeeName =
    leaveRequest.employeeId?.name ||
    leaveRequest.employee?.name ||
    "Unknown Employee";

  return (
    <AppShell>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="sm" onClick={handleBack}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
            <div>
              <h1 className="text-3xl font-bold tracking-tight">
                Leave Request Details
              </h1>
              <p className="text-muted-foreground">
                Comprehensive leave request information
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              {getStatusIcon(leaveRequest.status)}
              <span
                className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(
                  leaveRequest.status
                )}`}
              >
                {leaveRequest.status.replace("_", " ")}
              </span>
            </div>

            {canApprove() && (
              <Button onClick={handleApproval}>
                <CheckCircle className="h-4 w-4 mr-2" />
                {getApprovalButtonText()}
              </Button>
            )}

            {canUndoFinal() && (
              <Button
                variant="outline"
                onClick={handleUndoFinal}
                disabled={isUndoing}
              >
                {isUndoing ? (
                  <span className="inline-flex items-center gap-2">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Undoing...
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-2">
                    <RotateCcw className="h-4 w-4" />
                    Undo Final Approval
                  </span>
                )}
              </Button>
            )}

            {isOwner() && (
              <Button variant="destructive" onClick={handleCancel}>
                <XCircle className="h-4 w-4 mr-2" />
                Cancel Leave
              </Button>
            )}
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {/* Employee Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <User className="h-5 w-5 mr-2" />
                Employee
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center space-x-3">
                <Avatar className="h-12 w-12">
                  <AvatarFallback>{getInitials(employeeName)}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium">{employeeName}</p>
                  <p className="text-sm text-muted-foreground">
                    {leaveRequest.employeeId?.department ||
                      leaveRequest.employee?.department ||
                      "No department"}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {leaveRequest.employeeId?.position ||
                      leaveRequest.employee?.position ||
                      "No position"}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Leave Details */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <CalendarIcon className="h-5 w-5 mr-2" />
                Leave Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm font-medium">Leave Type</p>
                <p className="text-sm text-muted-foreground">
                  {leaveRequest.leaveTypeId?.name ||
                    leaveRequest.leaveType?.name ||
                    "Unknown Type"}
                </p>
              </div>

              <div>
                <p className="text-sm font-medium">Duration</p>
                <p className="text-sm text-muted-foreground">
                  {formatDate(leaveRequest.startDate)} to{" "}
                  {formatDate(leaveRequest.endDate)}
                </p>
                <p className="text-xs text-muted-foreground">
                  {leaveRequest.totalDays || leaveRequest.days} working days
                </p>
              </div>

              <div>
                <p className="text-sm font-medium">Submitted</p>
                <p className="text-sm text-muted-foreground">
                  {formatDate(leaveRequest.createdAt)}
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Status & Approvals */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <CheckCircle className="h-5 w-5 mr-2" />
                Approval Status
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm font-medium">Current Status</p>
                <div className="flex items-center space-x-2 mt-1">
                  {getStatusIcon(leaveRequest.status)}
                  <span className="text-sm text-muted-foreground">
                    {leaveRequest.status.replace("_", " ")}
                  </span>
                </div>
              </div>

              {leaveRequest.level1ApprovalBy && (
                <div>
                  <p className="text-sm font-medium">Level 1 Approval</p>
                  <p className="text-sm text-muted-foreground">
                    Approved by {leaveRequest.level1ApprovalBy}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {formatDate(leaveRequest.level1ApprovalDate)}
                  </p>
                  {leaveRequest.level1ApprovalNotes && (
                    <p className="text-xs text-muted-foreground mt-1">
                      "{leaveRequest.level1ApprovalNotes}"
                    </p>
                  )}
                </div>
              )}

              {leaveRequest.level2ApprovalBy && (
                <div>
                  <p className="text-sm font-medium">Level 2 Approval</p>
                  <p className="text-sm text-muted-foreground">
                    Approved by {leaveRequest.level2ApprovalBy}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {formatDate(leaveRequest.level2ApprovalDate)}
                  </p>
                  {leaveRequest.level2ApprovalNotes && (
                    <p className="text-xs text-muted-foreground mt-1">
                      "{leaveRequest.level2ApprovalNotes}"
                    </p>
                  )}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Reason */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center">
                <FileText className="h-5 w-5 mr-2" />
                Reason
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                {leaveRequest.reason}
              </p>
            </CardContent>
          </Card>

          {/* Calendar View */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <CalendarIcon className="h-5 w-5 mr-2" />
                Leave Calendar
              </CardTitle>
              <CardDescription>
                Visual representation of requested leave days
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Calendar
                approvedDates={
                  leaveRequest.status === "approved_final" ? leaveDates : []
                }
                requestedDates={leaveDates}
              />
            </CardContent>
          </Card>
        </div>

        {/* Modals */}
        <ApprovalModal
          open={showApprovalModal}
          onOpenChange={setShowApprovalModal}
          leaveRequest={leaveRequest}
          userRole={user?.role || ""}
        />

        {/* Cancel Confirmation Modal */}
        <Dialog open={cancelOpen} onOpenChange={setCancelOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Cancel leave request?</DialogTitle>
              <DialogDescription>
                This will delete the leave request permanently. This action
                cannot be undone.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setCancelOpen(false)}
                disabled={isCancelling}
              >
                Keep Request
              </Button>
              <Button
                variant="destructive"
                onClick={handleConfirmCancel}
                disabled={isCancelling}
              >
                {isCancelling ? (
                  <span className="inline-flex items-center gap-2">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Cancelling...
                  </span>
                ) : (
                  "Cancel Request"
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </AppShell>
  );
}
