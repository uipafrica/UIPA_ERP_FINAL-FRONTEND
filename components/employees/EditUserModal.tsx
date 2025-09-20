"use client";

import React, { useState, useEffect } from "react";
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
import { userApi } from "@/lib/api";
import { toast } from "sonner";

interface EditUserModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  employee: any;
  userData: any;
}

interface UserFormData {
  email: string;
  role: "employee" | "approver" | "admin";
  attributes: {
    department?: string;
    employee_id?: string;
    approval_level?: string;
  };
}

export const EditUserModal: React.FC<EditUserModalProps> = ({
  open,
  onOpenChange,
  employee,
  userData,
}) => {
  const [formData, setFormData] = useState<UserFormData>({
    email: "",
    role: "employee",
    attributes: {},
  });
  const queryClient = useQueryClient();

  // Initialize form data when modal opens or userData changes
  useEffect(() => {
    if (userData && open) {
      setFormData({
        email: userData.email || "",
        role: userData.role || "employee",
        attributes: {
          department: userData.attributes?.department || "",
          employee_id: userData.attributes?.employee_id || "",
          approval_level: userData.attributes?.approval_level || "",
        },
      });
    }
  }, [userData, open]);

  const updateUserMutation = useMutation({
    mutationFn: (data: Partial<UserFormData>) =>
      userApi.updateByEmployeeId(
        employee._id || employee.id,
        data,
        localStorage.getItem("access_token") || undefined
      ),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["employee", employee._id || employee.id],
      });
      queryClient.invalidateQueries({
        queryKey: ["user", "employee", employee._id || employee.id],
      });
      toast.success("User information updated successfully");
      onOpenChange(false);
    },
    onError: (error: any) => {
      console.error("Failed to update user:", error);
      toast.error(error?.message || "Failed to update user information");
    },
  });

  const handleInputChange = (field: keyof UserFormData, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleAttributeChange = (
    field: keyof UserFormData["attributes"],
    value: string
  ) => {
    setFormData((prev) => ({
      ...prev,
      attributes: {
        ...prev.attributes,
        [field]: value || undefined, // Remove empty strings
      },
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Prepare data for submission (remove empty strings from attributes)
    const submitData = {
      email: formData.email,
      role: formData.role,
      attributes: Object.fromEntries(
        Object.entries(formData.attributes).filter(
          ([_, value]) => value && value.trim() !== ""
        )
      ),
    };

    updateUserMutation.mutate(submitData);
  };

  const handleClose = () => {
    if (!updateUserMutation.isPending) {
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Edit User Information</DialogTitle>
          <DialogDescription>
            Update user account details for {employee?.name}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid gap-4">
            <div>
              <Label htmlFor="email">Email *</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange("email", e.target.value)}
                required
                disabled={updateUserMutation.isPending}
              />
            </div>

            <div>
              <Label htmlFor="role">Role *</Label>
              <select
                id="role"
                value={formData.role}
                onChange={(e) =>
                  handleInputChange("role", e.target.value as any)
                }
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                disabled={updateUserMutation.isPending}
                required
              >
                <option value="employee">Employee</option>
                <option value="approver">Approver</option>
                <option value="admin">Admin</option>
              </select>
            </div>

            <div>
              <Label htmlFor="department">Department</Label>
              <Input
                id="department"
                type="text"
                value={formData.attributes.department || ""}
                onChange={(e) =>
                  handleAttributeChange("department", e.target.value)
                }
                disabled={updateUserMutation.isPending}
                placeholder="e.g., Engineering, HR, Finance"
              />
            </div>

            <div>
              <Label htmlFor="employee_id">Employee ID</Label>
              <Input
                id="employee_id"
                type="text"
                value={formData.attributes.employee_id || ""}
                onChange={(e) =>
                  handleAttributeChange("employee_id", e.target.value)
                }
                disabled={updateUserMutation.isPending}
                placeholder="e.g., EMP001"
              />
            </div>

            <div>
              <Label htmlFor="approval_level">Approval Level</Label>
              <select
                id="approval_level"
                value={formData.attributes.approval_level || ""}
                onChange={(e) =>
                  handleAttributeChange("approval_level", e.target.value)
                }
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                disabled={updateUserMutation.isPending}
              >
                <option value="">No approval level</option>
                <option value="level1">Level 1 (Supervisor)</option>
                <option value="level2">Level 2 (Manager)</option>
              </select>
              <p className="text-xs text-muted-foreground mt-1">
                Approval level determines what leave requests this user can
                approve
              </p>
            </div>
          </div>

          {updateUserMutation.error && (
            <div className="text-sm text-destructive">
              {updateUserMutation.error instanceof Error
                ? updateUserMutation.error.message
                : "Failed to update user information"}
            </div>
          )}

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={updateUserMutation.isPending}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={updateUserMutation.isPending}>
              {updateUserMutation.isPending && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              Update User
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
