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
import { Employee } from "@/types";
import { employeeApi } from "@/lib/api";

interface EditEmployeeModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  employee: Employee | null;
}

interface EmployeeFormData {
  name: string;
  email: string;
  phone: string;
  department: string;
  position: string;
  contractType: string;
  manager: string;
  salary: string;
}

export const EditEmployeeModal: React.FC<EditEmployeeModalProps> = ({
  open,
  onOpenChange,
  employee,
}) => {
  const [formData, setFormData] = useState<EmployeeFormData>({
    name: "",
    email: "",
    phone: "",
    department: "",
    position: "",
    contractType: "",
    manager: "",
    salary: "",
  });

  const queryClient = useQueryClient();

  const updateEmployeeMutation = useMutation({
    mutationFn: (data: any) =>
      employeeApi.update(
        employee?._id || employee?.id || "",
        data,
        localStorage.getItem("access_token") || undefined
      ),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["employees"] });
      queryClient.invalidateQueries({
        queryKey: ["employee", employee?._id || employee?.id],
      });
      onOpenChange(false);
    },
    onError: (error) => {
      console.error("Failed to update employee:", error);
    },
  });

  // Update form data when employee changes
  useEffect(() => {
    if (employee) {
      setFormData({
        name: employee.name || "",
        email: employee.email || "",
        phone: employee.phone || "",
        department: employee.department || "",
        position: employee.position || "",
        contractType: employee.contractType || "",
        manager: employee.manager || "",
        salary: employee.salary ? employee.salary.toString() : "",
      });
    }
  }, [employee]);

  const handleInputChange = (field: keyof EmployeeFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const submitData = {
      name: formData.name,
      email: formData.email,
      phone: formData.phone || undefined,
      department: formData.department,
      position: formData.position || undefined,
      contractType: formData.contractType || undefined,
      manager: formData.manager || undefined,
      salary: formData.salary ? parseFloat(formData.salary) : undefined,
    };

    updateEmployeeMutation.mutate(submitData);
  };

  const handleClose = () => {
    if (!updateEmployeeMutation.isPending) {
      onOpenChange(false);
    }
  };

  if (!employee) return null;

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Employee</DialogTitle>
          <DialogDescription>
            Update employee information and details.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <Label htmlFor="edit-name">Full Name *</Label>
              <Input
                id="edit-name"
                value={formData.name}
                onChange={(e) => handleInputChange("name", e.target.value)}
                required
                disabled={updateEmployeeMutation.isPending}
              />
            </div>

            <div>
              <Label htmlFor="edit-email">Email *</Label>
              <Input
                id="edit-email"
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange("email", e.target.value)}
                required
                disabled={updateEmployeeMutation.isPending}
              />
            </div>

            <div>
              <Label htmlFor="edit-phone">Phone</Label>
              <Input
                id="edit-phone"
                value={formData.phone}
                onChange={(e) => handleInputChange("phone", e.target.value)}
                disabled={updateEmployeeMutation.isPending}
              />
            </div>

            <div>
              <Label htmlFor="edit-department">Department *</Label>
              <Input
                id="edit-department"
                value={formData.department}
                onChange={(e) =>
                  handleInputChange("department", e.target.value)
                }
                required
                disabled={updateEmployeeMutation.isPending}
              />
            </div>

            <div>
              <Label htmlFor="edit-position">Position</Label>
              <Input
                id="edit-position"
                value={formData.position}
                onChange={(e) => handleInputChange("position", e.target.value)}
                disabled={updateEmployeeMutation.isPending}
              />
            </div>

            <div>
              <Label htmlFor="edit-contractType">Contract Type</Label>
              <select
                id="edit-contractType"
                value={formData.contractType}
                onChange={(e) =>
                  handleInputChange("contractType", e.target.value)
                }
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                disabled={updateEmployeeMutation.isPending}
              >
                <option value="">Select contract type</option>
                <option value="full_time">Full Time</option>
                <option value="part_time">Part Time</option>
                <option value="contract">Contract</option>
                <option value="internship">Internship</option>
              </select>
            </div>

            <div>
              <Label htmlFor="edit-manager">Manager</Label>
              <Input
                id="edit-manager"
                value={formData.manager}
                onChange={(e) => handleInputChange("manager", e.target.value)}
                disabled={updateEmployeeMutation.isPending}
              />
            </div>

            <div>
              <Label htmlFor="edit-salary">Salary</Label>
              <Input
                id="edit-salary"
                type="number"
                value={formData.salary}
                onChange={(e) => handleInputChange("salary", e.target.value)}
                disabled={updateEmployeeMutation.isPending}
                placeholder="0.00"
                step="0.01"
              />
            </div>
          </div>

          {updateEmployeeMutation.error && (
            <div className="text-sm text-destructive">
              {updateEmployeeMutation.error instanceof Error
                ? updateEmployeeMutation.error.message
                : "Failed to update employee"}
            </div>
          )}

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={updateEmployeeMutation.isPending}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={updateEmployeeMutation.isPending}>
              {updateEmployeeMutation.isPending && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              Update Employee
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
