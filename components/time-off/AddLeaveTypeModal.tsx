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
  maxDays: string;
  carryOver: boolean;
}

const initialFormData: LeaveTypeFormData = {
  name: "",
  description: "",
  maxDays: "",
  carryOver: false,
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
    value: string | boolean
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const submitData = {
      name: formData.name,
      description: formData.description || undefined,
      maxDays: parseInt(formData.maxDays),
      carryOver: formData.carryOver,
      isActive: true,
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
              <Label htmlFor="description">Description</Label>
              <textarea
                id="description"
                value={formData.description}
                onChange={(e) =>
                  handleInputChange("description", e.target.value)
                }
                disabled={createLeaveTypeMutation.isPending}
                placeholder="Optional description of this leave type..."
                rows={3}
                className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 resize-none"
              />
            </div>

            <div>
              <Label htmlFor="maxDays">Maximum Days *</Label>
              <Input
                id="maxDays"
                type="number"
                value={formData.maxDays}
                onChange={(e) => handleInputChange("maxDays", e.target.value)}
                required
                disabled={createLeaveTypeMutation.isPending}
                placeholder="25"
                min="1"
              />
            </div>

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
