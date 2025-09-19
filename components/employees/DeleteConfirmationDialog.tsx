"use client";

import React from "react";
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
import { Loader2, AlertTriangle } from "lucide-react";
import { Employee } from "@/types";
import { employeeApi } from "@/lib/api";

interface DeleteConfirmationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  employee: Employee | null;
  onDeleted?: () => void;
}

export const DeleteConfirmationDialog: React.FC<
  DeleteConfirmationDialogProps
> = ({ open, onOpenChange, employee, onDeleted }) => {
  const queryClient = useQueryClient();

  const deleteEmployeeMutation = useMutation({
    mutationFn: () =>
      employeeApi.delete(
        employee?._id || employee?.id || "",
        localStorage.getItem("access_token") || undefined
      ),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["employees"] });
      onOpenChange(false);
      if (onDeleted) {
        onDeleted();
      }
    },
    onError: (error) => {
      console.error("Failed to delete employee:", error);
    },
  });

  const handleDelete = () => {
    if (employee) {
      deleteEmployeeMutation.mutate();
    }
  };

  const handleClose = () => {
    if (!deleteEmployeeMutation.isPending) {
      onOpenChange(false);
    }
  };

  if (!employee) return null;

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <div className="flex items-center space-x-2">
            <AlertTriangle className="h-5 w-5 text-destructive" />
            <DialogTitle>Delete Employee</DialogTitle>
          </div>
          <DialogDescription>
            Are you sure you want to delete <strong>{employee.name}</strong>?
            This action cannot be undone and will permanently remove the
            employee from the system.
          </DialogDescription>
        </DialogHeader>

        <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-4">
          <div className="flex items-start space-x-3">
            <AlertTriangle className="h-5 w-5 text-destructive mt-0.5 flex-shrink-0" />
            <div className="text-sm">
              <p className="font-medium text-destructive">Warning</p>
              <p className="text-muted-foreground mt-1">
                This will permanently delete:
              </p>
              <ul className="list-disc list-inside mt-2 text-muted-foreground space-y-1">
                <li>Employee profile and details</li>
                <li>Associated user account</li>
                <li>All related records and history</li>
              </ul>
            </div>
          </div>
        </div>

        {deleteEmployeeMutation.error && (
          <div className="text-sm text-destructive">
            {deleteEmployeeMutation.error instanceof Error
              ? deleteEmployeeMutation.error.message
              : "Failed to delete employee"}
          </div>
        )}

        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={handleClose}
            disabled={deleteEmployeeMutation.isPending}
          >
            Cancel
          </Button>
          <Button
            type="button"
            variant="destructive"
            onClick={handleDelete}
            disabled={deleteEmployeeMutation.isPending}
          >
            {deleteEmployeeMutation.isPending && (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            )}
            Delete Employee
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
