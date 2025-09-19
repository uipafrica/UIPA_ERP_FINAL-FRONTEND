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
import { ContactCategory } from "@/types";
import { contactApi } from "@/lib/api";

interface AddContactModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
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

const initialFormData: ContactFormData = {
  name: "",
  email: "",
  phone: "",
  category: "customer",
  companyName: "",
  position: "",
  notes: "",
};

export const AddContactModal: React.FC<AddContactModalProps> = ({
  open,
  onOpenChange,
}) => {
  const [formData, setFormData] = useState<ContactFormData>(initialFormData);
  const queryClient = useQueryClient();

  const createContactMutation = useMutation({
    mutationFn: (data: any) =>
      contactApi.create(
        data,
        localStorage.getItem("access_token") || undefined
      ),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["contacts"] });
      onOpenChange(false);
      setFormData(initialFormData);
    },
    onError: (error) => {
      console.error("Failed to create contact:", error);
    },
  });

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

    createContactMutation.mutate(submitData);
  };

  const handleClose = () => {
    if (!createContactMutation.isPending) {
      onOpenChange(false);
      setFormData(initialFormData);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add New Contact</DialogTitle>
          <DialogDescription>
            Create a new contact for your business directory.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <Label htmlFor="name">Contact Name *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => handleInputChange("name", e.target.value)}
                required
                disabled={createContactMutation.isPending}
                placeholder="John Doe or Company Name"
              />
            </div>

            <div>
              <Label htmlFor="category">Category *</Label>
              <select
                id="category"
                value={formData.category}
                onChange={(e) =>
                  handleInputChange(
                    "category",
                    e.target.value as ContactCategory
                  )
                }
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                disabled={createContactMutation.isPending}
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
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange("email", e.target.value)}
                disabled={createContactMutation.isPending}
                placeholder="contact@example.com"
              />
            </div>

            <div>
              <Label htmlFor="phone">Phone</Label>
              <Input
                id="phone"
                value={formData.phone}
                onChange={(e) => handleInputChange("phone", e.target.value)}
                disabled={createContactMutation.isPending}
                placeholder="+1-555-0123"
              />
            </div>

            <div>
              <Label htmlFor="companyName">Company Name</Label>
              <Input
                id="companyName"
                value={formData.companyName}
                onChange={(e) =>
                  handleInputChange("companyName", e.target.value)
                }
                disabled={createContactMutation.isPending}
                placeholder="Company Inc."
              />
            </div>

            <div>
              <Label htmlFor="position">Position</Label>
              <Input
                id="position"
                value={formData.position}
                onChange={(e) => handleInputChange("position", e.target.value)}
                disabled={createContactMutation.isPending}
                placeholder="Sales Manager"
              />
            </div>

            <div className="sm:col-span-2">
              <Label htmlFor="notes">Notes</Label>
              <textarea
                id="notes"
                value={formData.notes}
                onChange={(e) => handleInputChange("notes", e.target.value)}
                disabled={createContactMutation.isPending}
                placeholder="Additional notes about this contact..."
                rows={3}
                className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 resize-none"
              />
            </div>
          </div>

          {createContactMutation.error && (
            <div className="text-sm text-destructive">
              {createContactMutation.error instanceof Error
                ? createContactMutation.error.message
                : "Failed to create contact"}
            </div>
          )}

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={createContactMutation.isPending}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={createContactMutation.isPending}>
              {createContactMutation.isPending && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              Create Contact
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
