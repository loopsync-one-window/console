import { API_BASE_URL } from "./api";

const ADMIN_ACCESS_TOKEN_KEY = "admin.accessToken";

const getAdminAccessToken = () => {
    if (typeof window !== 'undefined') {
        return localStorage.getItem(ADMIN_ACCESS_TOKEN_KEY);
    }
    return null;
};


// Types
export interface AdminUser {
    id: string;
    fullName: string;
    email: string;
    status: string;
    accountType: string;
    createdAt: string;
    updatedAt: string;
    // Add other fields as returned by the backend
}

export interface SubscribedUser {
    subscriptionId: string;
    status: string;
    startedAt: string;
    expiresAt: string;
    daysRemaining: number;
    autoRenew: boolean;
    amountPaise: number;
    isFreeTrial: boolean;
    user: {
        id: string;
        fullName: string;
        email: string;
        accountType: string;
        status: string;
    };
    plan: {
        id: string;
        code: string;
        name: string;
        displayName: string;
        currency: string;
        billingCycle: string;
    };
}

export interface AdminStats {
    totalUsers: number;
    activeSubscribers: number;
    // ...
}

class AdminApiError extends Error {
    constructor(
        public statusCode: number,
        message: string,
        public timestamp: string
    ) {
        super(message);
        this.name = "AdminApiError";
    }
}

const handleResponse = async (response: Response) => {
    const data = await response.json();

    if (!response.ok) {
        throw new AdminApiError(
            data.statusCode || response.status,
            data.message || "An unexpected error occurred",
            data.timestamp || new Date().toISOString()
        );
    }

    return data;
};

export const getAllUsers = async (): Promise<AdminUser[]> => {
    const token = getAdminAccessToken();
    const response = await fetch(`${API_BASE_URL}/admin/users`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
    });
    return handleResponse(response);
};

export const getUserById = async (id: string): Promise<AdminUser> => {
    const token = getAdminAccessToken();
    const response = await fetch(`${API_BASE_URL}/admin/users/${id}`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
    });
    return handleResponse(response);
};

export const getAllSubscribedUsers = async (): Promise<SubscribedUser[]> => { // Type might need adjustment based on real data
    const token = getAdminAccessToken();
    const response = await fetch(`${API_BASE_URL}/admin/subscribed-users`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
    });
    return handleResponse(response);
};

export const getActiveSubscribersDetailed = async (): Promise<SubscribedUser[]> => {
    const token = getAdminAccessToken();
    const response = await fetch(`${API_BASE_URL}/admin/active-subscribers`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
    });
    const data = await handleResponse(response);
    return data.subscribers || [];
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

export const deleteUsersBulk = async (ids: string[]): Promise<{ success: boolean; results: any[] }> => {
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

// Developer Types
export interface Developer {
    id: string;
    fullName: string;
    email: string;
    status: string;
    verifiedBadge: boolean;
    license: string | null;
    createdAt: string;
    paymentOrders: {
        id: string;
        amount: number;
        currency: string;
        status: string;
        createdAt: string;
    }[];
    _count?: {
        apps: number;
    };
}

export const getAllDevelopers = async (): Promise<Developer[]> => {
    const token = getAdminAccessToken();
    const response = await fetch(`${API_BASE_URL}/admin/developers`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
    });
    return handleResponse(response);
};

export const getDeveloperById = async (id: string): Promise<Developer> => {
    const token = getAdminAccessToken();
    const response = await fetch(`${API_BASE_URL}/admin/developers/${id}`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
    });
    return handleResponse(response);
};

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

// App Review APIs
export interface ReviewedApp {
    id: string;
    name: string;
    status: string;
    version: string;
    updatedAt: string;
    developer: {
        id: string;
        fullName: string;
        email: string;
    };
    buildUrl?: string;
    reviewerInfo?: any;
    // Add other fields as needed
}

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

export const getAdminAppDetails = async (appId: string): Promise<any> => {
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

export const adminRejectApp = async (appId: string, reason: string): Promise<any> => {
    const token = getAdminAccessToken();
    const response = await fetch(`${API_BASE_URL}/admin/apps/${appId}/reject`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
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
            Authorization: `Bearer ${token}`
        }
    });
    return handleResponse(response);
};
