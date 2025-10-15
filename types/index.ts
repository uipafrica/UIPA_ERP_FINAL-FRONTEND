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
    // Dated flow
    startDate?: string
    endDate?: string
    days?: number
    // Non-dated flow
    occurredOn?: string
    isOpenEnded?: boolean
    closedOn?: string
    reportedOn?: string
    durationDays?: number
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

export type LeaveStatus = "submitted" | "approved_lvl1" | "approved_final" | "rejected" | "cancelled" | "reported"

export interface LeaveType {
    id: string
    name: string
    description?: string
    maxDays: number
    carryOver: boolean
    isActive: boolean
    // Policy flags (align with backend)
    requiresBalance?: boolean
    requiresDates?: boolean
    allowFutureApplications?: boolean
    isOpenEndedAllowed?: boolean
    maxRetroactiveDays?: number
    requiresAttachment?: boolean
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
    _id?: string
    id?: string
    name: string
    registrationNumber: string
    make?: string
    vehicleModel?: string
    year?: number
    mileage?: number
    fuelType?: string
    assignedTo?: {
        _id: string
        name: string
        email: string
        department: string
        position?: string
    }
    project?: string
    status: VehicleStatus
    insurance?: {
        provider?: string
        policyNumber?: string
        expiryDate?: string
    }
    serviceSchedule?: Array<{
        serviceDate: string
        notes?: string
    }>
    documents?: Array<{
        _id?: string
        type?: string
        name: string
        url: string
        publicId?: string
        originalName: string
        size: number
        mimeType: string
        uploadedBy: string
        uploadedAt: string
    }>
    createdAt: string
    updatedAt: string
}

export type VehicleStatus = "active" | "in maintenance" | "retired"

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

// ---------------- Transfers Module ----------------
export interface TransferFileMeta {
    id: string
    name: string
    size: number
}

export interface TransferMeta {
    shortCode: string
    title: string
    description?: string
    expired: boolean
    needsPassword: boolean
    files: TransferFileMeta[]
}

export interface TransferCreateResponse {
    id: string
    shortCode: string
    shareUrl: string
    expiresAt?: string
    files: TransferFileMeta[]
}

export interface TransferAccessResponse {
    token: string
    files: Array<TransferFileMeta & { url: string }>
    downloadAllUrl?: string
}

// QMS Types
export interface QMSDocument {
    _id: string;
    title: string;
    documentType: "policy" | "procedure" | "work_instruction" | "form" | "template";
    documentNumber: string;
    version: string;
    status: "draft" | "under_review" | "approved" | "obsolete";
    content: string;
    fileUrl?: string;
    fileName?: string;
    fileSize?: number;
    createdBy: User;
    reviewedBy?: User;
    approvedBy?: User;
    department: string;
    effectiveDate: string;
    reviewDate?: string;
    nextReviewDate: string;
    accessRights: {
        view: string[];
        edit: string[];
        approve: string[];
    };
    changeHistory: Array<{
        version: string;
        changedBy: string;
        changeDate: string;
        changeDescription: string;
        changeType: "created" | "updated" | "approved" | "obsoleted";
    }>;
    tags: string[];
    createdAt: string;
    updatedAt: string;
}

export interface NonConformance {
    _id: string;
    ncrNumber: string;
    title: string;
    description: string;
    category: "product" | "process" | "system" | "supplier" | "customer" | "other";
    severity: "minor" | "major" | "critical";
    status: "open" | "investigation" | "corrective_action" | "verification" | "closed";
    source: "internal_audit" | "customer_complaint" | "supplier_issue" | "process_monitoring" | "other";
    location: string;
    department: string;
    reportedBy: User;
    assignedTo?: User;
    affectedProducts?: string[];
    affectedProcesses?: string[];
    customerImpact: {
        affected: boolean;
        description?: string;
        customerNotification?: boolean;
    };
    immediateActions: Array<{
        action: string;
        takenBy: string;
        takenDate: string;
        effectiveness: "effective" | "partially_effective" | "ineffective";
    }>;
    rootCauseAnalysis: {
        method: "5_whys" | "fishbone" | "fault_tree" | "other";
        analysis: string;
        rootCause: string;
        analyzedBy: string;
        analysisDate: string;
    };
    correctiveActions: Array<{
        action: string;
        responsible: string;
        dueDate: string;
        completedDate?: string;
        status: "pending" | "in_progress" | "completed" | "overdue";
        evidence?: string;
    }>;
    preventiveActions: Array<{
        action: string;
        responsible: string;
        dueDate: string;
        completedDate?: string;
        status: "pending" | "in_progress" | "completed" | "overdue";
        evidence?: string;
    }>;
    verification: {
        verifiedBy?: string;
        verificationDate?: string;
        verificationMethod?: string;
        effectiveness?: "effective" | "partially_effective" | "ineffective";
        comments?: string;
    };
    closure: {
        closedBy?: string;
        closureDate?: string;
        closureReason?: string;
        lessonsLearned?: string;
    };
    relatedDocuments: string[];
    attachments: Array<{
        fileName: string;
        fileUrl: string;
        uploadedBy: string;
        uploadedDate: string;
    }>;
    createdAt: string;
    updatedAt: string;
}

export interface CAPA {
    _id: string;
    capaNumber: string;
    title: string;
    description: string;
    type: "corrective" | "preventive";
    source: "ncr" | "audit" | "customer_complaint" | "management_review" | "other";
    sourceReference?: string;
    priority: "low" | "medium" | "high" | "critical";
    status: "initiated" | "investigation" | "planning" | "implementation" | "verification" | "closed";
    initiatedBy: User;
    assignedTo: User;
    teamMembers: string[];
    problemStatement: string;
    scope: string;
    impactAssessment: {
        affectedProcesses: string[];
        affectedProducts: string[];
        affectedCustomers: string[];
        businessImpact: "low" | "medium" | "high" | "critical";
        description: string;
    };
    rootCauseAnalysis: {
        method: "5_whys" | "fishbone" | "fault_tree" | "pareto" | "other";
        analysis: string;
        identifiedRootCauses: string[];
        verifiedBy: string;
        verificationDate: string;
    };
    actionPlan: Array<{
        action: string;
        responsible: string;
        dueDate: string;
        completedDate?: string;
        status: "pending" | "in_progress" | "completed" | "overdue";
        resources: string[];
        budget?: number;
        evidence?: string;
        effectiveness?: "effective" | "partially_effective" | "ineffective";
    }>;
    effectivenessVerification: {
        method?: string;
        verifiedBy?: string;
        verificationDate?: string;
        results?: string;
        effectiveness?: "effective" | "partially_effective" | "ineffective";
        followUpActions?: string;
    };
    preventiveMeasures: Array<{
        measure: string;
        responsible: string;
        dueDate: string;
        completedDate?: string;
        status: "pending" | "in_progress" | "completed" | "overdue";
        monitoringFrequency: string;
    }>;
    costBenefitAnalysis: {
        implementationCost: number;
        benefits: string;
        roi?: number;
        paybackPeriod?: string;
    };
    lessonsLearned: string;
    bestPractices: string[];
    relatedDocuments: string[];
    attachments: Array<{
        fileName: string;
        fileUrl: string;
        uploadedBy: string;
        uploadedDate: string;
    }>;
    timeline: Array<{
        milestone: string;
        plannedDate: string;
        actualDate?: string;
        status: "pending" | "completed" | "overdue";
        notes?: string;
    }>;
    createdAt: string;
    updatedAt: string;
}

export interface InternalAudit {
    _id: string;
    auditNumber: string;
    title: string;
    description: string;
    auditType: "internal" | "supplier" | "process" | "system" | "compliance";
    scope: string;
    objectives: string[];
    status: "planned" | "in_progress" | "completed" | "cancelled";
    plannedStartDate: string;
    plannedEndDate: string;
    actualStartDate?: string;
    actualEndDate?: string;
    leadAuditor: User;
    auditTeam: string[];
    auditee: {
        department: string;
        responsible: string;
        contactPerson: string;
    };
    auditCriteria: string[];
    checklist: Array<{
        item: string;
        requirement: string;
        responsible: string;
        status: "not_applicable" | "conform" | "minor_nonconformity" | "major_nonconformity" | "observation" | "not_checked";
        evidence: string;
        notes?: string;
        checkedDate?: string;
    }>;
    findings: Array<{
        findingNumber: string;
        description: string;
        criteria: string;
        severity: "observation" | "minor" | "major";
        category: "documentation" | "process" | "training" | "equipment" | "other";
        evidence: string;
        auditeeResponse?: string;
        correctiveAction?: {
            action: string;
            responsible: string;
            dueDate: string;
            status: "pending" | "in_progress" | "completed" | "overdue";
        };
        linkedNCR?: string;
        linkedCAPA?: string;
    }>;
    auditReport: {
        summary?: string;
        strengths?: string[];
        opportunities?: string[];
        recommendations?: string[];
        conclusion?: string;
        overallRating?: "excellent" | "good" | "satisfactory" | "needs_improvement" | "poor";
    };
    followUp: {
        required: boolean;
        dueDate?: string;
        responsible: string;
        status: "pending" | "in_progress" | "completed" | "overdue";
        verificationMethod?: string;
        closureDate?: string;
    };
    attachments: Array<{
        fileName: string;
        fileUrl: string;
        uploadedBy: string;
        uploadedDate: string;
    }>;
    createdAt: string;
    updatedAt: string;
}

export interface ManagementReview {
    _id: string;
    reviewNumber: string;
    title: string;
    reviewType: "annual" | "quarterly" | "monthly" | "ad_hoc";
    reviewDate: string;
    attendees: Array<{
        user: string;
        role: string;
        attendanceStatus: "present" | "absent" | "excused";
    }>;
    agenda: Array<{
        topic: string;
        presenter?: string;
        duration: number;
        status: "scheduled" | "completed" | "postponed" | "cancelled";
        notes?: string;
    }>;
    kpiReview: Array<{
        kpi: string;
        target: number;
        actual: number;
        unit: string;
        trend: "improving" | "stable" | "declining";
        analysis: string;
        actions?: string;
    }>;
    auditResults: Array<{
        auditId: string;
        summary: string;
        findings: number;
        nonConformities: number;
        status: "open" | "closed";
    }>;
    customerFeedback: {
        complaints: {
            total: number;
            resolved: number;
            pending: number;
            trend: "improving" | "stable" | "declining";
        };
        satisfaction: {
            score: number;
            target: number;
            trend: "improving" | "stable" | "declining";
        };
        keyIssues: string[];
    };
    resourceReview: {
        humanResources: {
            adequacy: "adequate" | "inadequate" | "excessive";
            needs: string[];
            training: string[];
        };
        infrastructure: {
            adequacy: "adequate" | "inadequate" | "excessive";
            needs: string[];
            maintenance: string[];
        };
        financial: {
            budget: number;
            actual: number;
            variance: number;
            needs: string[];
        };
    };
    processPerformance: Array<{
        process: string;
        effectiveness: "effective" | "partially_effective" | "ineffective";
        efficiency: "efficient" | "partially_efficient" | "inefficient";
        issues: string[];
        improvements: string[];
    }>;
    risksOpportunities: Array<{
        type: "risk" | "opportunity";
        description: string;
        impact: "low" | "medium" | "high" | "critical";
        probability: "low" | "medium" | "high";
        mitigation?: string;
        owner: string;
        status: "identified" | "assessed" | "mitigated" | "closed";
    }>;
    decisions: Array<{
        decision: string;
        rationale: string;
        responsible: string;
        dueDate: string;
        status: "pending" | "in_progress" | "completed" | "overdue";
    }>;
    actionItems: Array<{
        action: string;
        responsible: string;
        dueDate: string;
        completedDate?: string;
        status: "pending" | "in_progress" | "completed" | "overdue";
        priority: "low" | "medium" | "high" | "critical";
        notes?: string;
    }>;
    nextReview: {
        scheduledDate: string;
        agenda: string[];
        preparation: string[];
    };
    meetingMinutes: {
        content?: string;
        recordedBy?: string;
        approvedBy?: string;
        approvalDate?: string;
    };
    attachments: Array<{
        fileName: string;
        fileUrl: string;
        uploadedBy: string;
        uploadedDate: string;
    }>;
    createdAt: string;
    updatedAt: string;
}

export interface TrainingRecord {
    _id: string;
    trainingNumber: string;
    title: string;
    description: string;
    trainingType: "internal" | "external" | "online" | "on_the_job" | "certification";
    category: "safety" | "quality" | "technical" | "soft_skills" | "compliance" | "other";
    provider: string;
    instructor?: User;
    location: string;
    scheduledDate: string;
    duration: number;
    maxParticipants: number;
    status: "scheduled" | "in_progress" | "completed" | "cancelled";
    attendees: Array<{
        employee: string;
        registrationDate: string;
        attendanceStatus: "registered" | "attended" | "absent" | "partially_attended";
        completionStatus: "not_started" | "in_progress" | "completed" | "failed";
        score?: number;
        certificateUrl?: string;
        validUntil?: string;
        notes?: string;
    }>;
    materials: Array<{
        fileName: string;
        fileUrl: string;
        type: "presentation" | "handout" | "manual" | "video" | "other";
        uploadedBy: string;
        uploadedDate: string;
    }>;
    assessment: {
        required: boolean;
        type?: "quiz" | "practical" | "presentation" | "written" | "other";
        passingScore?: number;
        questions?: Array<{
            question: string;
            options?: string[];
            correctAnswer?: string;
            points: number;
        }>;
    };
    evaluation: {
        overallRating?: number;
        effectiveness?: number;
        instructorRating?: number;
        materialRating?: number;
        venueRating?: number;
        comments?: string;
        improvements?: string;
        evaluatedBy?: string;
        evaluationDate?: string;
    };
    followUp: {
        required: boolean;
        interval?: number;
        method?: "survey" | "assessment" | "observation" | "other";
        responsible: string;
        nextDue?: string;
    };
    cost: {
        total: number;
        breakdown: {
            instructor?: number;
            venue?: number;
            materials?: number;
            travel?: number;
            other?: number;
        };
    };
    objectives: string[];
    outcomes: string[];
    attachments: Array<{
        fileName: string;
        fileUrl: string;
        uploadedBy: string;
        uploadedDate: string;
    }>;
    createdAt: string;
    updatedAt: string;
}

export interface CustomerFeedback {
    _id: string;
    feedbackNumber: string;
    type: "complaint" | "compliment" | "suggestion" | "inquiry";
    source: "email" | "phone" | "website" | "social_media" | "survey" | "other";
    customer: {
        name: string;
        email?: string;
        phone?: string;
        company?: string;
        customerType: "individual" | "corporate" | "supplier" | "partner";
    };
    subject: string;
    description: string;
    category: "product_quality" | "service_delivery" | "communication" | "pricing" | "support" | "other";
    priority: "low" | "medium" | "high" | "urgent";
    status: "received" | "acknowledged" | "investigating" | "resolved" | "closed" | "escalated";
    assignedTo?: User;
    receivedDate: string;
    acknowledgedDate?: string;
    resolvedDate?: string;
    closureDate?: string;
    affectedProducts?: string[];
    affectedServices?: string[];
    impact: {
        customerSatisfaction: "positive" | "neutral" | "negative" | "severe";
        businessImpact: "low" | "medium" | "high" | "critical";
        financialImpact?: number;
        reputationRisk: "low" | "medium" | "high" | "critical";
    };
    investigation: {
        investigator?: string;
        startDate?: string;
        findings?: string;
        rootCause?: string;
        evidence?: string[];
        conclusion?: string;
    };
    response: {
        responseProvided?: string;
        responseMethod?: "email" | "phone" | "meeting" | "letter" | "other";
        responseDate?: string;
        responseBy?: string;
        customerSatisfied?: boolean;
        customerFeedback?: string;
    };
    correctiveActions: Array<{
        action: string;
        responsible: string;
        dueDate: string;
        completedDate?: string;
        status: "pending" | "in_progress" | "completed" | "overdue";
        evidence?: string;
    }>;
    preventiveActions: Array<{
        action: string;
        responsible: string;
        dueDate: string;
        completedDate?: string;
        status: "pending" | "in_progress" | "completed" | "overdue";
        evidence?: string;
    }>;
    linkedNCR?: string;
    linkedCAPA?: string;
    escalation: {
        escalated: boolean;
        escalatedTo?: string;
        escalationDate?: string;
        escalationReason?: string;
        resolution?: string;
    };
    followUp: {
        required: boolean;
        scheduledDate?: string;
        completedDate?: string;
        method?: "call" | "email" | "survey" | "meeting" | "other";
        responsible: string;
        outcome?: string;
    };
    attachments: Array<{
        fileName: string;
        fileUrl: string;
        uploadedBy: string;
        uploadedDate: string;
    }>;
    tags: string[];
    notes: string;
    createdAt: string;
    updatedAt: string;
}