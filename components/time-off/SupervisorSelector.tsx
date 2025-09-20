"use client";

import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { ChevronDown, User, Clock, CheckCircle } from "lucide-react";
import { employeeApi } from "@/lib/api";

interface Supervisor {
  id: string;
  name: string;
  email: string;
  department: string;
  position: string;
  isDirectManager: boolean;
  pendingApprovals: number;
  userRole: string;
  approvalLevel?: string;
}

interface SupervisorSelectorProps {
  value?: string;
  onChange: (supervisorId: string | undefined) => void;
  disabled?: boolean;
  required?: boolean;
}

export const SupervisorSelector: React.FC<SupervisorSelectorProps> = ({
  value,
  onChange,
  disabled = false,
  required = false,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  // Fetch eligible supervisors
  const {
    data: supervisors = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ["eligibleSupervisors"],
    queryFn: () => employeeApi.getEligibleSupervisors(),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  const selectedSupervisor = supervisors.find(
    (s: Supervisor) => s.id === value
  );

  const handleSelect = (supervisor: Supervisor) => {
    onChange(supervisor.id);
    setIsOpen(false);
  };

  const handleClear = () => {
    onChange(undefined);
    setIsOpen(false);
  };

  const getWorkloadColor = (pendingCount: number) => {
    if (pendingCount === 0) return "text-green-600";
    if (pendingCount <= 2) return "text-yellow-600";
    return "text-red-600";
  };

  const getWorkloadText = (pendingCount: number) => {
    if (pendingCount === 0) return "Available";
    if (pendingCount === 1) return "1 pending";
    return `${pendingCount} pending`;
  };

  if (isLoading) {
    return (
      <div className="relative">
        <div className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background">
          <div className="flex items-center space-x-2">
            <div className="animate-pulse h-4 w-4 bg-muted rounded"></div>
            <span className="text-muted-foreground">
              Loading supervisors...
            </span>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="relative">
        <div className="flex h-10 w-full rounded-md border border-destructive bg-background px-3 py-2 text-sm">
          <span className="text-destructive">Error loading supervisors</span>
        </div>
      </div>
    );
  }

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => !disabled && setIsOpen(!isOpen)}
        disabled={disabled}
        className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
      >
        <div className="flex items-center space-x-2">
          {selectedSupervisor ? (
            <>
              <User className="h-4 w-4 text-muted-foreground" />
              <div className="text-left">
                <div className="font-medium">{selectedSupervisor.name}</div>
                <div className="text-xs text-muted-foreground">
                  {selectedSupervisor.department}
                  {selectedSupervisor.isDirectManager && (
                    <span className="ml-2 inline-flex items-center rounded-full bg-blue-100 px-2 py-1/2 text-xs font-medium text-blue-800">
                      Direct Manager
                    </span>
                  )}
                </div>
              </div>
            </>
          ) : (
            <span className="text-muted-foreground">
              {required
                ? "Select supervisor *"
                : "Select supervisor (optional)"}
            </span>
          )}
        </div>
        <ChevronDown className="h-4 w-4 opacity-50" />
      </button>

      {isOpen && (
        <div className="absolute z-50 mt-1 w-full rounded-md border bg-popover p-1 shadow-md">
          <div className="max-h-60 overflow-auto">
            {!required && (
              <button
                type="button"
                onClick={handleClear}
                className="flex w-full items-center rounded-sm px-2 py-1.5 text-sm hover:bg-accent hover:text-accent-foreground"
              >
                <span className="text-muted-foreground">
                  No supervisor selected
                </span>
              </button>
            )}

            {supervisors.map((supervisor: Supervisor) => (
              <button
                key={supervisor.id}
                type="button"
                onClick={() => handleSelect(supervisor)}
                className="flex w-full items-center justify-between rounded-sm px-2 py-2 text-sm hover:bg-accent hover:text-accent-foreground"
              >
                <div className="flex items-center space-x-3">
                  <User className="h-4 w-4 text-muted-foreground" />
                  <div className="text-left">
                    <div className="font-medium">{supervisor.name}</div>
                    <div className="text-xs text-muted-foreground">
                      {supervisor.position} • {supervisor.department}
                    </div>
                    <div className="flex items-center space-x-2 mt-1">
                      {supervisor.isDirectManager && (
                        <span className="inline-flex items-center rounded-full bg-blue-100 px-2 py-1 text-xs font-medium text-blue-800">
                          <CheckCircle className="h-3 w-3 mr-1" />
                          Direct Manager
                        </span>
                      )}
                      <span className="inline-flex items-center rounded-full bg-gray-100 px-2 py-1 text-xs font-medium text-gray-800">
                        {supervisor.userRole === "admin"
                          ? "Admin"
                          : supervisor.approvalLevel === "level1"
                          ? "Level 1"
                          : "Approver"}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-1 text-right">
                  <Clock className="h-3 w-3 text-muted-foreground" />
                  <span
                    className={`text-xs font-medium ${getWorkloadColor(
                      supervisor.pendingApprovals
                    )}`}
                  >
                    {getWorkloadText(supervisor.pendingApprovals)}
                  </span>
                </div>
              </button>
            ))}
          </div>

          {supervisors.length === 0 && (
            <div className="px-2 py-1.5 text-sm text-muted-foreground">
              No eligible supervisors found
            </div>
          )}
        </div>
      )}

      {/* Click outside to close */}
      {isOpen && (
        <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
      )}
    </div>
  );
};
