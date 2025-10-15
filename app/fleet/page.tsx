"use client";

import React, { useState } from "react";
import { AppShell } from "@/components/layout/AppShell";
import { VehicleList } from "@/components/fleet/VehicleList";
import { VehicleForm } from "@/components/fleet/VehicleForm";
import { VehicleDetails } from "@/components/fleet/VehicleDetails";
import { Vehicle } from "@/types";

type ViewMode = "list" | "create" | "edit" | "details";

export default function FleetPage() {
  const [viewMode, setViewMode] = useState<ViewMode>("list");
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null);

  const handleVehicleSelect = (vehicle: Vehicle) => {
    setSelectedVehicle(vehicle);
    setViewMode("details");
  };

  const handleVehicleEdit = (vehicle: Vehicle) => {
    setSelectedVehicle(vehicle);
    setViewMode("edit");
  };

  const handleVehicleDelete = (vehicle: Vehicle) => {
    // Vehicle deleted, refresh list if needed
    setViewMode("list");
    setSelectedVehicle(null);
  };

  const handleCreateVehicle = () => {
    setSelectedVehicle(null);
    setViewMode("create");
  };

  const handleVehicleSave = (vehicle: Vehicle) => {
    setViewMode("list");
    setSelectedVehicle(null);
  };

  const handleCancel = () => {
    setViewMode("list");
    setSelectedVehicle(null);
  };

  const handleBack = () => {
    setViewMode("list");
    setSelectedVehicle(null);
  };

  return (
    <AppShell>
      <div className="space-y-6">
        {viewMode === "list" && (
          <VehicleList
            onVehicleSelect={handleVehicleSelect}
            onVehicleEdit={handleVehicleEdit}
            onVehicleDelete={handleVehicleDelete}
            onCreateVehicle={handleCreateVehicle}
          />
        )}

        {viewMode === "create" && (
          <VehicleForm onSave={handleVehicleSave} onCancel={handleCancel} />
        )}

        {viewMode === "edit" && selectedVehicle && (
          <VehicleForm
            vehicle={selectedVehicle}
            onSave={handleVehicleSave}
            onCancel={handleCancel}
          />
        )}

        {viewMode === "details" && selectedVehicle && (
          <VehicleDetails
            vehicleId={selectedVehicle._id || selectedVehicle.id || ""}
            onBack={handleBack}
            onEdit={handleVehicleEdit}
          />
        )}
      </div>
    </AppShell>
  );
}
