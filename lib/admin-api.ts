import { API_BASE_URL, getAccessToken } from "./api";

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
    const token = await getAccessToken();
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
    const token = await getAccessToken();
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
    const token = await getAccessToken();
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
    const token = await getAccessToken();
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
    const token = await getAccessToken();
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
    const token = await getAccessToken();
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
    const token = await getAccessToken();
    const response = await fetch(`${API_BASE_URL}/admin/users/${userId}`, {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
    });
    return handleResponse(response);
};
