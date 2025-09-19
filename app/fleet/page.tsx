"use client";

import React, { useState } from "react";
import { AppShell } from "@/components/layout/AppShell";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Search,
  Plus,
  Car,
  Calendar,
  User,
  AlertTriangle,
  CheckCircle,
  Settings,
  Fuel,
} from "lucide-react";
import { Vehicle, VehicleStatus } from "@/types";
import { formatDate } from "@/lib/utils";

// Mock vehicle data
const mockVehicles: Vehicle[] = [
  {
    id: "1",
    make: "Toyota",
    model: "Camry",
    year: 2022,
    licensePlate: "ABC-123",
    vin: "1HGBH41JXMN109186",
    status: "assigned",
    assignedTo: "John Doe",
    fuelType: "Gasoline",
    mileage: 25000,
    lastServiceDate: "2024-01-15",
    nextServiceDate: "2024-04-15",
    insuranceExpiry: "2024-12-31",
    registrationExpiry: "2024-08-15",
    createdAt: "2022-03-15T00:00:00Z",
    updatedAt: "2024-01-15T00:00:00Z",
  },
  {
    id: "2",
    make: "Honda",
    model: "Accord",
    year: 2021,
    licensePlate: "XYZ-789",
    vin: "1HGCV1F30JA123456",
    status: "available",
    fuelType: "Gasoline",
    mileage: 32000,
    lastServiceDate: "2023-12-10",
    nextServiceDate: "2024-02-10", // Service due soon
    insuranceExpiry: "2024-11-30",
    registrationExpiry: "2024-07-20",
    createdAt: "2021-05-20T00:00:00Z",
    updatedAt: "2023-12-10T00:00:00Z",
  },
  {
    id: "3",
    make: "Ford",
    model: "F-150",
    year: 2020,
    licensePlate: "DEF-456",
    vin: "1FTFW1ET5LFC12345",
    status: "maintenance",
    fuelType: "Gasoline",
    mileage: 45000,
    lastServiceDate: "2024-01-20",
    nextServiceDate: "2024-07-20",
    insuranceExpiry: "2024-10-15",
    registrationExpiry: "2024-06-30",
    createdAt: "2020-08-10T00:00:00Z",
    updatedAt: "2024-01-20T00:00:00Z",
  },
  {
    id: "4",
    make: "Chevrolet",
    model: "Silverado",
    year: 2019,
    licensePlate: "GHI-789",
    vin: "1GCVKREC5KZ123456",
    status: "out_of_service",
    fuelType: "Gasoline",
    mileage: 78000,
    lastServiceDate: "2023-11-05",
    nextServiceDate: "2024-03-05",
    insuranceExpiry: "2024-09-30",
    registrationExpiry: "2024-05-15", // Registration expiring soon
    createdAt: "2019-11-25T00:00:00Z",
    updatedAt: "2023-11-05T00:00:00Z",
  },
];

const getStatusColor = (status: VehicleStatus): string => {
  switch (status) {
    case "available":
      return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300";
    case "assigned":
      return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300";
    case "maintenance":
      return "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300";
    case "out_of_service":
      return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300";
    default:
      return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300";
  }
};

const getStatusIcon = (status: VehicleStatus) => {
  switch (status) {
    case "available":
      return <CheckCircle className="h-4 w-4 text-green-500" />;
    case "assigned":
      return <User className="h-4 w-4 text-blue-500" />;
    case "maintenance":
      return <Settings className="h-4 w-4 text-orange-500" />;
    case "out_of_service":
      return <AlertTriangle className="h-4 w-4 text-red-500" />;
    default:
      return <Car className="h-4 w-4 text-gray-500" />;
  }
};

const isServiceDue = (nextServiceDate?: string): boolean => {
  if (!nextServiceDate) return false;
  const service = new Date(nextServiceDate);
  const now = new Date();
  const daysUntilService = Math.ceil(
    (service.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)
  );
  return daysUntilService <= 30;
};

const isExpiringDocument = (expiryDate?: string): boolean => {
  if (!expiryDate) return false;
  const expiry = new Date(expiryDate);
  const now = new Date();
  const daysUntilExpiry = Math.ceil(
    (expiry.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)
  );
  return daysUntilExpiry <= 60 && daysUntilExpiry > 0;
};

const VehicleCard: React.FC<{ vehicle: Vehicle }> = ({ vehicle }) => {
  const serviceDue = isServiceDue(vehicle.nextServiceDate);
  const insuranceExpiring = isExpiringDocument(vehicle.insuranceExpiry);
  const registrationExpiring = isExpiringDocument(vehicle.registrationExpiry);
  const hasAlerts = serviceDue || insuranceExpiring || registrationExpiring;

  return (
    <Card
      className={`hover:shadow-md transition-shadow ${
        hasAlerts ? "border-orange-200" : ""
      }`}
    >
      <CardContent className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-start space-x-3">
            <div className="p-2 rounded-lg bg-primary/10">
              <Car className="h-6 w-6 text-primary" />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-lg font-semibold">
                {vehicle.year} {vehicle.make} {vehicle.model}
              </h3>
              <p className="text-sm text-muted-foreground">
                {vehicle.licensePlate}
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            {getStatusIcon(vehicle.status)}
            <span
              className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(
                vehicle.status
              )}`}
            >
              {vehicle.status.replace("_", " ")}
            </span>
          </div>
        </div>

        <div className="space-y-2 mb-4">
          {vehicle.assignedTo && (
            <div className="flex items-center text-sm">
              <User className="h-4 w-4 mr-2 text-muted-foreground" />
              <span className="font-medium">Assigned to:</span>
              <span className="ml-1 text-muted-foreground">
                {vehicle.assignedTo}
              </span>
            </div>
          )}

          <div className="flex items-center text-sm text-muted-foreground">
            <Fuel className="h-4 w-4 mr-2" />
            {vehicle.fuelType} • {vehicle.mileage?.toLocaleString()} miles
          </div>

          {vehicle.nextServiceDate && (
            <div
              className={`flex items-center text-sm ${
                serviceDue ? "text-orange-600" : "text-muted-foreground"
              }`}
            >
              <Calendar className="h-4 w-4 mr-2" />
              Next Service: {formatDate(vehicle.nextServiceDate)}
              {serviceDue && <AlertTriangle className="h-3 w-3 ml-2" />}
            </div>
          )}
        </div>

        {hasAlerts && (
          <div className="border-t pt-4 space-y-1">
            <h4 className="text-sm font-medium text-orange-600 mb-2">
              Alerts:
            </h4>
            {serviceDue && (
              <div className="flex items-center text-xs text-orange-600">
                <AlertTriangle className="h-3 w-3 mr-1" />
                Service due soon
              </div>
            )}
            {insuranceExpiring && (
              <div className="flex items-center text-xs text-orange-600">
                <AlertTriangle className="h-3 w-3 mr-1" />
                Insurance expires {formatDate(vehicle.insuranceExpiry!)}
              </div>
            )}
            {registrationExpiring && (
              <div className="flex items-center text-xs text-orange-600">
                <AlertTriangle className="h-3 w-3 mr-1" />
                Registration expires {formatDate(vehicle.registrationExpiry!)}
              </div>
            )}
          </div>
        )}

        <div className="border-t pt-4 mt-4">
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>VIN: {vehicle.vin}</span>
            <Button size="sm" variant="outline">
              Manage
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

const FleetStats: React.FC<{ vehicles: Vehicle[] }> = ({ vehicles }) => {
  const stats = {
    total: vehicles.length,
    available: vehicles.filter((v) => v.status === "available").length,
    assigned: vehicles.filter((v) => v.status === "assigned").length,
    maintenance: vehicles.filter((v) => v.status === "maintenance").length,
    outOfService: vehicles.filter((v) => v.status === "out_of_service").length,
    serviceDue: vehicles.filter((v) => isServiceDue(v.nextServiceDate)).length,
    documentsExpiring: vehicles.filter(
      (v) =>
        isExpiringDocument(v.insuranceExpiry) ||
        isExpiringDocument(v.registrationExpiry)
    ).length,
  };

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-6">
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium">Total Vehicles</p>
              <p className="text-2xl font-bold">{stats.total}</p>
            </div>
            <Car className="h-8 w-8 text-muted-foreground" />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium">Available</p>
              <p className="text-2xl font-bold text-green-600">
                {stats.available}
              </p>
            </div>
            <CheckCircle className="h-8 w-8 text-green-500" />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium">In Use</p>
              <p className="text-2xl font-bold text-blue-600">
                {stats.assigned}
              </p>
            </div>
            <User className="h-8 w-8 text-blue-500" />
          </div>
        </CardContent>
      </Card>

      <Card
        className={
          stats.serviceDue > 0 || stats.documentsExpiring > 0
            ? "border-orange-200"
            : ""
        }
      >
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium">Need Attention</p>
              <p className="text-2xl font-bold text-orange-600">
                {stats.serviceDue + stats.documentsExpiring}
              </p>
            </div>
            <AlertTriangle className="h-8 w-8 text-orange-500" />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default function FleetPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState<VehicleStatus | "all">(
    "all"
  );
  const [vehicles] = useState(mockVehicles);

  const filteredVehicles = vehicles.filter((vehicle) => {
    const matchesSearch =
      vehicle.make.toLowerCase().includes(searchTerm.toLowerCase()) ||
      vehicle.model.toLowerCase().includes(searchTerm.toLowerCase()) ||
      vehicle.licensePlate.toLowerCase().includes(searchTerm.toLowerCase()) ||
      vehicle.assignedTo?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      selectedStatus === "all" || vehicle.status === selectedStatus;

    return matchesSearch && matchesStatus;
  });

  const statuses: (VehicleStatus | "all")[] = [
    "all",
    "available",
    "assigned",
    "maintenance",
    "out_of_service",
  ];

  return (
    <AppShell>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              Fleet Management
            </h1>
            <p className="text-muted-foreground">
              Manage and monitor your vehicle fleet
            </p>
          </div>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Add Vehicle
          </Button>
        </div>

        <FleetStats vehicles={vehicles} />

        <Card>
          <CardHeader>
            <CardTitle>Vehicle Fleet</CardTitle>
            <CardDescription>
              Monitor vehicle status, assignments, and maintenance
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col space-y-4 mb-6">
              <div className="flex items-center space-x-2">
                <div className="relative flex-1">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search vehicles..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-8"
                  />
                </div>
              </div>

              <div className="flex flex-wrap gap-2">
                {statuses.map((status) => (
                  <Button
                    key={status}
                    variant={selectedStatus === status ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedStatus(status)}
                    className="capitalize"
                  >
                    {status === "out_of_service" ? "Out of Service" : status}
                  </Button>
                ))}
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              {filteredVehicles.map((vehicle) => (
                <VehicleCard key={vehicle.id} vehicle={vehicle} />
              ))}
            </div>

            {filteredVehicles.length === 0 && (
              <div className="text-center py-8">
                <p className="text-muted-foreground">
                  No vehicles found matching your criteria.
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </AppShell>
  );
}
