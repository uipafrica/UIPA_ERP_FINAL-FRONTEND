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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  ArrowLeft,
  Mail,
  Phone,
  MapPin,
  Calendar,
  User,
  Building,
  Briefcase,
  Clock,
  Edit,
  Loader2,
  AlertCircle,
  Trash2,
} from "lucide-react";
import { Employee } from "@/types";
import { getInitials } from "@/lib/utils";
import { employeeApi } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";
import { EditEmployeeModal } from "@/components/employees/EditEmployeeModal";
import { DeleteConfirmationDialog } from "@/components/employees/DeleteConfirmationDialog";

export default function EmployeeDetailPage() {
  const router = useRouter();
  const params = useParams();
  const { user } = useAuth();
  const employeeId = params.id as string;
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  // Fetch employee details
  const {
    data: employee,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ["employee", employeeId],
    queryFn: () =>
      employeeApi.getById(
        employeeId,
        localStorage.getItem("access_token") || undefined
      ),
    enabled: !!user && !!employeeId,
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
    router.push("/employees");
  };

  const isAdmin = user?.role === "admin";

  if (isLoading) {
    return (
      <AppShell>
        <div className="flex items-center justify-center py-8">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <span className="ml-2 text-muted-foreground">
            Loading employee details...
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
              Failed to load employee details
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

  if (!employee) {
    return (
      <AppShell>
        <div className="text-center py-8">
          <p className="text-muted-foreground">Employee not found.</p>
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
                Employee Details
              </h1>
              <p className="text-muted-foreground">
                Comprehensive employee information
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Button onClick={handleEdit}>
              <Edit className="h-4 w-4 mr-2" />
              Edit Employee
            </Button>
            {isAdmin && (
              <Button variant="destructive" onClick={handleDelete}>
                <Trash2 className="h-4 w-4 mr-2" />
                Delete Employee
              </Button>
            )}
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {/* Profile Card */}
          <Card className="md:col-span-1">
            <CardHeader className="text-center">
              <Avatar className="h-24 w-24 mx-auto mb-4">
                <AvatarImage src={employee.user?.avatar} />
                <AvatarFallback className="text-xl">
                  {getInitials(employee.name)}
                </AvatarFallback>
              </Avatar>
              <CardTitle className="text-xl">{employee.name}</CardTitle>
              <CardDescription>
                {employee.position || "No position assigned"}
              </CardDescription>
              <div className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-primary/10 text-primary">
                {employee.user?.role || "employee"}
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
                <div className="flex items-center space-x-3">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">Email</p>
                    <p className="text-sm text-muted-foreground">
                      {employee.email}
                    </p>
                  </div>
                </div>

                {employee.phone && (
                  <div className="flex items-center space-x-3">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium">Phone</p>
                      <p className="text-sm text-muted-foreground">
                        {employee.phone}
                      </p>
                    </div>
                  </div>
                )}

                {employee.department && (
                  <div className="flex items-center space-x-3">
                    <Building className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium">Department</p>
                      <p className="text-sm text-muted-foreground">
                        {employee.department}
                      </p>
                    </div>
                  </div>
                )}

                <div className="flex items-center space-x-3">
                  <User className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">Employee ID</p>
                    <p className="text-sm text-muted-foreground">
                      {employee._id || employee.id}
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Employment Details */}
          <Card className="md:col-span-3">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Briefcase className="h-5 w-5 mr-2" />
                Employment Details
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                {employee.hireDate && (
                  <div className="flex items-center space-x-3">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium">Hire Date</p>
                      <p className="text-sm text-muted-foreground">
                        {new Date(employee.hireDate).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                )}

                {employee.contractType && (
                  <div className="flex items-center space-x-3">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium">Contract Type</p>
                      <p className="text-sm text-muted-foreground capitalize">
                        {employee.contractType.replace("_", " ")}
                      </p>
                    </div>
                  </div>
                )}

                {employee.manager && (
                  <div className="flex items-center space-x-3">
                    <User className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium">Manager</p>
                      <p className="text-sm text-muted-foreground">
                        {employee.manager}
                      </p>
                    </div>
                  </div>
                )}

                {employee.salary && (
                  <div className="flex items-center space-x-3">
                    <Briefcase className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium">Salary</p>
                      <p className="text-sm text-muted-foreground">
                        ${employee.salary.toLocaleString()}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Documents */}
          {employee.documents && (
            <Card className="md:col-span-3">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <MapPin className="h-5 w-5 mr-2" />
                  Documents
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 sm:grid-cols-3">
                  {employee.documents.idCardUrl && (
                    <div className="p-4 border rounded-lg">
                      <p className="text-sm font-medium mb-2">ID Card</p>
                      <Button variant="outline" size="sm" asChild>
                        <a
                          href={employee.documents.idCardUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          View Document
                        </a>
                      </Button>
                    </div>
                  )}

                  {employee.documents.resumeUrl && (
                    <div className="p-4 border rounded-lg">
                      <p className="text-sm font-medium mb-2">Resume</p>
                      <Button variant="outline" size="sm" asChild>
                        <a
                          href={employee.documents.resumeUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          View Document
                        </a>
                      </Button>
                    </div>
                  )}

                  {employee.documents.certificates &&
                    employee.documents.certificates.length > 0 && (
                      <div className="p-4 border rounded-lg">
                        <p className="text-sm font-medium mb-2">Certificates</p>
                        <div className="space-y-2">
                          {employee.documents.certificates.map(
                            (cert, index) => (
                              <Button
                                key={index}
                                variant="outline"
                                size="sm"
                                asChild
                              >
                                <a
                                  href={cert}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                >
                                  Certificate {index + 1}
                                </a>
                              </Button>
                            )
                          )}
                        </div>
                      </div>
                    )}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Additional Information */}
          <Card className="md:col-span-3">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Clock className="h-5 w-5 mr-2" />
                System Information
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <p className="text-sm font-medium">Created At</p>
                  <p className="text-sm text-muted-foreground">
                    {new Date(employee.createdAt).toLocaleString()}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium">Last Updated</p>
                  <p className="text-sm text-muted-foreground">
                    {new Date(employee.updatedAt).toLocaleString()}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Modals */}
        <EditEmployeeModal
          open={showEditModal}
          onOpenChange={setShowEditModal}
          employee={employee}
        />

        <DeleteConfirmationDialog
          open={showDeleteDialog}
          onOpenChange={setShowDeleteDialog}
          employee={employee}
          onDeleted={handleDeleteSuccess}
        />
      </div>
    </AppShell>
  );
}
