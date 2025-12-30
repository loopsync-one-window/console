import { API_BASE_URL } from "./api";

// Error Class
export class StoreApiError extends Error {
    constructor(
        public statusCode: number,
        message: string
    ) {
        super(message);
        this.name = "StoreApiError";
    }
}

// Response Handler
const handleResponse = async (response: Response) => {
    const data = await response.json();
    if (!response.ok) {
        throw new StoreApiError(
            response.status,
            data.message || "An unexpected error occurred"
        );
    }
    return data;
};

export interface AppMock {
    id: string;
    name: string;
    icon: string;
    category: string;
    shortDescription: string;
    fullDescription?: string;
    descriptions?: {
        short: string;
        long: string;
    };
    publisher: {
        id: string;
        name: string;
        verified: boolean;
        bio?: string;
        avatar?: string;
    };
    pricing: {
        type: string;
        price?: number;
        currency?: string;
    };
    stats: {
        downloads: number;
        rating: number;
    };
    branding?: {
        activeColor: string;
    };
    media?: {
        featureBanner: string;
        previewVideo: string;
        screenshots: string[];
    };
    build?: {
        version: string;
        platforms: Record<string, { buildId: string; sizeMB: number }>;
    };
    supportedPlatforms?: string[];
    privacy?: {
        tracking: string[];
        linked: string[];
    };
    info?: {
        provider: string;
        ageRating: string;
        copyright: string;
        website?: string;
        supportEmail?: string;
        languages?: string[];
    };
}

export interface Review {
    id: string;
    appId: string;
    userId: string;
    userName: string;
    rating: number;
    title: string;
    content: string;
    createdAt: string;
}

export interface ReviewStats {
    averageRating: number;
    totalReviews: number;
    ratingDistribution: {
        1: number;
        2: number;
        3: number;
        4: number;
        5: number;
    };
}

// Cache Config
const CACHE_TTL = 10 * 60 * 1000; // 10 minutes
const CACHE_PREFIX = 'loopsync_store_';

// Helper to handle caching
const fetchWithCache = async <T>(url: string, options: RequestInit, key: string): Promise<T> => {
    // 1. Try Cache (Client Side Only)
    if (typeof window !== 'undefined') {
        try {
            const cached = localStorage.getItem(key);
            if (cached) {
                const entry = JSON.parse(cached);
                if (Date.now() - entry.timestamp < CACHE_TTL) {
                    return entry.data;
                }
            }
        } catch (e) {
            // Ignore cache errors
        }
    }

    // 2. Network Request
    const response = await fetch(url, options);
    const data = await handleResponse(response);

    // 3. Save Cache (Client Side Only)
    if (typeof window !== 'undefined') {
        try {
            localStorage.setItem(key, JSON.stringify({
                timestamp: Date.now(),
                data
            }));
        } catch (e) {
            // Quota exceeded
        }
    }

    return data;
};

export const getStoreApps = async (query?: any): Promise<{ items: AppMock[]; nextCursor: string | null }> => {
    const queryString = new URLSearchParams(query).toString();
    const cacheKey = `${CACHE_PREFIX}list_${queryString}`;

    return fetchWithCache(
        `${API_BASE_URL}/store/apps?${queryString}`,
        { headers: { "Content-Type": "application/json" } },
        cacheKey
    );
};

export const getStoreAppDetails = async (appId: string): Promise<AppMock> => {
    const cacheKey = `${CACHE_PREFIX}details_${appId}`;

    return fetchWithCache(
        `${API_BASE_URL}/store/apps/${appId}`,
        { headers: { "Content-Type": "application/json" } },
        cacheKey
    );
};

export const getAppDownloadUrl = async (appId: string, platform: string, token?: string): Promise<{ downloadUrl: string }> => {
    const headers: any = { "Content-Type": "application/json" };
    if (token) headers["Authorization"] = `Bearer ${token}`;

    const response = await fetch(`${API_BASE_URL}/store/apps/${appId}/download`, {
        method: "POST",
        headers,
        body: JSON.stringify({ platform }),
    });
    return handleResponse(response);
};

export const reportApp = async (appId: string, data: { reason: string; description: string; reporterName: string; reporterEmail: string }): Promise<any> => {
    const response = await fetch(`${API_BASE_URL}/store/apps/${appId}/report`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
    });
    return handleResponse(response);
};

export const createPaymentOrder = async (appId: string, token: string): Promise<any> => {
    const response = await fetch(`${API_BASE_URL}/store/payment/order`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ appId }),
    });
    return handleResponse(response);
};

export const verifyPayment = async (payload: any, token: string): Promise<any> => {
    const response = await fetch(`${API_BASE_URL}/store/payment/verify`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(payload),
    });
    return handleResponse(response);
};

export const createContributionOrder = async (appId: string, amount: number, token: string): Promise<any> => {
    const response = await fetch(`${API_BASE_URL}/store/payment/contribution/order`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ appId, amount }),
    });
    return handleResponse(response);
};

export const verifyContribution = async (payload: any, token: string): Promise<any> => {
    const response = await fetch(`${API_BASE_URL}/store/payment/contribution/verify`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(payload),
    });
    return handleResponse(response);
};

export const checkAppOwnership = async (appId: string, token: string): Promise<{ owned: boolean }> => {
    const response = await fetch(`${API_BASE_URL}/store/payment/status/${appId}`, {
        headers: {
            "Authorization": `Bearer ${token}`
        },
    });
    return handleResponse(response);
};

// Reviews API
export const getAppReviews = async (appId: string): Promise<{ reviews: Review[]; stats: ReviewStats }> => {
    // Reviews change often, so maybe shorter cache or no cache? Let's stick to fetchWithCache for consistent UX but maybe lower TTL if needed.
    // Actually, for reviews, instant feedback is nice.
    const cacheKey = `${CACHE_PREFIX}reviews_${appId}`;
    return fetchWithCache(
        `${API_BASE_URL}/store/apps/${appId}/reviews`,
        { headers: { "Content-Type": "application/json" } },
        cacheKey
    );
};

export const submitAppReview = async (appId: string, data: { rating: number; title: string; content: string }, token: string): Promise<Review> => {
    const response = await fetch(`${API_BASE_URL}/store/apps/${appId}/reviews`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(data),
    });
    // Invalidate cache after submission
    if (typeof window !== 'undefined') {
        localStorage.removeItem(`${CACHE_PREFIX}reviews_${appId}`);
    }
    return handleResponse(response);
};

export const deleteReview = async (appId: string, reviewId: string, token: string): Promise<any> => {
    const response = await fetch(`${API_BASE_URL}/store/apps/${appId}/reviews/${reviewId}`, {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
        }
    });
    // Invalidate cache
    if (typeof window !== 'undefined') {
        localStorage.removeItem(`${CACHE_PREFIX}reviews_${appId}`);
    }
    return handleResponse(response);
};
