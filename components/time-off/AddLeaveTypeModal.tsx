"use client";

import React, { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
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
import { Loader2 } from "lucide-react";
import { api } from "@/lib/api";

interface AddLeaveTypeModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

interface LeaveTypeFormData {
  name: string;
  description: string;
  maxDays: number;
  carryOver: boolean;
  // policy flags
  requiresDates: boolean;
  requiresBalance: boolean;
  allowFutureApplications: boolean;
  isOpenEndedAllowed: boolean;
  maxRetroactiveDays: number;
  requiresAttachment: boolean;
}

const initialFormData: LeaveTypeFormData = {
  name: "",
  description: "",
  maxDays: 0,
  carryOver: false,
  requiresDates: true,
  requiresBalance: true,
  allowFutureApplications: true,
  isOpenEndedAllowed: false,
  maxRetroactiveDays: 0,
  requiresAttachment: false,
};

export const AddLeaveTypeModal: React.FC<AddLeaveTypeModalProps> = ({
  open,
  onOpenChange,
}) => {
  const [formData, setFormData] = useState<LeaveTypeFormData>(initialFormData);
  const queryClient = useQueryClient();

  const createLeaveTypeMutation = useMutation({
    mutationFn: (data: any) =>
      api.post(
        "/time-off/leave-types",
        data,
        localStorage.getItem("access_token") || undefined
      ),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["leaveTypes"] });
      onOpenChange(false);
      setFormData(initialFormData);
    },
    onError: (error) => {
      console.error("Failed to create leave type:", error);
    },
  });

  const handleInputChange = (
    field: keyof LeaveTypeFormData,
    value: string | boolean | number
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const submitData = {
      name: formData.name,
      // Backend expects `defaultDays` (number)
      defaultDays: Number(formData.maxDays) || 0,
      // Optional fields per backend schema (send only if needed)
      // carryOverRules, maxConsecutiveDays, eligibility
      requiresApproval: true,
      // Policies
      requiresDates: formData.requiresDates,
      requiresBalance: formData.requiresBalance,
      allowFutureApplications: formData.allowFutureApplications,
      isOpenEndedAllowed: formData.isOpenEndedAllowed,
      maxRetroactiveDays: Number(formData.maxRetroactiveDays) || 0,
      requiresAttachment: formData.requiresAttachment,
    };

    createLeaveTypeMutation.mutate(submitData);
  };

  const handleClose = () => {
    if (!createLeaveTypeMutation.isPending) {
      onOpenChange(false);
      setFormData(initialFormData);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Add New Leave Type</DialogTitle>
          <DialogDescription>
            Create a new leave type for employees to use in their requests.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-4">
            <div>
              <Label htmlFor="name">Leave Type Name *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => handleInputChange("name", e.target.value)}
                required
                disabled={createLeaveTypeMutation.isPending}
                placeholder="e.g., Annual Leave, Sick Leave"
              />
            </div>

            <div>
              <Label htmlFor="maxDays">Default Days *</Label>
              <Input
                id="maxDays"
                type="number"
                value={formData.maxDays}
                onChange={(e) =>
                  handleInputChange("maxDays", parseInt(e.target.value || "0"))
                }
                disabled={createLeaveTypeMutation.isPending}
                placeholder="25"
                min="0"
              />
              <div className="mt-1 text-xs text-muted-foreground">
                Set to 0 for non-balance types (e.g., Sick Leave).
              </div>
            </div>

            {/* carryOver kept for UI but not sent unless you add carryOverRules semantics */}
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="carryOver"
                checked={formData.carryOver}
                onChange={(e) =>
                  handleInputChange("carryOver", e.target.checked)
                }
                disabled={createLeaveTypeMutation.isPending}
                className="h-4 w-4 rounded border border-input"
              />
              <Label htmlFor="carryOver" className="text-sm font-medium">
                Allow carry over to next year
              </Label>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="requiresDates"
                  checked={formData.requiresDates}
                  onChange={(e) =>
                    handleInputChange("requiresDates", e.target.checked)
                  }
                  disabled={createLeaveTypeMutation.isPending}
                  className="h-4 w-4 rounded border border-input"
                />
                <Label htmlFor="requiresDates" className="text-sm font-medium">
                  Requires date range
                </Label>
              </div>

              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="requiresBalance"
                  checked={formData.requiresBalance}
                  onChange={(e) =>
                    handleInputChange("requiresBalance", e.target.checked)
                  }
                  disabled={createLeaveTypeMutation.isPending}
                  className="h-4 w-4 rounded border border-input"
                />
                <Label
                  htmlFor="requiresBalance"
                  className="text-sm font-medium"
                >
                  Requires leave balance
                </Label>
              </div>

              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="allowFutureApplications"
                  checked={formData.allowFutureApplications}
                  onChange={(e) =>
                    handleInputChange(
                      "allowFutureApplications",
                      e.target.checked
                    )
                  }
                  disabled={createLeaveTypeMutation.isPending}
                  className="h-4 w-4 rounded border border-input"
                />
                <Label
                  htmlFor="allowFutureApplications"
                  className="text-sm font-medium"
                >
                  Allow future-dated requests
                </Label>
              </div>

              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="isOpenEndedAllowed"
                  checked={formData.isOpenEndedAllowed}
                  onChange={(e) =>
                    handleInputChange("isOpenEndedAllowed", e.target.checked)
                  }
                  disabled={createLeaveTypeMutation.isPending}
                  className="h-4 w-4 rounded border border-input"
                />
                <Label
                  htmlFor="isOpenEndedAllowed"
                  className="text-sm font-medium"
                >
                  Allow open-ended requests
                </Label>
              </div>
            </div>

            {!formData.requiresDates && (
              <div>
                <Label htmlFor="maxRetroactiveDays">Max retroactive days</Label>
                <Input
                  id="maxRetroactiveDays"
                  type="number"
                  min="0"
                  value={formData.maxRetroactiveDays}
                  onChange={(e) =>
                    handleInputChange(
                      "maxRetroactiveDays",
                      parseInt(e.target.value || "0")
                    )
                  }
                  disabled={createLeaveTypeMutation.isPending}
                  placeholder="e.g., 7"
                />
                <div className="mt-1 text-xs text-muted-foreground">
                  How many days back employees can report (e.g., Sick Leave).
                </div>
              </div>
            )}

            {!formData.requiresDates && (
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="requiresAttachment"
                  checked={formData.requiresAttachment}
                  onChange={(e) =>
                    handleInputChange("requiresAttachment", e.target.checked)
                  }
                  disabled={createLeaveTypeMutation.isPending}
                  className="h-4 w-4 rounded border border-input"
                />
                <Label
                  htmlFor="requiresAttachment"
                  className="text-sm font-medium"
                >
                  Requires attachment (e.g., doctor note)
                </Label>
              </div>
            )}
          </div>

          {createLeaveTypeMutation.error && (
            <div className="text-sm text-destructive">
              {createLeaveTypeMutation.error instanceof Error
                ? createLeaveTypeMutation.error.message
                : "Failed to create leave type"}
            </div>
          )}

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={createLeaveTypeMutation.isPending}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={createLeaveTypeMutation.isPending}>
              {createLeaveTypeMutation.isPending && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              Create Leave Type
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
