export interface User {
    id: string
    email: string
    firstName?: string
    lastName?: string
    role: UserRole
    avatar?: string
    isActive?: boolean
    attributes?: {
        department?: string
        employee_id?: string
        approval_level?: string
        [key: string]: any
    }
    createdAt?: string
    updatedAt?: string
}

export type UserRole = "employee" | "approver" | "admin"

// API Response types
export interface LoginResponse {
    accessToken: string
    refreshToken: string
    user: {
        id: string
        email: string
        role: string
    }
}

export interface RefreshResponse {
    accessToken: string
}

export interface ApiErrorResponse {
    error: string | Record<string, string[]>
}

export interface Employee {
    _id?: string
    id?: string
    userId?: string
    name: string
    email: string
    phone?: string
    department?: string
    position?: string
    hireDate?: string
    contractType?: string
    salary?: number
    manager?: string
    documents?: {
        idCardUrl?: string
        resumeUrl?: string
        certificates?: string[]
    }
    user?: User
    createdAt: string
    updatedAt: string
}

export interface Contact {
    _id: string
    name: string
    email?: string
    phone?: string
    category: ContactCategory
    companyName?: string
    position?: string
    notes?: string
    createdBy: string
    createdAt: string
    updatedAt: string
}

export type ContactCategory = "supplier" | "service provider" | "customer" | "internal" | "other"

export interface LeaveRequest {
    id: string
    employeeId: string
    leaveTypeId: string
    startDate: string
    endDate: string
    days: number
    reason: string
    status: LeaveStatus
    supervisorId?: string
    level1ApprovalBy?: string
    level1ApprovalDate?: string
    level1ApprovalNotes?: string
    level2ApprovalBy?: string
    level2ApprovalDate?: string
    level2ApprovalNotes?: string
    employee: Employee
    leaveType: LeaveType
    supervisor?: Employee
    createdAt: string
    updatedAt: string
}

export type LeaveStatus = "submitted" | "approved_lvl1" | "approved_final" | "rejected" | "cancelled"

export interface LeaveType {
    id: string
    name: string
    description?: string
    maxDays: number
    carryOver: boolean
    isActive: boolean
    createdAt: string
    updatedAt: string
}

export interface LeaveBalance {
    id: string
    employeeId: string
    leaveTypeId: string
    year: number
    allocated: number
    used: number
    remaining: number
    employee: Employee
    leaveType: LeaveType
    createdAt: string
    updatedAt: string
}

export interface Document {
    id: string
    referenceNumber: string
    title: string
    description?: string
    category: DocumentCategory
    fileUrl: string
    fileName: string
    fileSize: number
    mimeType: string
    version: number
    uploadedBy: string
    expiryDate?: string
    isPublic: boolean
    tags?: string[]
    uploader: User
    createdAt: string
    updatedAt: string
}

export type DocumentCategory = "policy" | "procedure" | "form" | "report" | "contract" | "other"

export interface Notification {
    id: string
    recipientId: string
    senderId?: string
    type: "leave_request_submitted" | "leave_request_approved" | "leave_request_rejected" | "leave_request_cancelled" | "general"
    title: string
    message: string
    relatedEntityType?: "LeaveRequest" | "Employee" | "Document"
    relatedEntityId?: string
    isRead: boolean
    priority: "low" | "medium" | "high"
    actionUrl?: string
    metadata?: Record<string, any>
    expiresAt?: string
    createdAt: string
    updatedAt: string
}

export interface Vehicle {
    id: string
    make: string
    model: string
    year: number
    licensePlate: string
    vin?: string
    status: VehicleStatus
    assignedTo?: string
    fuelType: string
    mileage?: number
    lastServiceDate?: string
    nextServiceDate?: string
    insuranceExpiry?: string
    registrationExpiry?: string
    createdAt: string
    updatedAt: string
}

export type VehicleStatus = "available" | "assigned" | "maintenance" | "out_of_service"

export interface DashboardStats {
    totalEmployees: number
    totalContacts: number
    totalDocuments: number
    totalVehicles: number
    pendingLeaveRequests: number
    approvedLeaveRequests: number
    documentsExpiringSoon: number
    vehiclesNeedingService: number
}

export interface Notification {
    id: string
    title: string
    message: string
    type: NotificationType
    isRead: boolean
    userId: string
    createdAt: string
}

export type NotificationType = "info" | "success" | "warning" | "error"

export interface ApiResponse<T> {
    success: boolean
    data?: T
    message?: string
    errors?: Record<string, string[]>
}

export interface PaginatedResponse<T> {
    data: T[]
    total: number
    page: number
    limit: number
    totalPages: number
}

export interface SearchFilters {
    query?: string
    page?: number
    limit?: number
    sortBy?: string
    sortOrder?: "asc" | "desc"
    [key: string]: any
}
