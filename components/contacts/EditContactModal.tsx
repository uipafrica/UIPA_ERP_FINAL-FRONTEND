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
import { Contact, ContactCategory } from "@/types";
import { contactApi } from "@/lib/api";

interface EditContactModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  contact: Contact | null;
}

interface ContactFormData {
  name: string;
  email: string;
  phone: string;
  category: ContactCategory;
  companyName: string;
  position: string;
  notes: string;
}

export const EditContactModal: React.FC<EditContactModalProps> = ({
  open,
  onOpenChange,
  contact,
}) => {
  const [formData, setFormData] = useState<ContactFormData>({
    name: "",
    email: "",
    phone: "",
    category: "customer",
    companyName: "",
    position: "",
    notes: "",
  });

  const queryClient = useQueryClient();

  const updateContactMutation = useMutation({
    mutationFn: (data: any) =>
      contactApi.update(
        contact?._id || "",
        data,
        localStorage.getItem("access_token") || undefined
      ),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["contacts"] });
      queryClient.invalidateQueries({ queryKey: ["contact", contact?._id] });
      onOpenChange(false);
    },
    onError: (error) => {
      console.error("Failed to update contact:", error);
    },
  });

  // Update form data when contact changes
  useEffect(() => {
    if (contact) {
      setFormData({
        name: contact.name || "",
        email: contact.email || "",
        phone: contact.phone || "",
        category: contact.category || "customer",
        companyName: contact.companyName || "",
        position: contact.position || "",
        notes: contact.notes || "",
      });
    }
  }, [contact]);

  const handleInputChange = (field: keyof ContactFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const submitData = {
      name: formData.name,
      email: formData.email || undefined,
      phone: formData.phone || undefined,
      category: formData.category,
      companyName: formData.companyName || undefined,
      position: formData.position || undefined,
      notes: formData.notes || undefined,
    };

    updateContactMutation.mutate(submitData);
  };

  const handleClose = () => {
    if (!updateContactMutation.isPending) {
      onOpenChange(false);
    }
  };

  if (!contact) return null;

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Contact</DialogTitle>
          <DialogDescription>
            Update contact information and details.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <Label htmlFor="edit-name">Contact Name *</Label>
              <Input
                id="edit-name"
                value={formData.name}
                onChange={(e) => handleInputChange("name", e.target.value)}
                required
                disabled={updateContactMutation.isPending}
                placeholder="John Doe or Company Name"
              />
            </div>

            <div>
              <Label htmlFor="edit-category">Category *</Label>
              <select
                id="edit-category"
                value={formData.category}
                onChange={(e) =>
                  handleInputChange(
                    "category",
                    e.target.value as ContactCategory
                  )
                }
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                disabled={updateContactMutation.isPending}
                required
              >
                <option value="customer">Customer</option>
                <option value="supplier">Supplier</option>
                <option value="service provider">Service Provider</option>
                <option value="internal">Internal</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div>
              <Label htmlFor="edit-email">Email</Label>
              <Input
                id="edit-email"
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange("email", e.target.value)}
                disabled={updateContactMutation.isPending}
                placeholder="contact@example.com"
              />
            </div>

            <div>
              <Label htmlFor="edit-phone">Phone</Label>
              <Input
                id="edit-phone"
                value={formData.phone}
                onChange={(e) => handleInputChange("phone", e.target.value)}
                disabled={updateContactMutation.isPending}
                placeholder="+1-555-0123"
              />
            </div>

            <div>
              <Label htmlFor="edit-companyName">Company Name</Label>
              <Input
                id="edit-companyName"
                value={formData.companyName}
                onChange={(e) =>
                  handleInputChange("companyName", e.target.value)
                }
                disabled={updateContactMutation.isPending}
                placeholder="Company Inc."
              />
            </div>

            <div>
              <Label htmlFor="edit-position">Position</Label>
              <Input
                id="edit-position"
                value={formData.position}
                onChange={(e) => handleInputChange("position", e.target.value)}
                disabled={updateContactMutation.isPending}
                placeholder="Sales Manager"
              />
            </div>

            <div className="sm:col-span-2">
              <Label htmlFor="edit-notes">Notes</Label>
              <textarea
                id="edit-notes"
                value={formData.notes}
                onChange={(e) => handleInputChange("notes", e.target.value)}
                disabled={updateContactMutation.isPending}
                placeholder="Additional notes about this contact..."
                rows={3}
                className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 resize-none"
              />
            </div>
          </div>

          {updateContactMutation.error && (
            <div className="text-sm text-destructive">
              {updateContactMutation.error instanceof Error
                ? updateContactMutation.error.message
                : "Failed to update contact"}
            </div>
          )}

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={updateContactMutation.isPending}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={updateContactMutation.isPending}>
              {updateContactMutation.isPending && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              Update Contact
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
