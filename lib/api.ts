// API configuration and base client
// Use full origin only on the server. In the browser, use relative paths so
// Set-Cookie headers apply to the frontend domain and middleware can read them.
const API_BASE_URL = typeof window === 'undefined'
    ? (process.env.NEXT_PUBLIC_BACKEND_ORIGIN || '')
    : '';

export class ApiError extends Error {
    constructor(
        message: string,
        public status: number,
        public data?: any
    ) {
        super(message);
        this.name = 'ApiError';
    }
}

interface ApiRequestOptions {
    method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
    headers?: Record<string, string>;
    body?: any;
    token?: string;
    skipRetry?: boolean; // Skip automatic retry on 401
}

// Request queue for handling concurrent requests during token refresh
let isRefreshing = false;
let refreshPromise: Promise<boolean> | null = null;
const requestQueue: Array<() => void> = [];

async function apiRequest<T>(
    endpoint: string,
    options: ApiRequestOptions = {}
): Promise<T> {
    const { method = 'GET', headers = {}, body, token, skipRetry = false } = options;

    const makeRequest = async (): Promise<Response> => {
        const config: RequestInit = {
            method,
            headers: {
                'Content-Type': 'application/json',
                ...headers,
            },
            credentials: 'include', // Include cookies
        };

        // Add authorization header if token is provided (fallback for non-cookie auth)
        if (token) {
            config.headers = {
                ...config.headers,
                'Authorization': `Bearer ${token}`,
            };
        }

        // Add body if provided
        if (body) {
            config.body = JSON.stringify(body);
        }

        return fetch(`${API_BASE_URL}/api${endpoint}`, config);
    };

    try {
        let response = await makeRequest();

        // Handle 401 errors with automatic token refresh
        if (response.status === 401 && !skipRetry && !endpoint.includes('/auth/')) {
            if (isRefreshing) {
                await new Promise<void>((resolve) => {
                    requestQueue.push(resolve);
                });
                response = await makeRequest();
            } else {
                isRefreshing = true;
                refreshPromise = refreshTokens();

                try {
                    const refreshSuccess = await refreshPromise;
                    if (refreshSuccess) {
                        response = await makeRequest();
                    } else {
                        window.location.href = '/login';
                        throw new ApiError('Session expired', 401);
                    }
                } finally {
                    isRefreshing = false;
                    refreshPromise = null;
                    requestQueue.forEach(resolve => resolve());
                    requestQueue.length = 0;
                }
            }
        }

        const contentType = response.headers.get('content-type');
        if (!contentType?.includes('application/json')) {
            if (!response.ok) {
                throw new ApiError(
                    `HTTP ${response.status}: ${response.statusText}`,
                    response.status
                );
            }
            return {} as T;
        }

        const data = await response.json();

        if (!response.ok) {
            throw new ApiError(
                data.error || `HTTP ${response.status}: ${response.statusText}`,
                response.status,
                data
            );
        }

        return data;
    } catch (error) {
        if (error instanceof ApiError) {
            throw error;
        }

        throw new ApiError(
            error instanceof Error ? error.message : 'Network error occurred',
            0
        );
    }
}

// Token refresh function
async function refreshTokens(): Promise<boolean> {
    try {
        const response = await fetch(`${API_BASE_URL}/api/auth/refresh`, {
            method: 'POST',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({}),
        });

        return response.ok;
    } catch (error) {
        console.error('Token refresh failed:', error);
        return false;
    }
}

// Auth API endpoints
export const authApi = {
    login: async (email: string, password: string) => {
        return apiRequest<{
            user: {
                id: string;
                email: string;
                role: string;
            };
        }>(`/auth/login`, {
            method: 'POST',
            body: { email, password },
            skipRetry: true,
        });
    },

    register: async (email: string, password: string, role?: string) => {
        return apiRequest<{
            id: string;
            email: string;
            role: string;
            attributes: any;
        }>(`/auth/register`, {
            method: 'POST',
            body: { email, password, role },
            skipRetry: true,
        });
    },

    refresh: async (refreshToken?: string) => {
        return apiRequest<{
            success: boolean;
        }>(`/auth/refresh`, {
            method: 'POST',
            body: refreshToken ? { refreshToken } : {},
            skipRetry: true,
        });
    },

    logout: async () => {
        return apiRequest<{
            success: boolean;
            message: string;
        }>(`/auth/logout`, {
            method: 'POST',
            body: {},
            skipRetry: true,
        });
    },
};

// The rest of endpoints already use '/time-off', '/contacts', etc., which now resolve under '/api'
// No further changes needed because apiRequest prefixes with '/api'

export const employeeApi = {
    getAll: async (token?: string) => {
        return apiRequest<any[]>(`/employees`, {
            method: 'GET',
            token,
        });
    },

    getEligibleSupervisors: async () => {
        return apiRequest<any[]>(`/employees/eligible-supervisors`, {
            method: 'GET',
        });
    },

    getById: async (id: string, token?: string) => {
        return apiRequest<any>(`/employees/${id}`, {
            method: 'GET',
            token,
        });
    },

    create: async (employeeData: any, token?: string) => {
        return apiRequest<any>(`/employees`, {
            method: 'POST',
            body: employeeData,
            token,
        });
    },

    update: async (id: string, employeeData: any, token?: string) => {
        return apiRequest<any>(`/employees/${id}`, {
            method: 'PUT',
            body: employeeData,
            token,
        });
    },

    delete: async (id: string, token?: string) => {
        return apiRequest<any>(`/employees/${id}`, {
            method: 'DELETE',
            token,
        });
    },

    createWithUser: async (employeeData: any, token?: string) => {
        return apiRequest<any>(`/employees/create-with-user`, {
            method: 'POST',
            body: employeeData,
            token,
        });
    },

    initializeLeaveBalances: async (employeeId: string, year?: number, token?: string) => {
        return apiRequest<{
            success: boolean;
            message: string;
            employee: {
                id: string;
                name: string;
                email: string;
                department: string;
            };
            balancesCreated: number;
            year: number;
        }>(`/employees/${employeeId}/initialize-leave-balances`, {
            method: 'POST',
            body: year ? { year } : {},
            token,
        });
    },

    uploadDocument: async (employeeId: string, file: File, documentType: string, documentName?: string, token?: string) => {
        const formData = new FormData();
        formData.append('document', file);
        formData.append('documentType', documentType);
        if (documentName) {
            formData.append('documentName', documentName);
        }

        const response = await fetch(`${API_BASE_URL}/api/employees/${employeeId}/documents/upload`, {
            method: 'POST',
            headers: {
                'Authorization': token ? `Bearer ${token}` : '',
            },
            body: formData,
            credentials: 'include',
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new ApiError(
                errorData.error || 'Upload failed',
                response.status,
                errorData
            );
        }

        return response.json();
    },

    deleteDocument: async (employeeId: string, documentType: string, documentIndex?: number, token?: string) => {
        return apiRequest<any>(`/employees/${employeeId}/documents`, {
            method: 'DELETE',
            body: { documentType, documentIndex },
            token,
        });
    },

    getDocumentUrl: (filename: string) => {
        return `/api/uploads/documents/${filename}`;
    },
};

export const contactApi = {
    getAll: async (params?: { search?: string; category?: string }, token?: string) => {
        const searchParams = new URLSearchParams();
        if (params?.search) searchParams.set('search', params.search);
        if (params?.category) searchParams.set('category', params.category);

        const queryString = searchParams.toString();
        const endpoint = queryString ? `/contacts?${queryString}` : '/contacts';

        return apiRequest<any[]>(endpoint, {
            method: 'GET',
            token,
        });
    },

    getById: async (id: string, token?: string) => {
        return apiRequest<any>(`/contacts/${id}`, {
            method: 'GET',
            token,
        });
    },

    create: async (contactData: any, token?: string) => {
        return apiRequest<any>('/contacts', {
            method: 'POST',
            body: contactData,
            token,
        });
    },

    update: async (id: string, contactData: any, token?: string) => {
        return apiRequest<any>(`/contacts/${id}`, {
            method: 'PUT',
            body: contactData,
            token,
        });
    },

    delete: async (id: string, token?: string) => {
        return apiRequest<any>(`/contacts/${id}`, {
            method: 'DELETE',
            token,
        });
    },
};

// ---------------- Transfers API ----------------
export const transferApi = {
    create: async (data: {
        title: string;
        description?: string;
        password?: string;
        expiresAt?: string;
        maxDownloads?: number;
        files: File[];
        paths?: string[];
    }, onProgress?: (progress: number) => void) => {
        const formData = new FormData();
        formData.append('title', data.title);
        if (data.description) formData.append('description', data.description);
        if (data.password) formData.append('password', data.password);
        if (data.expiresAt) formData.append('expiresAt', data.expiresAt);
        if (typeof data.maxDownloads === 'number') formData.append('maxDownloads', String(data.maxDownloads));
        for (const f of data.files) formData.append('files', f);
        if (data.paths && data.paths.length) for (const p of data.paths) formData.append('paths', p);

        return new Promise((resolve, reject) => {
            const xhr = new XMLHttpRequest();

            xhr.upload.addEventListener('progress', (event) => {
                if (event.lengthComputable && onProgress) {
                    const progress = Math.round((event.loaded / event.total) * 100);
                    onProgress(progress);
                }
            });

            xhr.addEventListener('load', () => {
                if (xhr.status >= 200 && xhr.status < 300) {
                    try {
                        const response = JSON.parse(xhr.responseText);
                        resolve(response);
                    } catch (error) {
                        reject(new ApiError('Invalid response format', xhr.status));
                    }
                } else {
                    try {
                        const errorData = JSON.parse(xhr.responseText);
                        reject(new ApiError(errorData.error || 'Create transfer failed', xhr.status, errorData));
                    } catch {
                        reject(new ApiError('Create transfer failed', xhr.status));
                    }
                }
            });

            xhr.addEventListener('error', () => {
                reject(new ApiError('Network error', 0));
            });

            xhr.addEventListener('abort', () => {
                reject(new ApiError('Upload cancelled', 0));
            });

            xhr.open('POST', `${API_BASE_URL}/api/transfers`);
            xhr.withCredentials = true;
            xhr.send(formData);
        });
    },

    listMy: async () => {
        return apiRequest(`/transfers`, { method: 'GET' });
    },

    resolve: async (shortCode: string) => {
        return apiRequest(`/transfers/${shortCode}/resolve`, { method: 'GET' });
    },

    requestAccess: async (shortCode: string, password?: string) => {
        return apiRequest(`/transfers/${shortCode}/access`, {
            method: 'POST',
            body: password ? { password } : {},
        });
    },

    delete: async (id: string) => {
        return apiRequest(`/transfers/${id}`, { method: 'DELETE' });
    },
};

export const leaveRequestApi = {
    getAll: async (params?: { status?: string; startDate?: string; endDate?: string; pending?: boolean, supervisorId?: string }) => {
        const searchParams = new URLSearchParams();
        if (params?.status) searchParams.set('status', params.status);
        if (params?.startDate) searchParams.set('startDate', params.startDate);
        if (params?.endDate) searchParams.set('endDate', params.endDate);
        if (params?.pending) searchParams.set('pending', 'true');
        if (params?.supervisorId) searchParams.set('supervisorId', params.supervisorId);

        const queryString = searchParams.toString();
        const endpoint = queryString ? `/time-off/requests?${queryString}` : '/time-off/requests';

        return apiRequest<any[]>(endpoint, {
            method: 'GET',
        });
    },

    getById: async (id: string, token?: string) => {
        return apiRequest<any>(`/time-off/requests/${id}`, {
            method: 'GET',
            token,
        });
    },

    create: async (requestData: any, token?: string) => {
        return apiRequest<any>('/time-off/requests', {
            method: 'POST',
            body: requestData,
            token,
        });
    },

    update: async (id: string, requestData: any, token?: string) => {
        return apiRequest<any>(`/time-off/requests/${id}`, {
            method: 'PUT',
            body: requestData,
            token,
        });
    },

    cancel: async (id: string, token?: string) => {
        return apiRequest<any>(`/time-off/requests/${id}/cancel`, {
            method: 'DELETE',
            token,
        });
    },

    approve: async (id: string, approvalData: any, token?: string) => {
        return apiRequest<any>(`/time-off/requests/${id}/approve`, {
            method: 'POST',
            body: approvalData,
            token,
        });
    },

    undoFinal: async (id: string, token?: string) => {
        return apiRequest<any>(`/time-off/requests/${id}/undo-final`, {
            method: 'POST',
            token,
        });
    },

    close: async (id: string, closedOn: string, token?: string) => {
        return apiRequest<any>(`/time-off/requests/${id}/close`, {
            method: 'POST',
            body: { closedOn },
            token,
        });
    },
};

export const leaveTypeApi = {
    getAll: async (token?: string) => {
        return apiRequest<any[]>(`/time-off/leave-types`, {
            method: 'GET',
            token,
        });
    },

    getById: async (id: string, token?: string) => {
        return apiRequest<any>(`/time-off/leave-types/${id}`, {
            method: 'GET',
            token,
        });
    },
};

export const leaveBalanceApi = {
    getMy: async (token?: string) => {
        return apiRequest<any[]>(`/time-off/balances/me`, {
            method: 'GET',
            token,
        });
    },

    getByEmployee: async (employeeId: string, token?: string) => {
        return apiRequest<any[]>(`/time-off/balances/employee/${employeeId}`, {
            method: 'GET',
            token,
        });
    },
};

export const notificationApi = {
    getAll: async (params?: { page?: number; limit?: number; unreadOnly?: boolean; type?: string }) => {
        const searchParams = new URLSearchParams();
        if (params?.page) searchParams.set('page', params.page.toString());
        if (params?.limit) searchParams.set('limit', params.limit.toString());
        if (params?.unreadOnly) searchParams.set('unreadOnly', 'true');
        if (params?.type) searchParams.set('type', params.type);

        const queryString = searchParams.toString();
        const endpoint = queryString ? `/notifications?${queryString}` : '/notifications';

        return apiRequest<{
            notifications: any[];
            pagination: {
                page: number;
                limit: number;
                total: number;
                pages: number;
            };
            unreadCount: number;
        }>(endpoint, {
            method: 'GET',
        });
    },

    getUnreadCount: async () => {
        return apiRequest<{ unreadCount: number }>(`/notifications/unread-count`, {
            method: 'GET',
        });
    },

    markAsRead: async (data: { notificationIds?: string[]; markAll?: boolean }) => {
        return apiRequest<{ success: boolean; modifiedCount: number; message: string }>(`/notifications/mark-read`, {
            method: 'POST',
            body: data,
        });
    },

    delete: async (id: string) => {
        return apiRequest<any>(`/notifications/${id}`, {
            method: 'DELETE',
        });
    },
};

export const userApi = {
    getByEmployeeId: async (employeeId: string, token?: string) => {
        return apiRequest<any>(`/users/employee/${employeeId}`, {
            method: 'GET',
            token,
        });
    },

    updateByEmployeeId: async (employeeId: string, data: any, token?: string) => {
        return apiRequest<any>(`/users/employee/${employeeId}`, {
            method: 'PUT',
            body: data,
            token,
        });
    },

    resetPasswordByEmployeeId: async (employeeId: string, newPassword: string, token?: string) => {
        return apiRequest<{ message: string }>(`/users/employee/${employeeId}/reset-password`, {
            method: 'POST',
            body: { newPassword },
            token,
        });
    },
};

export const vehicleApi = {
    getAll: async (params?: { search?: string; status?: string; assignedTo?: string; project?: string }, token?: string) => {
        const searchParams = new URLSearchParams();
        if (params?.search) searchParams.set('search', params.search);
        if (params?.status) searchParams.set('status', params.status);
        if (params?.assignedTo) searchParams.set('assignedTo', params.assignedTo);
        if (params?.project) searchParams.set('project', params.project);

        const queryString = searchParams.toString();
        const endpoint = queryString ? `/vehicles?${queryString}` : '/vehicles';

        return apiRequest<{ vehicles: any[] }>(endpoint, {
            method: 'GET',
            token,
        });
    },

    getById: async (id: string, token?: string) => {
        return apiRequest<{ vehicle: any }>(`/vehicles/${id}`, {
            method: 'GET',
            token,
        });
    },

    create: async (vehicleData: any, token?: string) => {
        return apiRequest<{ vehicle: any }>('/vehicles', {
            method: 'POST',
            body: vehicleData,
            token,
        });
    },

    update: async (id: string, vehicleData: any, token?: string) => {
        return apiRequest<{ vehicle: any }>(`/vehicles/${id}`, {
            method: 'PUT',
            body: vehicleData,
            token,
        });
    },

    delete: async (id: string, token?: string) => {
        return apiRequest<any>(`/vehicles/${id}`, {
            method: 'DELETE',
            token,
        });
    },

    getAssignmentStatus: async (token?: string) => {
        return apiRequest<{
            assignedVehicles: any[];
            unassignedVehicles: any[];
            statusCounts: {
                active: number;
                inMaintenance: number;
                retired: number;
            };
        }>('/vehicles/assignment-status', {
            method: 'GET',
            token,
        });
    },

    uploadDocument: async (vehicleId: string, file: File, documentType?: string, documentName?: string, token?: string) => {
        const formData = new FormData();
        formData.append('document', file);
        if (documentType) formData.append('documentType', documentType);
        if (documentName) formData.append('documentName', documentName);

        const response = await fetch(`${API_BASE_URL}/api/vehicles/${vehicleId}/documents`, {
            method: 'POST',
            headers: {
                'Authorization': token ? `Bearer ${token}` : '',
            },
            body: formData,
            credentials: 'include',
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new ApiError(
                errorData.error || 'Upload failed',
                response.status,
                errorData
            );
        }

        return response.json();
    },

    deleteDocument: async (vehicleId: string, documentId: string, token?: string) => {
        return apiRequest<any>(`/vehicles/${vehicleId}/documents/${documentId}`, {
            method: 'DELETE',
            token,
        });
    },

    addServiceRecord: async (vehicleId: string, serviceData: { serviceDate: string; notes?: string }, token?: string) => {
        return apiRequest<any>(`/vehicles/${vehicleId}/service`, {
            method: 'POST',
            body: serviceData,
            token,
        });
    },

    updateStatus: async (vehicleId: string, status: 'active' | 'in maintenance' | 'retired', token?: string) => {
        return apiRequest<any>(`/vehicles/${vehicleId}/status`, {
            method: 'PUT',
            body: { status },
            token,
        });
    },
};

// QMS API functions
export const qmsApi = {
    // Dashboard and Overview
    getDashboard: async (token?: string) => {
        return apiRequest<any>('/qms/dashboard', {
            method: 'GET',
            token,
        });
    },

    getStatistics: async (params?: { startDate?: string; endDate?: string; department?: string }, token?: string) => {
        const queryParams = new URLSearchParams();
        if (params?.startDate) queryParams.append('startDate', params.startDate);
        if (params?.endDate) queryParams.append('endDate', params.endDate);
        if (params?.department) queryParams.append('department', params.department);

        return apiRequest<any>(`/qms/statistics?${queryParams}`, {
            method: 'GET',
            token,
        });
    },

    searchQMS: async (query: string, modules?: string[], limit?: number, token?: string) => {
        const queryParams = new URLSearchParams();
        queryParams.append('query', query);
        if (modules) queryParams.append('modules', modules.join(','));
        if (limit) queryParams.append('limit', limit.toString());

        return apiRequest<any>(`/qms/search?${queryParams}`, {
            method: 'GET',
            token,
        });
    },

    getUserTasks: async (token?: string) => {
        return apiRequest<any>('/qms/tasks', {
            method: 'GET',
            token,
        });
    },
};

// QMS Document API functions
export const qmsDocumentApi = {
    getAll: async (params?: {
        page?: number;
        limit?: number;
        status?: string;
        documentType?: string;
        department?: string;
        search?: string;
        sortBy?: string;
        sortOrder?: string;
    }, token?: string) => {
        const queryParams = new URLSearchParams();
        if (params?.page) queryParams.append('page', params.page.toString());
        if (params?.limit) queryParams.append('limit', params.limit.toString());
        if (params?.status) queryParams.append('status', params.status);
        if (params?.documentType) queryParams.append('documentType', params.documentType);
        if (params?.department) queryParams.append('department', params.department);
        if (params?.search) queryParams.append('search', params.search);
        if (params?.sortBy) queryParams.append('sortBy', params.sortBy);
        if (params?.sortOrder) queryParams.append('sortOrder', params.sortOrder);

        return apiRequest<any>(`/qms/documents?${queryParams}`, {
            method: 'GET',
            token,
        });
    },

    getById: async (id: string, token?: string) => {
        return apiRequest<any>(`/qms/documents/${id}`, {
            method: 'GET',
            token,
        });
    },

    create: async (documentData: FormData, token?: string) => {
        return apiRequest<any>('/qms/documents', {
            method: 'POST',
            body: documentData,
            token,
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
    },

    update: async (id: string, documentData: FormData, token?: string) => {
        return apiRequest<any>(`/qms/documents/${id}`, {
            method: 'PUT',
            body: documentData,
            token,
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
    },

    submitForReview: async (id: string, token?: string) => {
        return apiRequest<any>(`/qms/documents/${id}/submit-for-review`, {
            method: 'POST',
            token,
        });
    },

    approve: async (id: string, approvalComments?: string, token?: string) => {
        return apiRequest<any>(`/qms/documents/${id}/approve`, {
            method: 'POST',
            body: { approvalComments },
            token,
        });
    },

    obsolete: async (id: string, obsoleteReason?: string, token?: string) => {
        return apiRequest<any>(`/qms/documents/${id}/obsolete`, {
            method: 'POST',
            body: { obsoleteReason },
            token,
        });
    },

    delete: async (id: string, token?: string) => {
        return apiRequest<any>(`/qms/documents/${id}`, {
            method: 'DELETE',
            token,
        });
    },

    getDueForReview: async (days?: number, token?: string) => {
        const queryParams = new URLSearchParams();
        if (days) queryParams.append('days', days.toString());

        return apiRequest<any>(`/qms/documents/due-for-review?${queryParams}`, {
            method: 'GET',
            token,
        });
    },
};

export const api = {
    get: <T>(endpoint: string, token?: string) =>
        apiRequest<T>(endpoint, { method: 'GET', token }),

    post: <T>(endpoint: string, body: any, token?: string) =>
        apiRequest<T>(endpoint, { method: 'POST', body, token }),

    put: <T>(endpoint: string, body: any, token?: string) =>
        apiRequest<T>(endpoint, { method: 'PUT', body, token }),

    delete: <T>(endpoint: string, token?: string) =>
        apiRequest<T>(endpoint, { method: 'DELETE', token }),
};

export default api;
