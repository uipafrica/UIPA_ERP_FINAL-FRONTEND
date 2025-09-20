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
  Shield,
  Key,
  Settings,
  Upload,
  XCircle,
} from "lucide-react";
import { Employee } from "@/types";
import { getInitials } from "@/lib/utils";
import { employeeApi, userApi } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";
import { EditEmployeeModal } from "@/components/employees/EditEmployeeModal";
import { DeleteConfirmationDialog } from "@/components/employees/DeleteConfirmationDialog";
import { EditUserModal } from "@/components/employees/EditUserModal";
import { ResetPasswordModal } from "@/components/employees/ResetPasswordModal";
import { UploadDocumentModal } from "@/components/employees/UploadDocumentModal";
import { DeleteDocumentModal } from "@/components/employees/DeleteDocumentModal";

export default function EmployeeDetailPage() {
  const router = useRouter();
  const params = useParams();
  const { user } = useAuth();
  const employeeId = params.id as string;
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showEditUserModal, setShowEditUserModal] = useState(false);
  const [showResetPasswordModal, setShowResetPasswordModal] = useState(false);
  const [showUploadDocumentModal, setShowUploadDocumentModal] = useState(false);
  const [showDeleteDocumentModal, setShowDeleteDocumentModal] = useState(false);
  const [documentToDelete, setDocumentToDelete] = useState<{
    type: "idCard" | "resume" | "contract" | "certificate";
    index?: number;
    name?: string;
  } | null>(null);

  const isAdmin = user?.role === "admin";

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

  // Fetch user data for admin users
  const {
    data: userData,
    isLoading: userLoading,
    error: userError,
  } = useQuery({
    queryKey: ["user", "employee", employeeId],
    queryFn: () =>
      userApi.getByEmployeeId(
        employeeId,
        localStorage.getItem("access_token") || undefined
      ),
    enabled: !!user && !!employeeId && isAdmin,
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

  // Helper function to get full document URL
  const getDocumentUrl = (relativeUrl: string) => {
    // Extract filename from the relative URL
    const filename = relativeUrl.split("/").pop();
    if (!filename) return relativeUrl;

    return employeeApi.getDocumentUrl(filename);
  };

  // Handler for deleting documents
  const handleDeleteDocument = (
    type: "idCard" | "resume" | "contract" | "certificate",
    index?: number,
    name?: string
  ) => {
    setDocumentToDelete({ type, index, name });
    setShowDeleteDocumentModal(true);
  };

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

                {/* {employee.salary && (
                  <div className="flex items-center space-x-3">
                    <Briefcase className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium">Salary</p>
                      <p className="text-sm text-muted-foreground">
                        ${employee.salary.toLocaleString()}
                      </p>
                    </div>
                  </div>
                )} */}
              </div>
            </CardContent>
          </Card>

          {/* User Account Information - Admin Only */}
          {isAdmin && userData && (
            <Card className="md:col-span-3">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center">
                    <Shield className="h-5 w-5 mr-2" />
                    User Account Information
                  </CardTitle>
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setShowEditUserModal(true)}
                    >
                      <Settings className="h-4 w-4 mr-2" />
                      Edit User
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setShowResetPasswordModal(true)}
                    >
                      <Key className="h-4 w-4 mr-2" />
                      Reset Password
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                  <div className="flex items-center space-x-3">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium">Account Email</p>
                      <p className="text-sm text-muted-foreground">
                        {userData.email}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3">
                    <Shield className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium">Role</p>
                      <p className="text-sm text-muted-foreground capitalize">
                        {userData.role}
                      </p>
                    </div>
                  </div>

                  {userData.attributes?.department && (
                    <div className="flex items-center space-x-3">
                      <Building className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <p className="text-sm font-medium">User Department</p>
                        <p className="text-sm text-muted-foreground">
                          {userData.attributes.department}
                        </p>
                      </div>
                    </div>
                  )}

                  {userData.attributes?.employee_id && (
                    <div className="flex items-center space-x-3">
                      <User className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <p className="text-sm font-medium">Employee ID</p>
                        <p className="text-sm text-muted-foreground">
                          {userData.attributes.employee_id}
                        </p>
                      </div>
                    </div>
                  )}

                  {userData.attributes?.approval_level && (
                    <div className="flex items-center space-x-3">
                      <Settings className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <p className="text-sm font-medium">Approval Level</p>
                        <p className="text-sm text-muted-foreground">
                          {userData.attributes.approval_level === "level1"
                            ? "Level 1 (Supervisor)"
                            : userData.attributes.approval_level === "level2"
                            ? "Level 2 (Manager)"
                            : userData.attributes.approval_level}
                        </p>
                      </div>
                    </div>
                  )}

                  <div className="flex items-center space-x-3">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium">Account Created</p>
                      <p className="text-sm text-muted-foreground">
                        {new Date(userData.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium">Last Updated</p>
                      <p className="text-sm text-muted-foreground">
                        {new Date(userData.updatedAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* User Data Loading/Error States - Admin Only */}
          {isAdmin && userLoading && (
            <Card className="md:col-span-3">
              <CardContent className="py-8">
                <div className="flex items-center justify-center">
                  <Loader2 className="h-6 w-6 animate-spin text-primary mr-2" />
                  <span className="text-muted-foreground">
                    Loading user account information...
                  </span>
                </div>
              </CardContent>
            </Card>
          )}

          {isAdmin && userError && !userData && (
            <Card className="md:col-span-3">
              <CardContent className="py-8">
                <div className="flex items-center justify-center text-muted-foreground">
                  <AlertCircle className="h-6 w-6 mr-2" />
                  <span>No user account found for this employee</span>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Documents - Admin Only */}
          {isAdmin && (
            <Card className="md:col-span-3">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center">
                    <MapPin className="h-5 w-5 mr-2" />
                    Documents
                  </CardTitle>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowUploadDocumentModal(true)}
                  >
                    <Upload className="h-4 w-4 mr-2" />
                    Upload Document
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {employee.documents &&
                Object.keys(employee.documents).some(
                  (key) =>
                    (key === "idCardUrl" && employee.documents[key]) ||
                    (key === "resumeUrl" && employee.documents[key]) ||
                    (key === "contracts" &&
                      employee.documents[key]?.length > 0) ||
                    (key === "certificates" &&
                      employee.documents[key]?.length > 0)
                ) ? (
                  <div className="grid gap-4 sm:grid-cols-3">
                    {employee.documents.idCardUrl && (
                      <div className="p-4 border rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <p className="text-sm font-medium">ID Card</p>
                          <button
                            onClick={() => handleDeleteDocument("idCard")}
                            className="text-destructive hover:text-destructive/80 transition-colors"
                            title="Delete ID Card"
                          >
                            <XCircle className="h-4 w-4" />
                          </button>
                        </div>
                        <Button variant="outline" size="sm" asChild>
                          <a
                            href={getDocumentUrl(employee.documents.idCardUrl)}
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
                        <div className="flex items-center justify-between mb-2">
                          <p className="text-sm font-medium">Resume</p>
                          <button
                            onClick={() => handleDeleteDocument("resume")}
                            className="text-destructive hover:text-destructive/80 transition-colors"
                            title="Delete Resume"
                          >
                            <XCircle className="h-4 w-4" />
                          </button>
                        </div>
                        <Button variant="outline" size="sm" asChild>
                          <a
                            href={getDocumentUrl(employee.documents.resumeUrl)}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            View Document
                          </a>
                        </Button>
                      </div>
                    )}

                    {employee.documents.contracts &&
                      employee.documents.contracts.length > 0 && (
                        <div className="p-4 border rounded-lg">
                          <p className="text-sm font-medium mb-2">Contracts</p>
                          <div className="space-y-2">
                            {employee.documents.contracts.map(
                              (
                                contract: { name: string; url: string },
                                index: number
                              ) => (
                                <div
                                  key={index}
                                  className="flex items-center justify-between p-2 border rounded"
                                >
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    asChild
                                    className="flex-1 mr-2"
                                  >
                                    <a
                                      href={getDocumentUrl(contract.url)}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                    >
                                      {contract.name}
                                    </a>
                                  </Button>
                                  <button
                                    onClick={() =>
                                      handleDeleteDocument(
                                        "contract",
                                        index,
                                        contract.name
                                      )
                                    }
                                    className="text-destructive hover:text-destructive/80 transition-colors"
                                    title={`Delete ${contract.name}`}
                                  >
                                    <XCircle className="h-4 w-4" />
                                  </button>
                                </div>
                              )
                            )}
                          </div>
                        </div>
                      )}

                    {employee.documents.certificates &&
                      employee.documents.certificates.length > 0 && (
                        <div className="p-4 border rounded-lg">
                          <p className="text-sm font-medium mb-2">
                            Certificates
                          </p>
                          <div className="space-y-2">
                            {employee.documents.certificates.map(
                              (
                                cert: { name: string; url: string },
                                index: number
                              ) => (
                                <div
                                  key={index}
                                  className="flex items-center justify-between p-2 border rounded"
                                >
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    asChild
                                    className="flex-1 mr-2"
                                  >
                                    <a
                                      href={getDocumentUrl(cert.url)}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                    >
                                      {cert.name}
                                    </a>
                                  </Button>
                                  <button
                                    onClick={() =>
                                      handleDeleteDocument(
                                        "certificate",
                                        index,
                                        cert.name
                                      )
                                    }
                                    className="text-destructive hover:text-destructive/80 transition-colors"
                                    title={`Delete ${cert.name}`}
                                  >
                                    <XCircle className="h-4 w-4" />
                                  </button>
                                </div>
                              )
                            )}
                          </div>
                        </div>
                      )}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <MapPin className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                    <p className="text-muted-foreground mb-2">
                      No documents uploaded
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Click "Upload Document" to add employee documents
                    </p>
                  </div>
                )}
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

        {/* User Management Modals - Admin Only */}
        {isAdmin && employee && userData && (
          <>
            <EditUserModal
              open={showEditUserModal}
              onOpenChange={setShowEditUserModal}
              employee={employee}
              userData={userData}
            />

            <ResetPasswordModal
              open={showResetPasswordModal}
              onOpenChange={setShowResetPasswordModal}
              employee={employee}
            />
          </>
        )}

        {/* Document Upload Modal - Admin Only */}
        {isAdmin && (
          <UploadDocumentModal
            open={showUploadDocumentModal}
            onOpenChange={setShowUploadDocumentModal}
            employee={employee}
          />
        )}

        {/* Document Delete Modal - Admin Only */}
        {isAdmin && documentToDelete && (
          <DeleteDocumentModal
            open={showDeleteDocumentModal}
            onOpenChange={setShowDeleteDocumentModal}
            employee={employee}
            documentType={documentToDelete.type}
            documentIndex={documentToDelete.index}
            documentName={documentToDelete.name}
          />
        )}
      </div>
    </AppShell>
  );
}
