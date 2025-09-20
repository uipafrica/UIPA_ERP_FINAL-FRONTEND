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
import { employeeApi } from "@/lib/api";
import { toast } from "sonner";

interface DeleteDocumentModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  employee: any;
  documentType: "idCard" | "resume" | "contract" | "certificate";
  documentIndex?: number;
  documentName?: string;
}

const DOCUMENT_TYPE_LABELS = {
  idCard: "ID Card",
  resume: "Resume",
  contract: "Contract",
  certificate: "Certificate",
};

export const DeleteDocumentModal: React.FC<DeleteDocumentModalProps> = ({
  open,
  onOpenChange,
  employee,
  documentType,
  documentIndex,
  documentName,
}) => {
  const queryClient = useQueryClient();

  const deleteDocumentMutation = useMutation({
    mutationFn: () =>
      employeeApi.deleteDocument(
        employee._id || employee.id,
        documentType,
        documentIndex,
        localStorage.getItem("access_token") || undefined
      ),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["employee", employee._id || employee.id],
      });
      toast.success(
        `${DOCUMENT_TYPE_LABELS[documentType]} deleted successfully`
      );
      onOpenChange(false);
    },
    onError: (error: any) => {
      console.error("Failed to delete document:", error);
      toast.error(error?.message || "Failed to delete document");
    },
  });

  const handleDelete = () => {
    deleteDocumentMutation.mutate();
  };

  const handleClose = () => {
    if (!deleteDocumentMutation.isPending) {
      onOpenChange(false);
    }
  };

  const getDocumentDisplayName = () => {
    if (documentName) {
      return documentName;
    }
    return DOCUMENT_TYPE_LABELS[documentType];
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[400px]">
        <DialogHeader>
          <div className="flex items-center space-x-2">
            <AlertTriangle className="h-5 w-5 text-destructive" />
            <DialogTitle>Delete Document</DialogTitle>
          </div>
          <DialogDescription>
            Are you sure you want to delete the {getDocumentDisplayName()} for{" "}
            {employee?.name}? This action cannot be undone.
          </DialogDescription>
        </DialogHeader>

        <div className="py-4">
          <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-3">
            <p className="text-sm text-destructive">
              <strong>Warning:</strong> This will permanently delete the
              document file from the server.
            </p>
          </div>
        </div>

        {deleteDocumentMutation.error && (
          <div className="text-sm text-destructive">
            {deleteDocumentMutation.error instanceof Error
              ? deleteDocumentMutation.error.message
              : "Failed to delete document"}
          </div>
        )}

        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={handleClose}
            disabled={deleteDocumentMutation.isPending}
          >
            Cancel
          </Button>
          <Button
            type="button"
            variant="destructive"
            onClick={handleDelete}
            disabled={deleteDocumentMutation.isPending}
          >
            {deleteDocumentMutation.isPending && (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            )}
            Delete Document
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
