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
import { Contact } from "@/types";
import { contactApi } from "@/lib/api";

interface DeleteContactConfirmationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  contact: Contact | null;
  onDeleted?: () => void;
}

export const DeleteContactConfirmationDialog: React.FC<
  DeleteContactConfirmationDialogProps
> = ({ open, onOpenChange, contact, onDeleted }) => {
  const queryClient = useQueryClient();

  const deleteContactMutation = useMutation({
    mutationFn: () =>
      contactApi.delete(
        contact?._id || contact?.id || "",
        localStorage.getItem("access_token") || undefined
      ),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["contacts"] });
      onOpenChange(false);
      if (onDeleted) {
        onDeleted();
      }
    },
    onError: (error) => {
      console.error("Failed to delete contact:", error);
    },
  });

  const handleDelete = () => {
    if (contact) {
      deleteContactMutation.mutate();
    }
  };

  const handleClose = () => {
    if (!deleteContactMutation.isPending) {
      onOpenChange(false);
    }
  };

  if (!contact) return null;

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <div className="flex items-center space-x-2">
            <AlertTriangle className="h-5 w-5 text-destructive" />
            <DialogTitle>Delete Contact</DialogTitle>
          </div>
          <DialogDescription>
            Are you sure you want to delete <strong>{contact.name}</strong>?
            This action cannot be undone and will permanently remove the contact
            from the system.
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
                <li>Contact profile and details</li>
                <li>All contact information and notes</li>
                <li>Contact history and records</li>
              </ul>
            </div>
          </div>
        </div>

        {deleteContactMutation.error && (
          <div className="text-sm text-destructive">
            {deleteContactMutation.error instanceof Error
              ? deleteContactMutation.error.message
              : "Failed to delete contact"}
          </div>
        )}

        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={handleClose}
            disabled={deleteContactMutation.isPending}
          >
            Cancel
          </Button>
          <Button
            type="button"
            variant="destructive"
            onClick={handleDelete}
            disabled={deleteContactMutation.isPending}
          >
            {deleteContactMutation.isPending && (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            )}
            Delete Contact
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
