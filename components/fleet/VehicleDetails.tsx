"use client";

import React, { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { vehicleApi } from "@/lib/api";
import { Vehicle, VehicleStatus } from "@/types";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Car,
  Wrench,
  Ban,
  ArrowLeft,
  Edit,
  Upload,
  FileText,
  Trash2,
  Plus,
  Calendar,
  User,
  Building,
  MapPin,
  Fuel,
  Gauge,
  Shield,
  Clock,
} from "lucide-react";
import { format } from "date-fns";
import { useToast } from "@/lib/hooks/use-toast";

interface VehicleDetailsProps {
  vehicleId: string;
  onBack?: () => void;
  onEdit?: (vehicle: Vehicle) => void;
}

export function VehicleDetails({
  vehicleId,
  onBack,
  onEdit,
}: VehicleDetailsProps) {
  const { user } = useAuth();
  const { toast } = useToast();
  const [vehicle, setVehicle] = useState<Vehicle | null>(null);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [serviceLoading, setServiceLoading] = useState(false);
  const [statusLoading, setStatusLoading] = useState(false);

  // Service record form
  const [serviceForm, setServiceForm] = useState({
    serviceDate: "",
    notes: "",
  });

  const isAdmin = user?.role === "admin";
  const isApprover = user?.role === "approver";
  const canEdit =
    isAdmin || isApprover || vehicle?.assignedTo?._id === user?.id;

  useEffect(() => {
    fetchVehicle();
  }, [vehicleId]);

  const fetchVehicle = async () => {
    try {
      setLoading(true);
      const response = await vehicleApi.getById(vehicleId);
      setVehicle(response.vehicle);
    } catch (error) {
      console.error("Error fetching vehicle:", error);
      toast({
        title: "Error",
        description: "Failed to fetch vehicle details",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file || !vehicle) return;

    setUploading(true);
    try {
      await vehicleApi.uploadDocument(
        vehicle._id || vehicle.id || "",
        file,
        "general",
        file.name
      );
      toast({
        title: "Success",
        description: "Document uploaded successfully",
      });
      fetchVehicle();
    } catch (error: any) {
      console.error("Error uploading document:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to upload document",
        variant: "destructive",
      });
    } finally {
      setUploading(false);
      // Reset file input
      event.target.value = "";
    }
  };

  const handleDeleteDocument = async (documentId: string) => {
    if (!vehicle) return;

    if (window.confirm("Are you sure you want to delete this document?")) {
      try {
        await vehicleApi.deleteDocument(
          vehicle._id || vehicle.id || "",
          documentId
        );
        toast({
          title: "Success",
          description: "Document deleted successfully",
        });
        fetchVehicle();
      } catch (error: any) {
        console.error("Error deleting document:", error);
        toast({
          title: "Error",
          description: error.message || "Failed to delete document",
          variant: "destructive",
        });
      }
    }
  };

  const handleAddServiceRecord = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!vehicle || !serviceForm.serviceDate) return;

    setServiceLoading(true);
    try {
      await vehicleApi.addServiceRecord(
        vehicle._id || vehicle.id || "",
        serviceForm
      );
      toast({
        title: "Success",
        description: "Service record added successfully",
      });
      setServiceForm({ serviceDate: "", notes: "" });
      fetchVehicle();
    } catch (error: any) {
      console.error("Error adding service record:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to add service record",
        variant: "destructive",
      });
    } finally {
      setServiceLoading(false);
    }
  };

  const handleStatusUpdate = async (newStatus: VehicleStatus) => {
    if (!vehicle) return;

    setStatusLoading(true);
    try {
      await vehicleApi.updateStatus(vehicle._id || vehicle.id || "", newStatus);
      toast({
        title: "Success",
        description: "Vehicle status updated successfully",
      });
      fetchVehicle();
    } catch (error: any) {
      console.error("Error updating status:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to update status",
        variant: "destructive",
      });
    } finally {
      setStatusLoading(false);
    }
  };

  const getStatusIcon = (status: VehicleStatus) => {
    switch (status) {
      case "active":
        return <Car className="h-5 w-5 text-green-500" />;
      case "in maintenance":
        return <Wrench className="h-5 w-5 text-yellow-500" />;
      case "retired":
        return <Ban className="h-5 w-5 text-red-500" />;
      default:
        return <Car className="h-5 w-5" />;
    }
  };

  const getStatusColor = (status: VehicleStatus) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800 border-green-200";
      case "in maintenance":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "retired":
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="sm" onClick={onBack}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <div className="h-6 bg-gray-200 rounded w-48 animate-pulse"></div>
        </div>
        <Card>
          <CardContent className="py-12">
            <div className="flex items-center justify-center">
              <div className="text-center">
                <div className="h-8 w-8 bg-gray-200 rounded-full animate-pulse mx-auto mb-4"></div>
                <div className="h-4 bg-gray-200 rounded w-32 animate-pulse mx-auto"></div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!vehicle) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="sm" onClick={onBack}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
        </div>
        <Card>
          <CardContent className="flex items-center justify-center py-12">
            <div className="text-center">
              <h3 className="text-lg font-semibold mb-2">Vehicle not found</h3>
              <p className="text-muted-foreground">
                The requested vehicle could not be found.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="sm" onClick={onBack}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <div className="flex items-center gap-3">
            {getStatusIcon(vehicle.status)}
            <div>
              <h1 className="text-2xl font-bold">{vehicle.name}</h1>
              <p className="text-muted-foreground">
                {vehicle.registrationNumber}
              </p>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Badge className={getStatusColor(vehicle.status)}>
            {vehicle.status}
          </Badge>
          {canEdit && (
            <Button onClick={() => onEdit?.(vehicle)}>
              <Edit className="h-4 w-4 mr-2" />
              Edit
            </Button>
          )}
        </div>
      </div>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="documents">Documents</TabsTrigger>
          <TabsTrigger value="service">Service History</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            {/* Basic Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Car className="h-5 w-5" />
                  Vehicle Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {vehicle.make && vehicle.vehicleModel && (
                  <div className="flex items-center gap-2">
                    <Building className="h-4 w-4 text-muted-foreground" />
                    <span className="font-medium">Make/Model:</span>
                    <span>
                      {vehicle.make} {vehicle.vehicleModel}
                    </span>
                  </div>
                )}

                {vehicle.year && (
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span className="font-medium">Year:</span>
                    <span>{vehicle.year}</span>
                  </div>
                )}

                {vehicle.mileage && (
                  <div className="flex items-center gap-2">
                    <Gauge className="h-4 w-4 text-muted-foreground" />
                    <span className="font-medium">Mileage:</span>
                    <span>{vehicle.mileage.toLocaleString()} km</span>
                  </div>
                )}

                {vehicle.fuelType && (
                  <div className="flex items-center gap-2">
                    <Fuel className="h-4 w-4 text-muted-foreground" />
                    <span className="font-medium">Fuel Type:</span>
                    <span className="capitalize">{vehicle.fuelType}</span>
                  </div>
                )}

                {vehicle.project && (
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    <span className="font-medium">Project:</span>
                    <span>{vehicle.project}</span>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Assignment */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5" />
                  Assignment
                </CardTitle>
              </CardHeader>
              <CardContent>
                {vehicle.assignedTo ? (
                  <div className="space-y-2">
                    <div className="font-medium">{vehicle.assignedTo.name}</div>
                    <div className="text-sm text-muted-foreground">
                      {vehicle.assignedTo.email}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {vehicle.assignedTo.department}
                      {vehicle.assignedTo.position &&
                        ` • ${vehicle.assignedTo.position}`}
                    </div>
                  </div>
                ) : (
                  <div className="text-muted-foreground">No assignment</div>
                )}
              </CardContent>
            </Card>

            {/* Insurance */}
            {vehicle.insurance && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Shield className="h-5 w-5" />
                    Insurance
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {vehicle.insurance.provider && (
                    <div>
                      <span className="font-medium">Provider:</span>
                      <span className="ml-2">{vehicle.insurance.provider}</span>
                    </div>
                  )}
                  {vehicle.insurance.policyNumber && (
                    <div>
                      <span className="font-medium">Policy Number:</span>
                      <span className="ml-2">
                        {vehicle.insurance.policyNumber}
                      </span>
                    </div>
                  )}
                  {vehicle.insurance.expiryDate && (
                    <div>
                      <span className="font-medium">Expiry Date:</span>
                      <span className="ml-2">
                        {format(
                          new Date(vehicle.insurance.expiryDate),
                          "MMM dd, yyyy"
                        )}
                      </span>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            {/* Status Management */}
            {(isAdmin || isApprover) && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Clock className="h-5 w-5" />
                    Status Management
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <Select
                    value={vehicle.status}
                    onValueChange={handleStatusUpdate}
                    disabled={statusLoading}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="in maintenance">
                        In Maintenance
                      </SelectItem>
                      <SelectItem value="retired">Retired</SelectItem>
                    </SelectContent>
                  </Select>
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>

        {/* Documents Tab */}
        <TabsContent value="documents" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Documents
              </CardTitle>
              <CardDescription>
                Upload and manage vehicle documents
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {(isAdmin || isApprover) && (
                <div className="flex items-center gap-4">
                  <Label htmlFor="document-upload" className="cursor-pointer">
                    <Button asChild>
                      <span>
                        <Upload className="h-4 w-4 mr-2" />
                        Upload Document
                      </span>
                    </Button>
                  </Label>
                  <Input
                    id="document-upload"
                    type="file"
                    accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                    onChange={handleFileUpload}
                    disabled={uploading}
                    className="hidden"
                  />
                  {uploading && (
                    <span className="text-sm text-muted-foreground">
                      Uploading...
                    </span>
                  )}
                </div>
              )}

              {vehicle.documents && vehicle.documents.length > 0 ? (
                <div className="space-y-2">
                  {vehicle.documents.map((doc) => (
                    <div
                      key={doc._id}
                      className="flex items-center justify-between p-3 border rounded-lg"
                    >
                      <div className="flex items-center gap-3">
                        <FileText className="h-4 w-4 text-muted-foreground" />
                        <div>
                          <div className="font-medium">{doc.name}</div>
                          <div className="text-sm text-muted-foreground">
                            {(doc.size / 1024).toFixed(1)} KB •
                            {format(new Date(doc.uploadedAt), "MMM dd, yyyy")}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => window.open(doc.url, "_blank")}
                        >
                          View
                        </Button>
                        {(isAdmin || isApprover) && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDeleteDocument(doc._id || "")}
                            className="text-red-600 hover:text-red-700"
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  No documents uploaded yet
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Service History Tab */}
        <TabsContent value="service" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Wrench className="h-5 w-5" />
                Service History
              </CardTitle>
              <CardDescription>
                Track maintenance and service records
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {(isAdmin || isApprover) && (
                <form
                  onSubmit={handleAddServiceRecord}
                  className="space-y-4 p-4 border rounded-lg"
                >
                  <h4 className="font-medium">Add Service Record</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="serviceDate">Service Date *</Label>
                      <Input
                        id="serviceDate"
                        type="date"
                        value={serviceForm.serviceDate}
                        onChange={(e) =>
                          setServiceForm((prev) => ({
                            ...prev,
                            serviceDate: e.target.value,
                          }))
                        }
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="serviceNotes">Notes</Label>
                      <Textarea
                        id="serviceNotes"
                        value={serviceForm.notes}
                        onChange={(e) =>
                          setServiceForm((prev) => ({
                            ...prev,
                            notes: e.target.value,
                          }))
                        }
                        placeholder="Service details, parts replaced, etc."
                        rows={2}
                      />
                    </div>
                  </div>
                  <Button type="submit" disabled={serviceLoading}>
                    <Plus className="h-4 w-4 mr-2" />
                    {serviceLoading ? "Adding..." : "Add Service Record"}
                  </Button>
                </form>
              )}

              {vehicle.serviceSchedule && vehicle.serviceSchedule.length > 0 ? (
                <div className="space-y-2">
                  {vehicle.serviceSchedule
                    .sort(
                      (a, b) =>
                        new Date(b.serviceDate).getTime() -
                        new Date(a.serviceDate).getTime()
                    )
                    .map((service, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-3 border rounded-lg"
                      >
                        <div className="flex items-center gap-3">
                          <Calendar className="h-4 w-4 text-muted-foreground" />
                          <div>
                            <div className="font-medium">
                              {format(
                                new Date(service.serviceDate),
                                "MMM dd, yyyy"
                              )}
                            </div>
                            {service.notes && (
                              <div className="text-sm text-muted-foreground">
                                {service.notes}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  No service records yet
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
