"use client";

import React, { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { vehicleApi } from "@/lib/api";
import { Vehicle, VehicleStatus } from "@/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Search,
  Plus,
  Car,
  Wrench,
  Ban,
  Eye,
  Edit,
  Trash2,
} from "lucide-react";
import { useToast } from "@/lib/hooks/use-toast";

interface VehicleListProps {
  onVehicleSelect?: (vehicle: Vehicle) => void;
  onVehicleEdit?: (vehicle: Vehicle) => void;
  onVehicleDelete?: (vehicle: Vehicle) => void;
  onCreateVehicle?: () => void;
}

export function VehicleList({
  onVehicleSelect,
  onVehicleEdit,
  onVehicleDelete,
  onCreateVehicle,
}: VehicleListProps) {
  const { user } = useAuth();
  const { toast } = useToast();
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<VehicleStatus | "all">(
    "all"
  );
  const [projectFilter, setProjectFilter] = useState<string>("all");
  const [projects, setProjects] = useState<string[]>([]);

  const isAdmin = user?.role === "admin";
  const isApprover = user?.role === "approver";

  const fetchVehicles = async () => {
    try {
      setLoading(true);
      const params: any = {};
      if (searchTerm) params.search = searchTerm;
      if (statusFilter !== "all") params.status = statusFilter;
      if (projectFilter !== "all") params.project = projectFilter;

      const response = await vehicleApi.getAll(params);
      setVehicles(response.vehicles || []);

      // Extract unique projects for filter
      const uniqueProjects = Array.from(
        new Set(
          response.vehicles?.map((v: Vehicle) => v.project).filter(Boolean)
        )
      ) as string[];
      setProjects(uniqueProjects);
    } catch (error) {
      console.error("Error fetching vehicles:", error);
      toast({
        title: "Error",
        description: "Failed to fetch vehicles",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVehicles();
  }, [searchTerm, statusFilter, projectFilter]);

  const handleDelete = async (vehicle: Vehicle) => {
    if (!isAdmin) return;

    if (window.confirm(`Are you sure you want to delete ${vehicle.name}?`)) {
      try {
        await vehicleApi.delete(vehicle._id || vehicle.id || "");
        toast({
          title: "Success",
          description: "Vehicle deleted successfully",
        });
        fetchVehicles();
        onVehicleDelete?.(vehicle);
      } catch (error) {
        console.error("Error deleting vehicle:", error);
        toast({
          title: "Error",
          description: "Failed to delete vehicle",
          variant: "destructive",
        });
      }
    }
  };

  const getStatusIcon = (status: VehicleStatus) => {
    switch (status) {
      case "active":
        return <Car className="h-4 w-4 text-green-500" />;
      case "in maintenance":
        return <Wrench className="h-4 w-4 text-yellow-500" />;
      case "retired":
        return <Ban className="h-4 w-4 text-red-500" />;
      default:
        return <Car className="h-4 w-4" />;
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
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold">Vehicles</h2>
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader>
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="h-3 bg-gray-200 rounded"></div>
                  <div className="h-3 bg-gray-200 rounded w-2/3"></div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold">Fleet Management</h2>
          <p className="text-muted-foreground">
            Manage your vehicle fleet - {vehicles.length} vehicles total
          </p>
        </div>
        {(isAdmin || isApprover) && (
          <Button onClick={onCreateVehicle} className="shrink-0">
            <Plus className="h-4 w-4 mr-2" />
            Add Vehicle
          </Button>
        )}
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search vehicles..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select
          value={statusFilter}
          onValueChange={(value) =>
            setStatusFilter(value as VehicleStatus | "all")
          }
        >
          <SelectTrigger className="w-full sm:w-48">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="in maintenance">In Maintenance</SelectItem>
            <SelectItem value="retired">Retired</SelectItem>
          </SelectContent>
        </Select>
        <Select value={projectFilter} onValueChange={setProjectFilter}>
          <SelectTrigger className="w-full sm:w-48">
            <SelectValue placeholder="Filter by project" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Projects</SelectItem>
            {projects.map((project) => (
              <SelectItem key={project} value={project}>
                {project}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Vehicle Grid */}
      {vehicles.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Car className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">No vehicles found</h3>
            <p className="text-muted-foreground text-center mb-4">
              {searchTerm || statusFilter !== "all" || projectFilter !== "all"
                ? "Try adjusting your search filters"
                : "Get started by adding your first vehicle"}
            </p>
            {(isAdmin || isApprover) &&
              !searchTerm &&
              statusFilter === "all" &&
              projectFilter === "all" && (
                <Button onClick={onCreateVehicle}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Vehicle
                </Button>
              )}
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {vehicles.map((vehicle) => (
            <Card
              key={vehicle._id || vehicle.id}
              className="hover:shadow-md transition-shadow"
            >
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2">
                    {getStatusIcon(vehicle.status)}
                    <CardTitle className="text-lg">{vehicle.name}</CardTitle>
                  </div>
                  <Badge className={getStatusColor(vehicle.status)}>
                    {vehicle.status}
                  </Badge>
                </div>
                <CardDescription>
                  {vehicle.registrationNumber}
                  {vehicle.make && vehicle.vehicleModel && (
                    <span className="block">
                      {vehicle.make} {vehicle.vehicleModel}
                      {vehicle.year && ` (${vehicle.year})`}
                    </span>
                  )}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {vehicle.assignedTo && (
                  <div className="text-sm">
                    <span className="font-medium">Assigned to:</span>
                    <p className="text-muted-foreground">
                      {vehicle.assignedTo.name}
                      {vehicle.assignedTo.department && (
                        <span className="block text-xs">
                          {vehicle.assignedTo.department}
                        </span>
                      )}
                    </p>
                  </div>
                )}

                {vehicle.project && (
                  <div className="text-sm">
                    <span className="font-medium">Project:</span>
                    <p className="text-muted-foreground">{vehicle.project}</p>
                  </div>
                )}

                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  {vehicle.mileage && (
                    <span>{vehicle.mileage.toLocaleString()} km</span>
                  )}
                  {vehicle.fuelType && <span>• {vehicle.fuelType}</span>}
                </div>

                {/* Action Buttons */}
                <div className="flex items-center gap-2 pt-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onVehicleSelect?.(vehicle)}
                    className="flex-1"
                  >
                    <Eye className="h-3 w-3 mr-1" />
                    View
                  </Button>
                  {(isAdmin ||
                    isApprover ||
                    vehicle.assignedTo?._id === user?.id) && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onVehicleEdit?.(vehicle)}
                    >
                      <Edit className="h-3 w-3" />
                    </Button>
                  )}
                  {isAdmin && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDelete(vehicle)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
