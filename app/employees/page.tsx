"use client";

import React, { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Search,
  Plus,
  Mail,
  Phone,
  MapPin,
  Loader2,
  AlertCircle,
  Grid,
  List,
  Filter,
} from "lucide-react";
import { Employee } from "@/types";
import { getInitials } from "@/lib/utils";
import { employeeApi } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";
import { AddEmployeeModal } from "@/components/employees/AddEmployeeModal";
import {
  FilterModal,
  EmployeeFilters,
} from "@/components/employees/FilterModal";

const EmployeeCard: React.FC<{
  employee: Employee;
  onViewDetails: (employee: Employee) => void;
}> = ({ employee, onViewDetails }) => {
  // Get employee ID from _id or id field
  const employeeId = employee._id || employee.id;

  return (
    <Card
      className="hover:shadow-md transition-shadow cursor-pointer h-full"
      onClick={() => onViewDetails(employee)}
    >
      <CardContent className="p-4 sm:p-6 h-full flex flex-col">
        <div className="flex items-start space-x-3 sm:space-x-4">
          <Avatar className="h-10 w-10 sm:h-12 sm:w-12 flex-shrink-0">
            <AvatarImage src={employee.user?.avatar} />
            <AvatarFallback className="text-sm sm:text-base">
              {getInitials(employee.name)}
            </AvatarFallback>
          </Avatar>

          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2">
              <div className="flex-1 min-w-0">
                <h3 className="text-sm sm:text-lg font-semibold truncate">
                  {employee.name}
                </h3>
                <p className="text-xs sm:text-sm text-muted-foreground truncate">
                  {employee.position || "No position assigned"}
                </p>
              </div>
              <span className="inline-flex items-center px-2 py-1 sm:px-2.5 sm:py-0.5 rounded-full text-xs font-medium bg-primary/10 text-primary flex-shrink-0">
                {employee.user?.role || "employee"}
              </span>
            </div>

            <div className="mt-3 sm:mt-4 space-y-1.5 sm:space-y-2">
              <div className="flex items-center text-xs sm:text-sm text-muted-foreground">
                <Mail className="h-3 w-3 sm:h-4 sm:w-4 mr-2 flex-shrink-0" />
                <span className="truncate">{employee.email}</span>
              </div>

              {employee.phone && (
                <div className="flex items-center text-xs sm:text-sm text-muted-foreground">
                  <Phone className="h-3 w-3 sm:h-4 sm:w-4 mr-2 flex-shrink-0" />
                  <span className="truncate">{employee.phone}</span>
                </div>
              )}

              {employee.department && (
                <div className="flex items-center text-xs sm:text-sm text-muted-foreground">
                  <MapPin className="h-3 w-3 sm:h-4 sm:w-4 mr-2 flex-shrink-0" />
                  <span className="truncate">{employee.department}</span>
                </div>
              )}

              {/* <div className="hidden sm:flex items-center text-sm text-muted-foreground">
                <span className="font-medium">Employee ID:</span>
                <span className="ml-1 truncate">{employeeId}</span>
              </div> */}

              {employee.manager && (
                <div className="hidden md:flex items-center text-sm text-muted-foreground">
                  <span className="font-medium">Manager:</span>
                  <span className="ml-1 truncate">{employee.manager}</span>
                </div>
              )}

              {employee.hireDate && (
                <div className="hidden lg:flex items-center text-sm text-muted-foreground">
                  <span className="font-medium">Hire Date:</span>
                  <span className="ml-1">
                    {new Date(employee.hireDate).toLocaleDateString()}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

const EmployeeListItem: React.FC<{
  employee: Employee;
  onViewDetails: (employee: Employee) => void;
}> = ({ employee, onViewDetails }) => {
  // Get employee ID from _id or id field
  const employeeId = employee._id || employee.id;

  return (
    <Card
      className="hover:shadow-sm transition-shadow cursor-pointer"
      onClick={() => onViewDetails(employee)}
    >
      <CardContent className="p-4">
        <div className="flex items-center space-x-3">
          <Avatar className="h-10 w-10 flex-shrink-0">
            <AvatarImage src={employee.user?.avatar} />
            <AvatarFallback className="text-sm">
              {getInitials(employee.name)}
            </AvatarFallback>
          </Avatar>

          <div className="flex-1 min-w-0">
            {/* Mobile and Tablet Layout */}
            <div className="block">
              <div className="flex items-start justify-between">
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-sm truncate">
                    {employee.name}
                  </h3>
                  <p className="text-xs text-muted-foreground truncate">
                    {employee.position || "No position assigned"}
                  </p>
                </div>
                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary ml-2 flex-shrink-0">
                  {employee.user?.role || "employee"}
                </span>
              </div>

              {/* Details row - responsive */}
              <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted-foreground">
                <div className="flex items-center space-x-1">
                  <Mail className="h-3 w-3 flex-shrink-0" />
                  <span className="truncate max-w-[200px] sm:max-w-[300px]">
                    {employee.email}
                  </span>
                </div>

                {employee.phone && (
                  <div className="hidden sm:flex items-center space-x-1">
                    <Phone className="h-3 w-3 flex-shrink-0" />
                    <span>{employee.phone}</span>
                  </div>
                )}

                {employee.department && (
                  <div className="hidden md:flex items-center space-x-1">
                    <MapPin className="h-3 w-3 flex-shrink-0" />
                    <span>{employee.department}</span>
                  </div>
                )}
              </div>

              {/* Mobile-only second row for additional info */}
              <div className="mt-1 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted-foreground sm:hidden">
                {employee.phone && (
                  <div className="flex items-center space-x-1">
                    <Phone className="h-3 w-3 flex-shrink-0" />
                    <span>{employee.phone}</span>
                  </div>
                )}
                {employee.department && (
                  <div className="flex items-center space-x-1">
                    <MapPin className="h-3 w-3 flex-shrink-0" />
                    <span className="truncate">{employee.department}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

type ViewType = "list" | "grid";

export default function EmployeesPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [viewType, setViewType] = useState<ViewType>("list"); // Default to list view
  const [showAddModal, setShowAddModal] = useState(false);
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [filters, setFilters] = useState<EmployeeFilters>({
    department: "",
    position: "",
    role: "",
    contractType: "",
  });

  const { user } = useAuth();
  const router = useRouter();

  const handleViewDetails = (employee: Employee) => {
    const employeeId = employee._id || employee.id;
    router.push(`/employees/${employeeId}`);
  };

  const handleAddEmployee = () => {
    setShowAddModal(true);
  };

  // Fetch employees using React Query
  const {
    data: employees = [],
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ["employees"],
    queryFn: () =>
      employeeApi.getAll(localStorage.getItem("access_token") || undefined),
    enabled: !!user, // Only fetch if user is authenticated
  });

  // Filter employees based on search term and filters
  const filteredEmployees = useMemo(() => {
    return employees.filter((employee: Employee) => {
      // Search term filter
      const searchLower = searchTerm.toLowerCase();
      const matchesSearch =
        !searchTerm ||
        employee.name?.toLowerCase().includes(searchLower) ||
        employee.email?.toLowerCase().includes(searchLower) ||
        employee.department?.toLowerCase().includes(searchLower) ||
        employee.position?.toLowerCase().includes(searchLower) ||
        employee.phone?.toLowerCase().includes(searchLower);

      // Advanced filters
      const matchesDepartment =
        !filters.department ||
        employee.department
          ?.toLowerCase()
          .includes(filters.department.toLowerCase());

      const matchesPosition =
        !filters.position ||
        employee.position
          ?.toLowerCase()
          .includes(filters.position.toLowerCase());

      const matchesRole = !filters.role || employee.user?.role === filters.role;

      const matchesContractType =
        !filters.contractType || employee.contractType === filters.contractType;

      return (
        matchesSearch &&
        matchesDepartment &&
        matchesPosition &&
        matchesRole &&
        matchesContractType
      );
    });
  }, [employees, searchTerm, filters]);

  // Check if any filters are active
  const hasActiveFilters = Object.values(filters).some((value) => value !== "");

  return (
    <AppShell>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Employees</h1>
            <p className="text-muted-foreground">
              Manage and view employee information
            </p>
          </div>
          <Button onClick={handleAddEmployee}>
            <Plus className="h-4 w-4 mr-2" />
            Add Employee
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Employee Directory</CardTitle>
            <CardDescription>
              Search and filter through all employees
            </CardDescription>
          </CardHeader>

          <CardContent>
            <div className="flex items-center space-x-2 mb-6">
              <div className="relative flex-1">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search employees..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-8"
                />
              </div>
              <Button
                variant={hasActiveFilters ? "default" : "outline"}
                onClick={() => setShowFilterModal(true)}
              >
                <Filter className="h-4 w-4 mr-2" />
                Filter
                {hasActiveFilters && (
                  <span className="ml-1 bg-background text-foreground rounded-full px-1.5 py-0.5 text-xs">
                    {Object.values(filters).filter((v) => v !== "").length}
                  </span>
                )}
              </Button>

              {/* View toggle buttons */}
              <div className="flex items-center border rounded-md">
                <Button
                  variant={viewType === "list" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setViewType("list")}
                  className="rounded-r-none border-r"
                >
                  <List className="h-4 w-4" />
                </Button>
                <Button
                  variant={viewType === "grid" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setViewType("grid")}
                  className="rounded-l-none"
                >
                  <Grid className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Loading State */}
            {isLoading && (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
                <span className="ml-2 text-muted-foreground">
                  Loading employees...
                </span>
              </div>
            )}

            {/* Error State */}
            {error && (
              <div className="flex items-center justify-center py-8">
                <AlertCircle className="h-8 w-8 text-destructive mr-2" />
                <div className="text-center">
                  <p className="text-destructive font-medium">
                    Failed to load employees
                  </p>
                  <p className="text-sm text-muted-foreground mt-1">
                    {error instanceof Error
                      ? error.message
                      : "An error occurred"}
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
            )}

            {/* Employee Display */}
            {!isLoading && !error && (
              <>
                {viewType === "grid" ? (
                  <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                    {filteredEmployees.map((employee) => (
                      <EmployeeCard
                        key={employee._id || employee.id}
                        employee={employee}
                        onViewDetails={handleViewDetails}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="space-y-3">
                    {filteredEmployees.map((employee) => (
                      <EmployeeListItem
                        key={employee._id || employee.id}
                        employee={employee}
                        onViewDetails={handleViewDetails}
                      />
                    ))}
                  </div>
                )}

                {filteredEmployees.length === 0 && employees.length > 0 && (
                  <div className="text-center py-8">
                    <p className="text-muted-foreground">
                      No employees found matching your search.
                    </p>
                  </div>
                )}

                {filteredEmployees.length === 0 && employees.length === 0 && (
                  <div className="text-center py-8">
                    <p className="text-muted-foreground">
                      No employees have been added yet.
                    </p>
                  </div>
                )}
              </>
            )}
          </CardContent>
        </Card>

        {/* Modals */}
        <AddEmployeeModal open={showAddModal} onOpenChange={setShowAddModal} />

        <FilterModal
          open={showFilterModal}
          onOpenChange={setShowFilterModal}
          filters={filters}
          onFiltersChange={setFilters}
        />
      </div>
    </AppShell>
  );
}
