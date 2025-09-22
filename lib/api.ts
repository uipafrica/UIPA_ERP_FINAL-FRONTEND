// API configuration and base client
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api';

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

        return fetch(`${API_BASE_URL}${endpoint}`, config);
    };

    try {
        let response = await makeRequest();

        // console.log("response", response);

        // Handle 401 errors with automatic token refresh
        if (response.status === 401 && !skipRetry && !endpoint.includes('/auth/')) {
            if (isRefreshing) {
                // If refresh is already in progress, wait for it
                await new Promise<void>((resolve) => {
                    requestQueue.push(resolve);
                });
                // Retry the original request
                response = await makeRequest();
            } else {
                // Start token refresh
                isRefreshing = true;
                refreshPromise = refreshTokens();

                try {
                    const refreshSuccess = await refreshPromise;
                    if (refreshSuccess) {
                        // Retry the original request
                        response = await makeRequest();
                    } else {
                        // Refresh failed, redirect to login
                        window.location.href = '/login';
                        throw new ApiError('Session expired', 401);
                    }
                } finally {
                    // Reset refresh state and resolve queued requests
                    isRefreshing = false;
                    refreshPromise = null;
                    requestQueue.forEach(resolve => resolve());
                    requestQueue.length = 0;
                }
            }
        }

        // Handle non-JSON responses
        const contentType = response.headers.get('content-type');
        if (!contentType?.includes('application/json')) {
            if (!response.ok) {
                throw new ApiError(
                    `HTTP ${response.status}: ${response.statusText}`,
                    response.status
                );
            }
            return {} as T; // Return empty object for non-JSON success responses
        }

        const data = await response.json();

        // console.log("data", data);

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

        // Network or other errors
        throw new ApiError(
            error instanceof Error ? error.message : 'Network error occurred',
            0
        );
    }
}

// Token refresh function
async function refreshTokens(): Promise<boolean> {
    try {
        const response = await fetch(`${API_BASE_URL}/auth/refresh`, {
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
        }>('/auth/login', {
            method: 'POST',
            body: { email, password },
            skipRetry: true, // Don't auto-retry auth endpoints
        });
    },

    register: async (email: string, password: string, role?: string) => {
        return apiRequest<{
            id: string;
            email: string;
            role: string;
            attributes: any;
        }>('/auth/register', {
            method: 'POST',
            body: { email, password, role },
            skipRetry: true,
        });
    },

    refresh: async (refreshToken?: string) => {
        return apiRequest<{
            success: boolean;
        }>('/auth/refresh', {
            method: 'POST',
            body: refreshToken ? { refreshToken } : {},
            skipRetry: true,
        });
    },

    logout: async () => {
        return apiRequest<{
            success: boolean;
            message: string;
        }>('/auth/logout', {
            method: 'POST',
            body: {},
            skipRetry: true,
        });
    },
};

// Employee API endpoints
export const employeeApi = {
    getAll: async (token?: string) => {
        return apiRequest<any[]>('/employees', {
            method: 'GET',
            token,
        });
    },

    getEligibleSupervisors: async () => {
        return apiRequest<any[]>('/employees/eligible-supervisors', {
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
        return apiRequest<any>('/employees', {
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
        return apiRequest<any>('/employees/create-with-user', {
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

    // Employee Document Management
    uploadDocument: async (employeeId: string, file: File, documentType: string, documentName?: string, token?: string) => {
        const formData = new FormData();
        formData.append('document', file);
        formData.append('documentType', documentType);
        if (documentName) {
            formData.append('documentName', documentName);
        }

        const response = await fetch(`${API_BASE_URL}/employees/${employeeId}/documents/upload`, {
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

    // Get document URL with authentication
    getDocumentUrl: (filename: string) => {
        const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api';
        return `${API_BASE_URL}/uploads/documents/${filename}`;
    },
};

// Contact API endpoints
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

// Leave Requests API endpoints
export const leaveRequestApi = {
    getAll: async (params?: { status?: string; startDate?: string; endDate?: string; pending?: boolean, supervisorId?: string }) => {
        const searchParams = new URLSearchParams();
        if (params?.status) searchParams.set('status', params.status);
        if (params?.startDate) searchParams.set('startDate', params.startDate);
        if (params?.endDate) searchParams.set('endDate', params.endDate);
        if (params?.pending) searchParams.set('pending', 'true');
        if (params?.supervisorId) searchParams.set('supervisorId', params.supervisorId);

        console.log("this is the search params", searchParams);

        const queryString = searchParams.toString();
        const endpoint = queryString ? `/time-off/requests?${queryString}` : '/time-off/requests';
        // console.log("endpoint", endpoint);

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
};

// Leave Types API endpoints
export const leaveTypeApi = {
    getAll: async (token?: string) => {
        return apiRequest<any[]>('/time-off/leave-types', {
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

// Leave Balances API endpoints
export const leaveBalanceApi = {
    getMy: async (token?: string) => {
        return apiRequest<any[]>('/time-off/balances/me', {
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

// Notification API endpoints
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
        return apiRequest<{ unreadCount: number }>('/notifications/unread-count', {
            method: 'GET',
        });
    },

    markAsRead: async (data: { notificationIds?: string[]; markAll?: boolean }) => {
        return apiRequest<{ success: boolean; modifiedCount: number; message: string }>('/notifications/mark-read', {
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

// User management API
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

// Generic API client for other endpoints
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
