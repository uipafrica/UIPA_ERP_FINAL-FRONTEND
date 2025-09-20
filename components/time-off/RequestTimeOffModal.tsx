"use client";

import React, { useState } from "react";
import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, Calendar } from "lucide-react";
import { leaveRequestApi, leaveTypeApi } from "@/lib/api";
import { SupervisorSelector } from "./SupervisorSelector";

interface RequestTimeOffModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

interface LeaveRequestFormData {
  leaveTypeId: string;
  startDate: string;
  endDate: string;
  reason: string;
  supervisorId: string;
}

const initialFormData: LeaveRequestFormData = {
  leaveTypeId: "",
  startDate: "",
  endDate: "",
  reason: "",
  supervisorId: "",
};

export const RequestTimeOffModal: React.FC<RequestTimeOffModalProps> = ({
  open,
  onOpenChange,
}) => {
  const [formData, setFormData] =
    useState<LeaveRequestFormData>(initialFormData);
  const queryClient = useQueryClient();

  // Fetch leave types for dropdown
  const { data: leaveTypes = [], isLoading: typesLoading } = useQuery({
    queryKey: ["leaveTypes"],
    queryFn: () =>
      leaveTypeApi.getAll(localStorage.getItem("access_token") || undefined),
    enabled: open, // Only fetch when modal is open
  });

  const createLeaveRequestMutation = useMutation({
    mutationFn: (data: any) =>
      leaveRequestApi.create(
        data,
        localStorage.getItem("access_token") || undefined
      ),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["leaveRequests"] });
      queryClient.invalidateQueries({ queryKey: ["leaveBalances"] });
      onOpenChange(false);
      setFormData(initialFormData);
    },
    onError: (error) => {
      console.error("Failed to create leave request:", error);
    },
  });

  const handleInputChange = (
    field: keyof LeaveRequestFormData,
    value: string | undefined
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSupervisorChange = (supervisorId: string | undefined) => {
    setFormData((prev) => ({ ...prev, supervisorId: supervisorId || "" }));
  };

  const calculateDays = (): number => {
    if (!formData.startDate || !formData.endDate) return 0;

    const start = new Date(formData.startDate);
    const end = new Date(formData.endDate);

    if (start > end) return 0;

    // Calculate working days (excluding weekends)
    let count = 0;
    const current = new Date(start);

    while (current <= end) {
      const dayOfWeek = current.getDay();
      if (dayOfWeek !== 0 && dayOfWeek !== 6) {
        // Not Sunday or Saturday
        count++;
      }
      current.setDate(current.getDate() + 1);
    }

    return count;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const submitData = {
      leaveTypeId: formData.leaveTypeId,
      startDate: formData.startDate,
      endDate: formData.endDate,
      reason: formData.reason,
      supervisorId: formData.supervisorId,
    };

    createLeaveRequestMutation.mutate(submitData);
  };

  const handleClose = () => {
    if (!createLeaveRequestMutation.isPending) {
      onOpenChange(false);
      setFormData(initialFormData);
    }
  };

  const totalDays = calculateDays();
  const isValidDateRange =
    formData.startDate &&
    formData.endDate &&
    new Date(formData.startDate) <= new Date(formData.endDate);

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Request Time Off</DialogTitle>
          <DialogDescription>
            Submit a new leave request for approval.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <Label htmlFor="leaveTypeId">Leave Type *</Label>
              {typesLoading ? (
                <div className="flex items-center space-x-2 h-10 px-3 py-2 border rounded-md">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span className="text-sm text-muted-foreground">
                    Loading leave types...
                  </span>
                </div>
              ) : (
                <select
                  id="leaveTypeId"
                  value={formData.leaveTypeId}
                  onChange={(e) =>
                    handleInputChange("leaveTypeId", e.target.value)
                  }
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  disabled={createLeaveRequestMutation.isPending}
                  required
                >
                  <option value="">Select leave type</option>
                  {leaveTypes.map((type: any) => (
                    <option
                      key={type._id || type.id}
                      value={type._id || type.id}
                    >
                      {type.name} ({type.maxDays} days max)
                    </option>
                  ))}
                </select>
              )}
            </div>

            <div>
              <Label htmlFor="startDate">Start Date *</Label>
              <Input
                id="startDate"
                type="date"
                value={formData.startDate}
                onChange={(e) => handleInputChange("startDate", e.target.value)}
                required
                disabled={createLeaveRequestMutation.isPending}
                min={new Date().toISOString().split("T")[0]} // Can't select past dates
              />
            </div>

            <div>
              <Label htmlFor="endDate">End Date *</Label>
              <Input
                id="endDate"
                type="date"
                value={formData.endDate}
                onChange={(e) => handleInputChange("endDate", e.target.value)}
                required
                disabled={createLeaveRequestMutation.isPending}
                min={
                  formData.startDate || new Date().toISOString().split("T")[0]
                }
              />
            </div>

            {/* Days calculation display */}
            {isValidDateRange && (
              <div className="sm:col-span-2">
                <div className="flex items-center space-x-2 p-3 bg-muted rounded-md">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">
                    <strong>{totalDays}</strong> working days requested
                    {totalDays > 0 && (
                      <span className="text-muted-foreground ml-1">
                        (excluding weekends)
                      </span>
                    )}
                  </span>
                </div>
              </div>
            )}

            <div className="sm:col-span-2">
              <Label>Supervisor</Label>
              <SupervisorSelector
                value={formData.supervisorId}
                onChange={handleSupervisorChange}
                disabled={createLeaveRequestMutation.isPending}
              />
              <div className="mt-1 text-xs text-muted-foreground">
                Select a supervisor to approve your request. If not selected,
                your direct manager will be used.
              </div>
            </div>

            <div className="sm:col-span-2">
              <Label htmlFor="reason">Reason *</Label>
              <textarea
                id="reason"
                value={formData.reason}
                onChange={(e) => handleInputChange("reason", e.target.value)}
                disabled={createLeaveRequestMutation.isPending}
                placeholder="Please provide a reason for your leave request..."
                rows={4}
                className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 resize-none"
                required
              />
            </div>
          </div>

          {createLeaveRequestMutation.error && (
            <div className="text-sm text-destructive">
              {createLeaveRequestMutation.error instanceof Error
                ? createLeaveRequestMutation.error.message
                : "Failed to create leave request"}
            </div>
          )}

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={createLeaveRequestMutation.isPending}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={
                createLeaveRequestMutation.isPending ||
                !isValidDateRange ||
                totalDays === 0
              }
            >
              {createLeaveRequestMutation.isPending && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              Submit Request
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
