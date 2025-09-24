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
import { employeeApi } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";

interface AddEmployeeModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

interface EmployeeFormData {
  email: string;
  password: string;
  name: string;
  phone: string;
  department: string;
  position: string;
  role: "employee" | "approver" | "admin";
  contractType: string;
  manager: string;
  // salary: number;
}

const initialFormData: EmployeeFormData = {
  email: "",
  password: "",
  name: "",
  phone: "",
  department: "",
  position: "",
  role: "employee",
  contractType: "full_time",
  manager: "",
  // salary: "0",
};

export const AddEmployeeModal: React.FC<AddEmployeeModalProps> = ({
  open,
  onOpenChange,
}) => {
  const [formData, setFormData] = useState<EmployeeFormData>(initialFormData);
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const createEmployeeMutation = useMutation({
    mutationFn: (data: any) =>
      employeeApi.createWithUser(
        data,
        localStorage.getItem("access_token") || undefined
      ),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["employees"] });
      onOpenChange(false);
      setFormData(initialFormData);
    },
    onError: (error) => {
      console.error("Failed to create employee:", error);
    },
  });

  const handleInputChange = (field: keyof EmployeeFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const submitData = {
      email: formData.email,
      password: formData.password,
      role: formData.role,
      name: formData.name,
      phone: formData.phone || undefined,
      department: formData.department,
      position: formData.position || undefined,
      contractType: formData.contractType || undefined,
      manager: formData.manager || undefined,
      // salary: formData.salary ? parseFloat(formData.salary) : 0,
      hireDate: new Date().toISOString(),
    };

    createEmployeeMutation.mutate(submitData);
  };

  const handleClose = () => {
    if (!createEmployeeMutation.isPending) {
      onOpenChange(false);
      setFormData(initialFormData);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add New Employee</DialogTitle>
          <DialogDescription>
            Create a new employee account with user credentials and employee
            details.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            {/* User Credentials */}
            <div className="sm:col-span-2">
              <h3 className="text-sm font-medium mb-3">User Credentials</h3>
            </div>

            <div>
              <Label htmlFor="email">Email *</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange("email", e.target.value)}
                required
                disabled={createEmployeeMutation.isPending}
              />
            </div>

            <div>
              <Label htmlFor="password">Password *</Label>
              <Input
                id="password"
                type="password"
                value={formData.password}
                onChange={(e) => handleInputChange("password", e.target.value)}
                required
                minLength={6}
                disabled={createEmployeeMutation.isPending}
              />
            </div>

            <div>
              <Label htmlFor="role">Role</Label>
              <select
                id="role"
                value={formData.role}
                onChange={(e) => handleInputChange("role", e.target.value)}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                disabled={createEmployeeMutation.isPending}
              >
                <option value="employee">Employee</option>
                <option value="approver">Approver</option>
                <option value="admin">Admin</option>
              </select>
            </div>

            {/* Employee Details */}
            <div className="sm:col-span-2">
              <h3 className="text-sm font-medium mb-3 mt-4">
                Employee Details
              </h3>
            </div>

            <div>
              <Label htmlFor="name">Full Name *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => handleInputChange("name", e.target.value)}
                required
                disabled={createEmployeeMutation.isPending}
              />
            </div>

            <div>
              <Label htmlFor="phone">Phone</Label>
              <Input
                id="phone"
                value={formData.phone}
                onChange={(e) => handleInputChange("phone", e.target.value)}
                disabled={createEmployeeMutation.isPending}
              />
            </div>

            <div>
              <Label htmlFor="department">Department *</Label>
              <Input
                id="department"
                value={formData.department}
                onChange={(e) =>
                  handleInputChange("department", e.target.value)
                }
                required
                disabled={createEmployeeMutation.isPending}
              />
            </div>

            <div>
              <Label htmlFor="position">Position</Label>
              <Input
                id="position"
                value={formData.position}
                onChange={(e) => handleInputChange("position", e.target.value)}
                disabled={createEmployeeMutation.isPending}
              />
            </div>

            <div>
              <Label htmlFor="contractType">Contract Type</Label>
              <select
                id="contractType"
                value={formData.contractType}
                onChange={(e) =>
                  handleInputChange("contractType", e.target.value)
                }
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                disabled={createEmployeeMutation.isPending}
              >
                <option value="full_time">Full Time</option>
                <option value="part_time">Part Time</option>
                <option value="contract">Contract</option>
                <option value="internship">Internship</option>
              </select>
            </div>

            <div>
              <Label htmlFor="manager">Manager</Label>
              <Input
                id="manager"
                value={formData.manager}
                onChange={(e) => handleInputChange("manager", e.target.value)}
                disabled={createEmployeeMutation.isPending}
              />
            </div>

            {/* <div>
              <Label htmlFor="salary">Salary</Label>
              <Input
                id="salary"
                type="number"
                value={formData.salary}
                onChange={(e) => handleInputChange("salary", e.target.value)}
                disabled={createEmployeeMutation.isPending}
                placeholder="0.00"
                step="0.01"
              />
            </div> */}
          </div>

          {createEmployeeMutation.error && (
            <div className="text-sm text-destructive">
              {createEmployeeMutation.error instanceof Error
                ? createEmployeeMutation.error.message
                : "Failed to create employee"}
            </div>
          )}

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={createEmployeeMutation.isPending}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={createEmployeeMutation.isPending}>
              {createEmployeeMutation.isPending && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              Create Employee
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
