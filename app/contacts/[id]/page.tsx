"use client";

import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useRouter, useParams } from "next/navigation";
import { AppShell } from "@/components/layout/AppShell";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  ArrowLeft,
  Mail,
  Phone,
  Building2,
  Tag,
  User,
  Calendar,
  Edit,
  Loader2,
  AlertCircle,
  Trash2,
} from "lucide-react";
import { Contact, ContactCategory } from "@/types";
import { getInitials } from "@/lib/utils";
import { contactApi } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";
import { EditContactModal } from "@/components/contacts/EditContactModal";
import { DeleteContactConfirmationDialog } from "@/components/contacts/DeleteContactConfirmationDialog";

const getCategoryColor = (category: ContactCategory): string => {
  switch (category) {
    case "customer":
      return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300";
    case "supplier":
      return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300";
    case "service provider":
      return "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300";
    case "internal":
      return "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300";
    default:
      return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300";
  }
};

export default function ContactDetailPage() {
  const router = useRouter();
  const params = useParams();
  const { user } = useAuth();
  const contactId = params.id as string;
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  // Fetch contact details
  const {
    data: contact,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ["contact", contactId],
    queryFn: () =>
      contactApi.getById(
        contactId,
        localStorage.getItem("access_token") || undefined
      ),
    enabled: !!user && !!contactId,
  });

  const handleBack = () => {
    router.back();
  };

  const handleEdit = () => {
    setShowEditModal(true);
  };

  const handleDelete = () => {
    setShowDeleteDialog(true);
  };

  const handleDeleteSuccess = () => {
    router.push("/contacts");
  };

  const isAdmin = user?.role === "admin";

  if (isLoading) {
    return (
      <AppShell>
        <div className="flex items-center justify-center py-8">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <span className="ml-2 text-muted-foreground">
            Loading contact details...
          </span>
        </div>
      </AppShell>
    );
  }

  if (error) {
    return (
      <AppShell>
        <div className="flex items-center justify-center py-8">
          <AlertCircle className="h-8 w-8 text-destructive mr-2" />
          <div className="text-center">
            <p className="text-destructive font-medium">
              Failed to load contact details
            </p>
            <p className="text-sm text-muted-foreground mt-1">
              {error instanceof Error ? error.message : "An error occurred"}
            </p>
            <Button
              variant="outline"
              size="sm"
              onClick={() => refetch()}
              className="mt-2"
            >
              Try Again
            </Button>
          </div>
        </div>
      </AppShell>
    );
  }

  if (!contact) {
    return (
      <AppShell>
        <div className="text-center py-8">
          <p className="text-muted-foreground">Contact not found.</p>
          <Button variant="outline" onClick={handleBack} className="mt-2">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Go Back
          </Button>
        </div>
      </AppShell>
    );
  }

  return (
    <AppShell>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="sm" onClick={handleBack}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
            <div>
              <h1 className="text-3xl font-bold tracking-tight">
                Contact Details
              </h1>
              <p className="text-muted-foreground">
                View and manage contact information
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Button onClick={handleEdit}>
              <Edit className="h-4 w-4 mr-2" />
              Edit Contact
            </Button>
            {isAdmin && (
              <Button variant="destructive" onClick={handleDelete}>
                <Trash2 className="h-4 w-4 mr-2" />
                Delete Contact
              </Button>
            )}
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {/* Profile Card */}
          <Card className="md:col-span-1">
            <CardHeader className="text-center">
              <Avatar className="h-24 w-24 mx-auto mb-4">
                <AvatarFallback className="text-xl">
                  {getInitials(contact.name)}
                </AvatarFallback>
              </Avatar>
              <CardTitle className="text-xl">{contact.name}</CardTitle>
              <CardDescription>
                {contact.position || "No position specified"}
              </CardDescription>
              <div
                className={`inline-flex items-center justify-center px-3 py-1 rounded-full text-sm font-medium ${getCategoryColor(
                  contact.category
                )}`}
              >
                {contact.category}
              </div>
            </CardHeader>
          </Card>

          {/* Contact Information */}
          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center">
                <User className="h-5 w-5 mr-2" />
                Contact Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                {contact.email && (
                  <div className="flex items-center space-x-3">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium">Email</p>
                      <p className="text-sm text-muted-foreground">
                        {contact.email}
                      </p>
                    </div>
                  </div>
                )}

                {contact.phone && (
                  <div className="flex items-center space-x-3">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium">Phone</p>
                      <p className="text-sm text-muted-foreground">
                        {contact.phone}
                      </p>
                    </div>
                  </div>
                )}

                {contact.companyName && (
                  <div className="flex items-center space-x-3">
                    <Building2 className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium">Company</p>
                      <p className="text-sm text-muted-foreground">
                        {contact.companyName}
                      </p>
                    </div>
                  </div>
                )}

                <div className="flex items-center space-x-3">
                  <Tag className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">Category</p>
                    <p className="text-sm text-muted-foreground capitalize">
                      {contact.category}
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Additional Details */}
          {contact.notes && (
            <Card className="md:col-span-3">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Tag className="h-5 w-5 mr-2" />
                  Notes
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                  {contact.notes}
                </p>
              </CardContent>
            </Card>
          )}

          {/* System Information */}
          <Card className="md:col-span-3">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Calendar className="h-5 w-5 mr-2" />
                System Information
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <p className="text-sm font-medium">Created At</p>
                  <p className="text-sm text-muted-foreground">
                    {new Date(contact.createdAt).toLocaleString()}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium">Last Updated</p>
                  <p className="text-sm text-muted-foreground">
                    {new Date(contact.updatedAt).toLocaleString()}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Modals */}
        <EditContactModal
          open={showEditModal}
          onOpenChange={setShowEditModal}
          contact={contact}
        />

        <DeleteContactConfirmationDialog
          open={showDeleteDialog}
          onOpenChange={setShowDeleteDialog}
          contact={contact}
          onDeleted={handleDeleteSuccess}
        />
      </div>
    </AppShell>
  );
}
