"use client";

import React, { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { vehicleApi, employeeApi } from "@/lib/api";
import { Vehicle, VehicleStatus, Employee } from "@/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
// import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
//  import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { CalendarIcon, Save, X } from "lucide-react";
// import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { useToast } from "@/lib/hooks/use-toast";

interface VehicleFormProps {
  vehicle?: Vehicle;
  onSave?: (vehicle: Vehicle) => void;
  onCancel?: () => void;
}

export function VehicleForm({ vehicle, onSave, onCancel }: VehicleFormProps) {
  const { user } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [formData, setFormData] = useState({
    name: "",
    registrationNumber: "",
    make: "",
    vehicleModel: "",
    year: "",
    mileage: "",
    fuelType: "",
    assignedTo: "",
    project: "",
    status: "active" as VehicleStatus,
    insurance: {
      provider: "",
      policyNumber: "",
      expiryDate: "",
    },
  });

  const isAdmin = user?.role === "admin";
  const isApprover = user?.role === "approver";

  useEffect(() => {
    fetchEmployees();
    if (vehicle) {
      setFormData({
        name: vehicle.name || "",
        registrationNumber: vehicle.registrationNumber || "",
        make: vehicle.make || "",
        vehicleModel: vehicle.vehicleModel || "",
        year: vehicle.year?.toString() || "",
        mileage: vehicle.mileage?.toString() || "",
        fuelType: vehicle.fuelType || "",
        assignedTo: vehicle.assignedTo?._id || "unassigned",
        project: vehicle.project || "",
        status: vehicle.status || "active",
        insurance: {
          provider: vehicle.insurance?.provider || "",
          policyNumber: vehicle.insurance?.policyNumber || "",
          expiryDate: vehicle.insurance?.expiryDate || "",
        },
      });
    }
  }, [vehicle]);

  const fetchEmployees = async () => {
    try {
      const response = await employeeApi.getAll();
      setEmployees(response);
    } catch (error) {
      console.error("Error fetching employees:", error);
    }
  };

  const handleInputChange = (field: string, value: any) => {
    if (field.includes(".")) {
      const [parent, child] = field.split(".");
      setFormData((prev) => ({
        ...prev,
        [parent]: {
          ...(prev[parent as keyof typeof prev] as any),
          [child]: value,
        },
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [field]: value,
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name || !formData.registrationNumber) {
      toast({
        title: "Validation Error",
        description: "Name and registration number are required",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      const vehicleData = {
        name: formData.name,
        registrationNumber: formData.registrationNumber,
        make: formData.make || undefined,
        vehicleModel: formData.vehicleModel || undefined,
        year: formData.year ? parseInt(formData.year) : undefined,
        mileage: formData.mileage ? parseInt(formData.mileage) : undefined,
        fuelType: formData.fuelType || undefined,
        assignedTo:
          formData.assignedTo === "unassigned"
            ? undefined
            : formData.assignedTo || undefined,
        project: formData.project || undefined,
        status: formData.status,
        insurance:
          formData.insurance.provider ||
          formData.insurance.policyNumber ||
          formData.insurance.expiryDate
            ? {
                provider: formData.insurance.provider || undefined,
                policyNumber: formData.insurance.policyNumber || undefined,
                expiryDate: formData.insurance.expiryDate || undefined,
              }
            : undefined,
      };

      let savedVehicle;
      if (vehicle) {
        const response = await vehicleApi.update(
          vehicle._id || vehicle.id || "",
          vehicleData
        );
        savedVehicle = response.vehicle;
      } else {
        const response = await vehicleApi.create(vehicleData);
        savedVehicle = response.vehicle;
      }

      toast({
        title: "Success",
        description: `Vehicle ${vehicle ? "updated" : "created"} successfully`,
      });

      onSave?.(savedVehicle);
    } catch (error: any) {
      console.error("Error saving vehicle:", error);
      toast({
        title: "Error",
        description:
          error.message || `Failed to ${vehicle ? "update" : "create"} vehicle`,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const canEdit =
    isAdmin || isApprover || vehicle?.assignedTo?._id === user?.id;

  if (!canEdit && !vehicle) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-12">
          <div className="text-center">
            <h3 className="text-lg font-semibold mb-2">Access Denied</h3>
            <p className="text-muted-foreground">
              You don't have permission to create vehicles
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>{vehicle ? "Edit Vehicle" : "Add New Vehicle"}</CardTitle>
        <CardDescription>
          {vehicle
            ? "Update vehicle information and settings"
            : "Add a new vehicle to your fleet"}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Basic Information</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Vehicle Name *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => handleInputChange("name", e.target.value)}
                  placeholder="e.g., Company Car 1"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="registrationNumber">
                  Registration Number *
                </Label>
                <Input
                  id="registrationNumber"
                  value={formData.registrationNumber}
                  onChange={(e) =>
                    handleInputChange("registrationNumber", e.target.value)
                  }
                  placeholder="e.g., ABC-123"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="make">Make</Label>
                <Input
                  id="make"
                  value={formData.make}
                  onChange={(e) => handleInputChange("make", e.target.value)}
                  placeholder="e.g., Toyota"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="vehicleModel">Model</Label>
                <Input
                  id="vehicleModel"
                  value={formData.vehicleModel}
                  onChange={(e) =>
                    handleInputChange("vehicleModel", e.target.value)
                  }
                  placeholder="e.g., Camry"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="year">Year</Label>
                <Input
                  id="year"
                  type="number"
                  value={formData.year}
                  onChange={(e) => handleInputChange("year", e.target.value)}
                  placeholder="e.g., 2023"
                  min="1900"
                  max={new Date().getFullYear() + 1}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="mileage">Mileage (km)</Label>
                <Input
                  id="mileage"
                  type="number"
                  value={formData.mileage}
                  onChange={(e) => handleInputChange("mileage", e.target.value)}
                  placeholder="e.g., 50000"
                  min="0"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="fuelType">Fuel Type</Label>
                <Select
                  value={formData.fuelType}
                  onValueChange={(value) =>
                    handleInputChange("fuelType", value)
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select fuel type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="petrol">Petrol</SelectItem>
                    <SelectItem value="diesel">Diesel</SelectItem>
                    <SelectItem value="electric">Electric</SelectItem>
                    <SelectItem value="hybrid">Hybrid</SelectItem>
                    <SelectItem value="lpg">LPG</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <Select
                  value={formData.status}
                  onValueChange={(value) => handleInputChange("status", value)}
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
              </div>
            </div>
          </div>

          {/* Assignment */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Assignment</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="assignedTo">Assigned To</Label>
                <Select
                  value={formData.assignedTo}
                  onValueChange={(value) =>
                    handleInputChange("assignedTo", value)
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select employee" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="unassigned">Unassigned</SelectItem>
                    {employees.map((employee) => (
                      <SelectItem
                        key={employee._id || employee.id}
                        value={employee._id || employee.id || "unassigned"}
                      >
                        {employee.name} ({employee.department})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="project">Project</Label>
                <Input
                  id="project"
                  value={formData.project}
                  onChange={(e) => handleInputChange("project", e.target.value)}
                  placeholder="e.g., Construction Project A"
                />
              </div>
            </div>
          </div>

          {/* Insurance */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Insurance Information</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="insuranceProvider">Provider</Label>
                <Input
                  id="insuranceProvider"
                  value={formData.insurance.provider}
                  onChange={(e) =>
                    handleInputChange("insurance.provider", e.target.value)
                  }
                  placeholder="e.g., ABC Insurance"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="policyNumber">Policy Number</Label>
                <Input
                  id="policyNumber"
                  value={formData.insurance.policyNumber}
                  onChange={(e) =>
                    handleInputChange("insurance.policyNumber", e.target.value)
                  }
                  placeholder="e.g., POL-123456"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="expiryDate">Expiry Date</Label>
                <Input
                  id="expiryDate"
                  type="date"
                  value={formData.insurance.expiryDate}
                  onChange={(e) =>
                    handleInputChange("insurance.expiryDate", e.target.value)
                  }
                />
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 pt-6 border-t">
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
              disabled={loading}
            >
              <X className="h-4 w-4 mr-2" />
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              <Save className="h-4 w-4 mr-2" />
              {loading
                ? "Saving..."
                : vehicle
                ? "Update Vehicle"
                : "Create Vehicle"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
