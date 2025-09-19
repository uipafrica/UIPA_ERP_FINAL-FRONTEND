"use client";

import React, { useState } from "react";
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

export interface EmployeeFilters {
  department: string;
  position: string;
  role: string;
  contractType: string;
}

interface FilterModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  filters: EmployeeFilters;
  onFiltersChange: (filters: EmployeeFilters) => void;
}

export const FilterModal: React.FC<FilterModalProps> = ({
  open,
  onOpenChange,
  filters,
  onFiltersChange,
}) => {
  const [localFilters, setLocalFilters] = useState<EmployeeFilters>(filters);

  const handleInputChange = (field: keyof EmployeeFilters, value: string) => {
    setLocalFilters((prev) => ({ ...prev, [field]: value }));
  };

  const handleApplyFilters = () => {
    onFiltersChange(localFilters);
    onOpenChange(false);
  };

  const handleClearFilters = () => {
    const emptyFilters = {
      department: "",
      position: "",
      role: "",
      contractType: "",
    };
    setLocalFilters(emptyFilters);
    onFiltersChange(emptyFilters);
    onOpenChange(false);
  };

  const handleClose = () => {
    setLocalFilters(filters); // Reset to original filters
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Filter Employees</DialogTitle>
          <DialogDescription>
            Filter employees by department, position, role, or contract type.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <Label htmlFor="filter-department">Department</Label>
              <Input
                id="filter-department"
                value={localFilters.department}
                onChange={(e) =>
                  handleInputChange("department", e.target.value)
                }
                placeholder="e.g., IT, HR, Finance"
              />
            </div>

            <div>
              <Label htmlFor="filter-position">Position</Label>
              <Input
                id="filter-position"
                value={localFilters.position}
                onChange={(e) => handleInputChange("position", e.target.value)}
                placeholder="e.g., Manager, Developer"
              />
            </div>

            <div>
              <Label htmlFor="filter-role">Role</Label>
              <select
                id="filter-role"
                value={localFilters.role}
                onChange={(e) => handleInputChange("role", e.target.value)}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <option value="">All Roles</option>
                <option value="employee">Employee</option>
                <option value="approver">Approver</option>
                <option value="admin">Admin</option>
              </select>
            </div>

            <div>
              <Label htmlFor="filter-contractType">Contract Type</Label>
              <select
                id="filter-contractType"
                value={localFilters.contractType}
                onChange={(e) =>
                  handleInputChange("contractType", e.target.value)
                }
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <option value="">All Contract Types</option>
                <option value="full_time">Full Time</option>
                <option value="part_time">Part Time</option>
                <option value="contract">Contract</option>
                <option value="internship">Internship</option>
              </select>
            </div>
          </div>
        </div>

        <DialogFooter className="flex-col sm:flex-row gap-2">
          <Button type="button" variant="outline" onClick={handleClearFilters}>
            Clear All Filters
          </Button>
          <div className="flex gap-2">
            <Button type="button" variant="outline" onClick={handleClose}>
              Cancel
            </Button>
            <Button type="button" onClick={handleApplyFilters}>
              Apply Filters
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
