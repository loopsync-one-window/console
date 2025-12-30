import { API_BASE_URL } from "./api";

const ADMIN_ACCESS_TOKEN_KEY = "admin.accessToken";
const ADMIN_USER_KEY = "admin.user";

const getAdminAccessToken = () => {
    if (typeof window !== 'undefined') {
        return localStorage.getItem(ADMIN_ACCESS_TOKEN_KEY);
    }
    return null;
};

// Error Class
export class AdminApiError extends Error {
    constructor(
        public statusCode: number,
        message: string,
        public timestamp: string
    ) {
        super(message);
        this.name = "AdminApiError";
    }
}

// Response Handler
const handleResponse = async (response: Response) => {
    const data = await response.json();

    if (!response.ok) {
        if (response.status === 401) {
            if (typeof window !== 'undefined') {
                localStorage.removeItem(ADMIN_ACCESS_TOKEN_KEY);
                localStorage.removeItem(ADMIN_USER_KEY);
                window.location.href = "/admin/auth";
                await new Promise(() => { }); // Halt execution
            }
        }
        throw new AdminApiError(
            data.statusCode || response.status,
            data.message || "An unexpected error occurred",
            data.timestamp || new Date().toISOString()
        );
    }

    return data;
};

// --- Auth APIs ---

export const loginAdmin = async (email: string, password: string) => {
    const response = await fetch(`${API_BASE_URL}/admin/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
    });
    // Don't use handleResponse here because we don't want auto-redirect on login failure 401
    const data = await response.json();
    if (!response.ok) {
        throw new Error(data.message || "Login failed");
    }
    return data;
};

export const registerAdmin = async (fullName: string, email: string, password: string) => {
    const response = await fetch(`${API_BASE_URL}/admin/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fullName, email, password }),
    });
    const data = await response.json();
    if (!response.ok) {
        throw new Error(data.message || "Registration failed");
    }
    return data;
};

// --- Data APIs ---

export interface AdminUser {
    id: string;
    fullName: string;
    email: string;
    status: string;
    accountType: string;
    createdAt: string;
    updatedAt: string;
}

export const getAllUsers = async (): Promise<AdminUser[]> => {
    const token = getAdminAccessToken();
    const response = await fetch(`${API_BASE_URL}/admin/users`, {
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
    });
    return handleResponse(response);
};

export const getActiveSubscribersDetailed = async (): Promise<any[]> => {
    const token = getAdminAccessToken();
    const response = await fetch(`${API_BASE_URL}/admin/active-subscribers`, {
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
    });
    const data = await handleResponse(response);
    return data.subscribers || [];
};

export interface Developer {
    id: string;
    fullName: string;
    email: string;
    createdAt?: string;
    status?: string;
    license?: string;
    verifiedBadge?: boolean;
    paymentOrders?: any[];
    _count?: { apps: number };
}

export const getAllDevelopers = async (): Promise<Developer[]> => {
    const token = getAdminAccessToken();
    const response = await fetch(`${API_BASE_URL}/admin/developers`, {
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
    });
    return handleResponse(response);
};

// --- Review Apps APIs ---

export interface ReviewedApp {
    id: string;
    name: string;
    status: string;
    developer: {
        id: string;
        fullName: string;
        email: string;
    };
    buildUrl?: string;
    verifyKey?: string;
    color?: string;
    rejectionReason?: string;
    updatedAt?: string;
    version?: string;
    screenshots?: string[];
    icons?: any;
    price?: number;
    pricingModel?: string;
    distributionMode?: string;
    shortDescription?: string;
    fullDescription?: string;
    bannerUrl?: string;
    videoUrl?: string;
    tags?: string[];

    reviewerInfo?: {
        testCredentials?: string;
        functionality?: string;
        limitations?: string;
        guidance?: string;
    };
    platforms?: string[];
    distributionRegions?: string[];
}

// --- App Actions ---

export const getAllAdminApps = async (): Promise<ReviewedApp[]> => {
    const token = getAdminAccessToken();
    const response = await fetch(`${API_BASE_URL}/admin/apps/all`, {
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
    });
    return handleResponse(response);
};

export const getAdminAppsForReview = async (): Promise<ReviewedApp[]> => {
    const token = getAdminAccessToken();
    const response = await fetch(`${API_BASE_URL}/admin/apps/review`, {
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
    });
    return handleResponse(response);
};

// Update interface for detailed app response
export interface AdminAppDetails extends ReviewedApp {
    currentBuild?: {
        version: string;
        platforms: Record<string, { buildId: string; sizeMB: number; path: string }>;
        updatedAt: string;
    };
    website?: string;
    supportEmail?: string;
}

export const getAdminAppDetails = async (appId: string): Promise<AdminAppDetails> => {
    const token = getAdminAccessToken();
    const response = await fetch(`${API_BASE_URL}/admin/apps/${appId}`, {
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
    });
    return handleResponse(response);
};

export const adminApproveApp = async (appId: string): Promise<any> => {
    const token = getAdminAccessToken();
    const response = await fetch(`${API_BASE_URL}/admin/apps/${appId}/approve`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
    });
    return handleResponse(response);
};

export const adminPublishApp = async (appId: string, buildDetails?: any): Promise<any> => {
    const token = getAdminAccessToken();
    const response = await fetch(`${API_BASE_URL}/admin/apps/${appId}/publish`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(buildDetails || {}),
    });
    return handleResponse(response);
};

export const uploadAdminBuild = async (appId: string, version: string, platform: string, file: File): Promise<any> => {
    const token = getAdminAccessToken();
    const formData = new FormData();
    formData.append("file", file);
    formData.append("version", version);
    formData.append("platform", platform);

    const response = await fetch(`${API_BASE_URL}/admin/apps/${appId}/upload-build`, {
        method: "POST",
        headers: {
            Authorization: `Bearer ${token}`,
            // Content-Type not set for FormData, browser sets boundary
        },
        body: formData,
    });
    return handleResponse(response);
};

export const adminRejectApp = async (appId: string, reason: string): Promise<any> => {
    const token = getAdminAccessToken();
    const response = await fetch(`${API_BASE_URL}/admin/apps/${appId}/reject`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ reason }),
    });
    return handleResponse(response);
};

export const adminTerminateApp = async (appId: string): Promise<any> => {
    const token = getAdminAccessToken();
    const response = await fetch(`${API_BASE_URL}/admin/apps/${appId}/terminate`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
    });
    return handleResponse(response);
};

export const adminReopenApp = async (appId: string): Promise<any> => {
    const token = getAdminAccessToken();
    const response = await fetch(`${API_BASE_URL}/admin/apps/${appId}/reopen`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
    });
    return handleResponse(response);
};

export const getAppRejectionHistory = async (appId: string): Promise<any[]> => {
    const token = getAdminAccessToken();
    const response = await fetch(`${API_BASE_URL}/admin/apps/${appId}/history`, {
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
    });
    return handleResponse(response);
};

// --- User Details API ---

export const getAdminUserDetails = async (email: string): Promise<any> => {
    const token = getAdminAccessToken();
    const response = await fetch(`${API_BASE_URL}/billing/admin/user-details`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ email }),
    });
    return handleResponse(response);
};

// --- User Actions ---

export const deleteUser = async (userId: string): Promise<{ success: boolean }> => {
    const token = getAdminAccessToken();
    const response = await fetch(`${API_BASE_URL}/admin/users/${userId}`, {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
    });
    return handleResponse(response);
};

export const notifyAllUsers = async (title: string, description: string): Promise<{ success: boolean; sent: number; total: number }> => {
    const token = getAdminAccessToken();
    const response = await fetch(`${API_BASE_URL}/admin/notify-all`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ title, description }),
    });
    return handleResponse(response);
};

export const notifyUser = async (userId: string, title: string, description: string): Promise<{ success: boolean }> => {
    const token = getAdminAccessToken();
    const response = await fetch(`${API_BASE_URL}/admin/notify-user`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ userId, title, description }),
    });
    return handleResponse(response);
};

// --- Developer Actions ---

export const deleteDeveloperAdmin = async (id: string): Promise<{ success: boolean }> => {
    const token = getAdminAccessToken();
    const response = await fetch(`${API_BASE_URL}/admin/developers/${id}`, {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
    });
    return handleResponse(response);
};

// --- Admin Actions ---

export const deleteUsersBulk = async (ids: string[]): Promise<any> => {
    const token = getAdminAccessToken();
    const response = await fetch(`${API_BASE_URL}/admin/users/bulk-delete`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ ids }),
    });
    return handleResponse(response);
};

export const getAdminFlags = async (): Promise<any[]> => {
    const token = getAdminAccessToken();
    const response = await fetch(`${API_BASE_URL}/admin/flags`, {
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
    });
    return handleResponse(response);
};

export const getAdminPurchases = async (): Promise<any[]> => {
    const token = getAdminAccessToken();
    const response = await fetch(`${API_BASE_URL}/admin/purchases`, {
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
    });
    return handleResponse(response);
};

export const getAdminContributions = async (): Promise<any[]> => {
    const token = getAdminAccessToken();
    const response = await fetch(`${API_BASE_URL}/admin/contributions`, {
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
        },
    });
    return handleResponse(response);
};
