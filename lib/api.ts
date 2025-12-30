// API Configuration
export const API_BASE_URL = "https://srv01.loopsync.cloud";
// export const API_BASE_URL = "http://localhost:8000";


// Types for our API responses
interface User {
  id: string;
  fullName: string;
  email: string;
  provider: string;
  googleId: string | null;
  status: string;
  accountType: string;
  createdAt: string;
  updatedAt: string;
}

interface GoogleSignupResponse {
  accessToken: string;
  user: User;
}

interface LoginResponse {
  accessToken: string;
  refreshToken?: string;
  expiresAt?: string;
  user: User;
}

interface PasswordResetResponse {
  message: string;
}

// Updated VerificationResponse to match backend response
interface VerificationResponse {
  message: string;
  accessToken: string;
  refreshToken: string;
  user: User;
}

interface RefreshResponse {
  accessToken: string;
  refreshToken?: string;
  expiresAt?: string;
}

interface ProfileResponse {
  fullName: string;
  email: string;
  memberSince: string;
  termsAccepted: boolean;
  activePlan: string;
}

type PreferenceStatus = "active" | "disabled";

interface ProfilePreferences {
  notifications: PreferenceStatus;
  musicExperience: PreferenceStatus;
  emergencyLockdown: PreferenceStatus;
  stabilityMode: PreferenceStatus;
}

type ModelStatus = PreferenceStatus;

interface AtlasModels {
  computeMax: ModelStatus;
  r3Advanced: ModelStatus;
  visionPro: ModelStatus;
}

interface ErrorResponse {
  statusCode: number;
  message: string;
  timestamp: string;
}

// Generic API error class
class ApiError extends Error {
  constructor(
    public statusCode: number,
    message: string,
    public timestamp: string
  ) {
    super(message);
    this.name = "ApiError";
  }
}

// Helper function to handle API responses
const handleResponse = async (response: Response) => {
  const data = await response.json();

  if (!response.ok) {
    throw new ApiError(
      data.statusCode || response.status,
      data.message || "An unexpected error occurred",
      data.timestamp || new Date().toISOString()
    );
  }

  return data;
};

// Token utilities
const ACCESS_TOKEN_KEY = "accessToken";
const REFRESH_TOKEN_KEY = "refreshToken";
const EXPIRES_AT_KEY = "expiresAt";

const parseJwtExp = (token: string): number | null => {
  try {
    const [, payload] = token.split(".");
    const json = JSON.parse(atob(payload));
    if (json && typeof json.exp === "number") {
      return json.exp * 1000;
    }
    return null;
  } catch {
    return null;
  }
};

export const saveAuthTokens = (
  tokens: { accessToken: string; refreshToken?: string; expiresAt?: string }
) => {
  const { accessToken, refreshToken, expiresAt } = tokens;
  localStorage.setItem(ACCESS_TOKEN_KEY, accessToken);
  if (refreshToken) localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
  const computedExp = expiresAt
    ? new Date(expiresAt).getTime()
    : parseJwtExp(accessToken);
  if (computedExp) {
    localStorage.setItem(EXPIRES_AT_KEY, String(computedExp));
  }
  invalidateProfileCache();
  invalidatePreferencesCache();
  invalidateBillingDetailsCache();
  invalidateBillingOverviewCache();
};

export const getStoredTokens = () => {
  const accessToken = localStorage.getItem(ACCESS_TOKEN_KEY) || "";
  const refreshToken = localStorage.getItem(REFRESH_TOKEN_KEY) || "";
  const expiresAt = Number(localStorage.getItem(EXPIRES_AT_KEY) || 0);
  return { accessToken, refreshToken, expiresAt };
};

export const clearAuthTokens = () => {
  localStorage.removeItem(ACCESS_TOKEN_KEY);
  localStorage.removeItem(REFRESH_TOKEN_KEY);
  localStorage.removeItem(EXPIRES_AT_KEY);
  localStorage.removeItem("user");
  invalidateProfileCache();
  invalidatePreferencesCache();
  invalidateBillingDetailsCache();
  invalidateBillingOverviewCache();
};

export const refreshAccessToken = async (): Promise<string> => {
  const { accessToken, refreshToken } = getStoredTokens();
  if (!accessToken || !refreshToken) return accessToken;
  const response = await fetch(`${API_BASE_URL}/auth/refresh`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify({ refreshToken }),
  });
  const data: RefreshResponse = await handleResponse(response);
  saveAuthTokens({ accessToken: data.accessToken, refreshToken: data.refreshToken, expiresAt: data.expiresAt });
  return data.accessToken;
};

export const logoutAny = async (): Promise<{ message: string }> => {
  const { accessToken, refreshToken } = getStoredTokens();
  const response = await fetch(`${API_BASE_URL}/auth/logout-any`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: accessToken ? `Bearer ${accessToken}` : "",
    },
    body: JSON.stringify({ refreshToken }),
  });
  return handleResponse(response);
};

export const getAccessToken = async (): Promise<string> => {
  const { accessToken, expiresAt } = getStoredTokens();
  if (!accessToken) return "";
  const now = Date.now();
  const FIVE_MIN = 5 * 60 * 1000;
  if (expiresAt && expiresAt - now <= FIVE_MIN) {
    try {
      return await refreshAccessToken();
    } catch {
      return accessToken;
    }
  }
  return accessToken;
};

// Onboard Status APIs
export const getCurrentUserId = (): string | null => {
  try {
    const { accessToken } = getStoredTokens();
    if (!accessToken) return null;
    const [, payload] = accessToken.split(".");
    const json = JSON.parse(atob(payload));
    const sub = json?.sub;
    return typeof sub === "string" && sub ? sub : null;
  } catch {
    return null;
  }
};

export const getOnboardStatus = async (): Promise<{ userId: string; onboard: boolean }> => {
  const token = await getAccessToken();
  const userId = getCurrentUserId();
  if (!token || !userId) {
    throw new ApiError(401, "Missing access token or userId", new Date().toISOString());
  }
  const response = await fetch(`${API_BASE_URL}/users/${userId}/onboard`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });
  if (response.status === 404) {
    try {
      await response.json();
    } catch { }
    return { userId, onboard: false };
  }
  return handleResponse(response);
};

export const updateOnboardStatus = async (onboard: boolean): Promise<{ userId: string; onboard: boolean; message: string }> => {
  const token = await getAccessToken();
  const userId = getCurrentUserId();
  if (!token || !userId) {
    throw new ApiError(401, "Missing access token or userId", new Date().toISOString());
  }
  const response = await fetch(`${API_BASE_URL}/users/${userId}/onboard`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ onboard }),
  });
  return handleResponse(response);
};

export const getTrialNotifyStatus = async (): Promise<{ userId: string; trialNotify: boolean }> => {
  const token = await getAccessToken();
  const userId = getCurrentUserId();
  if (!token || !userId) {
    throw new ApiError(401, "Missing access token or userId", new Date().toISOString());
  }
  const response = await fetch(`${API_BASE_URL}/users/${userId}/trial-notify`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });
  return handleResponse(response);
};

export const updateTrialNotifyStatus = async (trialNotify: boolean): Promise<{ userId: string; trialNotify: boolean; message: string }> => {
  const token = await getAccessToken();
  const userId = getCurrentUserId();
  if (!token || !userId) {
    throw new ApiError(401, "Missing access token or userId", new Date().toISOString());
  }
  const response = await fetch(`${API_BASE_URL}/users/${userId}/trial-notify`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ trialNotify }),
  });
  return handleResponse(response);
};

export const addCredits = async (payload: { email: string; type: "free" | "prepaid"; amount: number; reason: string; referenceId: string }): Promise<{ success?: boolean; message?: string }> => {
  const token = await getAccessToken();
  if (!token) {
    throw new ApiError(401, "Missing access token", new Date().toISOString());
  }
  const response = await fetch(`${API_BASE_URL}/billing/credits/add`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  });
  return handleResponse(response);
};

export const addTrialCredits = async (payload: { email: string; type: "free"; amount: number; reason: string; referenceId: string }): Promise<{ success: boolean; message?: string }> => {
  const token = await getAccessToken();
  if (!token) throw new ApiError(401, "Missing access token", new Date().toISOString());
  const response = await fetch(`${API_BASE_URL}/billing/trial/credits/add`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
    body: JSON.stringify(payload),
  });
  return handleResponse(response);
};

export const getTrialCreditsStatus = async (): Promise<{ success: boolean; claimed: boolean }> => {
  const token = await getAccessToken();
  if (!token) throw new ApiError(401, "Missing access token", new Date().toISOString());
  const response = await fetch(`${API_BASE_URL}/billing/trial/credits/status`, {
    method: "GET",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
  });
  return handleResponse(response);
};

// Email Signup API
export const signupWithEmail = async (
  fullName: string,
  email: string,
  password: string
): Promise<User> => {
  const response = await fetch(`${API_BASE_URL}/auth/signup-email`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      fullName,
      email,
      password,
    }),
  });

  return handleResponse(response);
};

// Google Signup API
export const signupWithGoogle = async (
  googleId: string,
  email: string,
  fullName: string
): Promise<GoogleSignupResponse> => {
  const response = await fetch(`${API_BASE_URL}/auth/signup-google`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      googleId,
      email,
      fullName,
    }),
  });

  return handleResponse(response);
};

// Email Login API
export const loginWithEmail = async (
  email: string,
  password: string
): Promise<LoginResponse> => {
  const response = await fetch(`${API_BASE_URL}/auth/login-email`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email,
      password,
    }),
  });

  return handleResponse(response);
};

// Request Password Reset API
export const requestPasswordReset = async (
  email: string
): Promise<PasswordResetResponse> => {
  const response = await fetch(`${API_BASE_URL}/auth/request-password-reset`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email,
    }),
  });

  return handleResponse(response);
};

// Reset Password API
export const resetPassword = async (
  email: string,
  code: string,
  newPassword: string
): Promise<PasswordResetResponse> => {
  const response = await fetch(`${API_BASE_URL}/auth/reset-password`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email,
      code,
      newPassword,
    }),
  });

  return handleResponse(response);
};

// Email Verification API with OTP
export const verifyEmailOTP = async (
  userId: string,
  code: string
): Promise<VerificationResponse> => {
  const response = await fetch(`${API_BASE_URL}/auth/verify-email-otp`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      userId,
      code,
    }),
  });

  return handleResponse(response);
};

// Resend Verification Code API with OTP
export const resendVerificationOTP = async (
  email: string
): Promise<{ message: string }> => {
  const response = await fetch(`${API_BASE_URL}/auth/request-email-otp`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email,
    }),
  });

  return handleResponse(response);
};

// Email Verification API (deprecated - keeping for backward compatibility)
export const verifyEmail = async (
  email: string,
  code: string
): Promise<VerificationResponse> => {
  const response = await fetch(`${API_BASE_URL}/auth/verify-email`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email,
      code,
    }),
  });

  return handleResponse(response);
};

// Resend Verification Code API (deprecated - keeping for backward compatibility)
export const resendVerificationCode = async (
  email: string
): Promise<{ message: string }> => {
  const response = await fetch(`${API_BASE_URL}/auth/resend-verification`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email,
    }),
  });

  return handleResponse(response);
};

// Profile APIs
let cachedProfile: ProfileResponse | null = null;
let profileCacheExpiry = 0;
const PROFILE_CACHE_TTL_MS = 15 * 60 * 1000;
let profileInFlight: Promise<ProfileResponse> | null = null;

export const getCachedProfile = (): ProfileResponse | null => cachedProfile;
export const invalidateProfileCache = () => {
  cachedProfile = null;
  profileCacheExpiry = 0;
};

export const getProfileMe = async (options?: { force?: boolean }): Promise<ProfileResponse> => {
  const now = Date.now();
  const force = options?.force === true;
  if (!force && cachedProfile && profileCacheExpiry > now) {
    return cachedProfile;
  }
  if (profileInFlight && !force) return profileInFlight;
  const token = await getAccessToken();
  profileInFlight = (async () => {
    const response = await fetch(`${API_BASE_URL}/profile/me`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: token ? `Bearer ${token}` : "",
      },
    });
    const data: ProfileResponse = await handleResponse(response);
    cachedProfile = data;
    profileCacheExpiry = Date.now() + PROFILE_CACHE_TTL_MS;
    return data;
  })();
  try {
    return await profileInFlight;
  } finally {
    profileInFlight = null;
  }
};

let cachedPreferences: ProfilePreferences | null = null;
let preferencesCacheExpiry = 0;
const PREFERENCES_CACHE_TTL_MS = 15 * 60 * 1000;
let preferencesInFlight: Promise<ProfilePreferences> | null = null;

export const getCachedProfilePreferences = (): ProfilePreferences | null => cachedPreferences;
export const invalidatePreferencesCache = () => {
  cachedPreferences = null;
  preferencesCacheExpiry = 0;
};

export const getProfilePreferences = async (options?: { force?: boolean }): Promise<ProfilePreferences> => {
  const now = Date.now();
  const force = options?.force === true;
  if (!force && cachedPreferences && preferencesCacheExpiry > now) {
    return cachedPreferences;
  }
  if (preferencesInFlight && !force) return preferencesInFlight;
  const token = await getAccessToken();
  preferencesInFlight = (async () => {
    const response = await fetch(`${API_BASE_URL}/profile/preferences`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: token ? `Bearer ${token}` : "",
      },
    });
    const data: ProfilePreferences = await handleResponse(response);
    cachedPreferences = data;
    preferencesCacheExpiry = Date.now() + PREFERENCES_CACHE_TTL_MS;
    return data;
  })();
  try {
    return await preferencesInFlight;
  } finally {
    preferencesInFlight = null;
  }
};

const postProfilePreference = async (path: string, value: boolean): Promise<unknown> => {
  const token = await getAccessToken();
  const response = await fetch(`${API_BASE_URL}${path}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: token ? `Bearer ${token}` : "",
    },
    body: JSON.stringify({ value }),
  });
  const res = await handleResponse(response);
  if (cachedPreferences) {
    const status: PreferenceStatus = value ? "active" : "disabled";
    if (path.includes("notifications")) cachedPreferences = { ...cachedPreferences, notifications: status };
    if (path.includes("music-experience")) cachedPreferences = { ...cachedPreferences, musicExperience: status };
    if (path.includes("emergency-lockdown")) cachedPreferences = { ...cachedPreferences, emergencyLockdown: status };
    if (path.includes("stability-mode")) cachedPreferences = { ...cachedPreferences, stabilityMode: status };
    preferencesCacheExpiry = Date.now() + PREFERENCES_CACHE_TTL_MS;
  }
  return res;
};

export const updateNotificationsPreference = async (value: boolean): Promise<unknown> => {
  return postProfilePreference(`/profile/preferences/notifications`, value);
};

export const updateMusicExperiencePreference = async (value: boolean): Promise<unknown> => {
  return postProfilePreference(`/profile/preferences/music-experience`, value);
};

export const updateEmergencyLockdownPreference = async (value: boolean): Promise<unknown> => {
  return postProfilePreference(`/profile/preferences/emergency-lockdown`, value);
};

export const updateStabilityModePreference = async (value: boolean): Promise<unknown> => {
  return postProfilePreference(`/profile/preferences/stability-mode`, value);
};

let cachedModels: AtlasModels | null = null;
let modelsCacheExpiry = 0;
const MODELS_CACHE_TTL_MS = 15 * 60 * 1000;
let modelsInFlight: Promise<AtlasModels> | null = null;

export const getCachedAtlasModels = (): AtlasModels | null => cachedModels;
export const invalidateModelsCache = () => {
  cachedModels = null;
  modelsCacheExpiry = 0;
};

export const getAtlasModels = async (options?: { force?: boolean }): Promise<AtlasModels> => {
  const now = Date.now();
  const force = options?.force === true;
  if (!force && cachedModels && modelsCacheExpiry > now) {
    return cachedModels;
  }
  if (modelsInFlight && !force) return modelsInFlight;
  const token = await getAccessToken();
  modelsInFlight = (async () => {
    const response = await fetch(`${API_BASE_URL}/profile/models/status`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: token ? `Bearer ${token}` : "",
      },
    });
    const data: AtlasModels = await handleResponse(response);
    cachedModels = data;
    modelsCacheExpiry = Date.now() + MODELS_CACHE_TTL_MS;
    return data;
  })();
  try {
    return await modelsInFlight;
  } finally {
    modelsInFlight = null;
  }
};

const postModelsUpdate = async (payload: Partial<{ computeMax: boolean; r3Advanced: boolean; visionPro: boolean }>): Promise<AtlasModels> => {
  const token = await getAccessToken();
  const response = await fetch(`${API_BASE_URL}/profile/models`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: token ? `Bearer ${token}` : "",
    },
    body: JSON.stringify(payload),
  });
  const res: AtlasModels & { success?: boolean } = await handleResponse(response);
  const { computeMax, r3Advanced, visionPro } = res;
  if (computeMax && r3Advanced && visionPro) {
    cachedModels = {
      computeMax,
      r3Advanced,
      visionPro,
    };
    modelsCacheExpiry = Date.now() + MODELS_CACHE_TTL_MS;
  }
  return { computeMax, r3Advanced, visionPro };
};

export const updateComputeMaxModel = async (value: boolean): Promise<AtlasModels> => {
  return postModelsUpdate({ computeMax: value });
};

export const updateR3AdvancedModel = async (value: boolean): Promise<AtlasModels> => {
  return postModelsUpdate({ r3Advanced: value });
};

export const updateVisionProModel = async (value: boolean): Promise<AtlasModels> => {
  return postModelsUpdate({ visionPro: value });
};

export const requestDeletionOtp = async (): Promise<{ success: boolean; message: string }> => {
  const token = await getAccessToken();
  const response = await fetch(`${API_BASE_URL}/profile/request-deletion-otp`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: token ? `Bearer ${token}` : "",
    },
  });
  return handleResponse(response);
};

export const confirmDeletion = async (code: string): Promise<{ success: boolean; message: string }> => {
  const token = await getAccessToken();
  const response = await fetch(`${API_BASE_URL}/profile/confirm-deletion`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: token ? `Bearer ${token}` : "",
    },
    body: JSON.stringify({ code }),
  });
  return handleResponse(response);
};

export const changePassword = async (
  newPassword: string,
  confirmPassword: string
): Promise<{ success?: boolean; message: string }> => {
  const token = await getAccessToken();
  const response = await fetch(`${API_BASE_URL}/profile/change-password`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: token ? `Bearer ${token}` : "",
    },
    body: JSON.stringify({ newPassword, confirmPassword }),
  });
  return handleResponse(response);
};

interface HelpSupportRequest {
  accessToken: string;
  fullName: string;
  email: string;
  userId: string;
  subject: string;
  category: string;
  description: string;
}

export const submitHelpSupport = async (
  payload: Omit<HelpSupportRequest, "accessToken">
): Promise<{ success: boolean; message: string }> => {
  const token = await getAccessToken();
  const response = await fetch(`${API_BASE_URL}/auth/help-support`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: token ? `Bearer ${token}` : "",
    },
    body: JSON.stringify({ accessToken: token, ...payload }),
  });
  return handleResponse(response);
};

interface BillingDetailsResponse {
  activePlan: string;
  startDate: string;
  endDate: string;
  amount: number;
  currency: string;
  billingEmail: string | null;
  billingAddress:
  | {
    id: string;
    addressLine1?: string;
    addressLine2?: string;
    city?: string;
    state?: string;
    country?: string;
    pinCode?: string;
    phoneNumber?: string;
  }
  | null;
  paymentMethod:
  | {
    id: string;
    type: string;
    providerDetails: unknown;
  }
  | null;
  paymentId: string | null;
}

let cachedBillingDetails: BillingDetailsResponse | null = null;
let billingDetailsCacheExpiry = 0;
const BILLING_DETAILS_CACHE_TTL_MS = 15 * 60 * 1000;
let billingDetailsInFlight: Promise<BillingDetailsResponse> | null = null;

export const getCachedBillingDetails = (): BillingDetailsResponse | null => cachedBillingDetails;
export const invalidateBillingDetailsCache = () => {
  cachedBillingDetails = null;
  billingDetailsCacheExpiry = 0;
};

export const getBillingDetails = async (options?: { force?: boolean }): Promise<BillingDetailsResponse> => {
  const now = Date.now();
  const force = options?.force === true;
  if (!force && cachedBillingDetails && billingDetailsCacheExpiry > now) {
    return cachedBillingDetails;
  }
  if (billingDetailsInFlight && !force) return billingDetailsInFlight;
  const token = await getAccessToken();
  billingDetailsInFlight = (async () => {
    const response = await fetch(`${API_BASE_URL}/billing/details`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: token ? `Bearer ${token}` : "",
      },
    });
    const data: BillingDetailsResponse = await handleResponse(response);
    cachedBillingDetails = data;
    billingDetailsCacheExpiry = Date.now() + BILLING_DETAILS_CACHE_TTL_MS;
    return data;
  })();
  try {
    return await billingDetailsInFlight;
  } finally {
    billingDetailsInFlight = null;
  }
};

interface BillingOverviewData {
  subscription: {
    planName: string;
    status: string;
    startDate: string;
    endDate: string;
    daysRemaining: number;
    autoRenew: boolean;
  };
  credits: {
    prepaid: { balance: number };
    free: { balance: number };
    usageCap: { total: number; remaining: number };
  };
  usage: { total: number; prepaidUsed: number };
  nextInvoice: number;
}

let cachedBillingOverview: { success: boolean; data: BillingOverviewData } | null = null;
let billingOverviewCacheExpiry = 0;
const BILLING_OVERVIEW_CACHE_TTL_MS = 15 * 60 * 1000;
let billingOverviewInFlight: Promise<{ success: boolean; data: BillingOverviewData }> | null = null;

export const getCachedBillingOverview = (): { success: boolean; data: BillingOverviewData } | null => cachedBillingOverview;
export const invalidateBillingOverviewCache = () => {
  cachedBillingOverview = null;
  billingOverviewCacheExpiry = 0;
};

export const getBillingOverview = async (options?: { force?: boolean }): Promise<{ success: boolean; data: BillingOverviewData }> => {
  const now = Date.now();
  const force = options?.force === true;
  if (!force && cachedBillingOverview && billingOverviewCacheExpiry > now) {
    return cachedBillingOverview;
  }
  if (billingOverviewInFlight && !force) return billingOverviewInFlight;
  const token = await getAccessToken();
  billingOverviewInFlight = (async () => {
    const response = await fetch(`${API_BASE_URL}/billing/overview`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: token ? `Bearer ${token}` : "",
      },
    });
    const data: { success: boolean; data: BillingOverviewData } = await handleResponse(response);
    cachedBillingOverview = data;
    billingOverviewCacheExpiry = Date.now() + BILLING_OVERVIEW_CACHE_TTL_MS;
    return data;
  })();
  try {
    return await billingOverviewInFlight;
  } finally {
    billingOverviewInFlight = null;
  }
};

interface Plan {
  id: string;
  code: string;
  name: string;
  description: string;
  price: number;
  currency: string;
  billingCycle: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export const getPlanByCode = async (
  code: string
): Promise<Plan> => {
  const response = await fetch(`${API_BASE_URL}/plans/code/${code}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  return handleResponse(response);
};

//

// Check user eligibility for free trial
export const checkEligibility = async (
  email: string
): Promise<{ isEligible: boolean }> => {
  const response = await fetch(`${API_BASE_URL}/auth/check-eligibility`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email,
    }),
  });

  return handleResponse(response);
};

export const consumeBilling = async (
  email: string,
  cost: number,
  resource: string,
  requestId: string
): Promise<{ success: boolean; message: string }> => {
  const response = await fetch(`${API_BASE_URL}/billing/consume`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Pepron-Key": "loopsync.access.LOOPSYNC0124HYB6T381",
    },
    body: JSON.stringify({ email, cost, resource, requestId }),
  });
  return handleResponse(response);
};

// Subscriptions
export interface SubscriptionMeResponse {
  success: boolean;
  subscription: {
    id: string;
    userId: string;
    planId: string;
    planName: string;
    planCode: string;
    planAmount: number;
    planCurrency: string;
    status: string;
    startedAt: string;
    expiresAt: string;
    renewsOn: string;
    autoRenew: boolean;
    paymentProvider: string;
    providerSubscriptionId: string | null;
    providerPaymentId: string | null;
    isFreeTrial: boolean;
    paymentMethod?: {
      id: string;
      type: string;
      providerDetails: unknown;
    } | null;
  } | null;
}

export const getSubscriptionMe = async (): Promise<SubscriptionMeResponse> => {
  const token = await getAccessToken();
  const response = await fetch(`${API_BASE_URL}/subscriptions/me`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: token ? `Bearer ${token}` : "",
    },
  });
  return handleResponse(response);
};

export interface ActiveSubscribersResponse {
  success: boolean;
  count: number;
  subscribers: Array<{
    subscriptionId: string;
    status: string;
    startedAt: string;
    expiresAt: string;
    daysRemaining: number;
    autoRenew: boolean;
    paymentProvider: string;
    providerSubscriptionId: string | null;
    providerPaymentId: string | null;
    amountPaise: number;
    isFreeTrial: boolean;
    user: {
      id: string;
      fullName: string | null;
      email: string | null;
      accountType: string | null;
      status: string | null;
    };
    plan: {
      id: string;
      code: string;
      name: string;
      displayName: string;
      currency: string;
      billingCycle: "MONTHLY" | "ANNUAL";
    };
  }>;
}

export const getActiveSubscribersDetailed = async (): Promise<ActiveSubscribersResponse> => {
  const token = await getAccessToken();
  const response = await fetch(`${API_BASE_URL}/admin/active-subscribers`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: token ? `Bearer ${token}` : "",
    },
  });
  return handleResponse(response);
};

export interface AutopayStatusResponse {
  success: boolean;
  hasActiveLocalSubscription: boolean;
  local: {
    status: string;
    autoRenew: boolean;
    startedAt: string;
    expiresAt: string;
    daysRemaining: number;
    isFreeTrial: boolean;
    plan: { code: string; name: string };
    providerSubscriptionId: string | null;
  } | null;
  provider: {
    success: boolean;
    found: boolean;
    error?: string;
    provider?: {
      id: string;
      status: string;
      total_count?: number;
      paid_count?: number;
      current_start?: number;
      current_end?: number;
      charge_at?: number;
      start_at?: number;
      end_at?: number;
      pause_at?: number;
      resume_at?: number;
      customer_id?: string;
      plan_id?: string;
      notes?: unknown;
      addon_data?: unknown;
      auth_attempted?: boolean;
      auth_failure_reason?: string;
    };
  };
  isAutopayCancelled: boolean;
  shouldRestrict: boolean;
}

export const getAutopayStatus = async (): Promise<AutopayStatusResponse> => {
  const token = await getAccessToken();
  const response = await fetch(`${API_BASE_URL}/subscriptions/autopay-status`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: token ? `Bearer ${token}` : "",
    },
  });
  return handleResponse(response);
};
export interface InvoiceRow {
  invoiceNumber: string;
  date: string;
  type: string;
  amount: string;
  status: string;
}
export interface InvoicesListResponse {
  success: boolean;
  meta: { page: number; limit: number; total: number };
  invoices: InvoiceRow[];
}
export const getInvoices = async (options?: {
  page?: number
  limit?: number
  status?: "PAID" | "FAILED" | "PENDING"
}): Promise<InvoicesListResponse> => {
  const token = await getAccessToken();
  const params = new URLSearchParams();
  if (options?.page) params.set("page", String(options.page));
  if (options?.limit) params.set("limit", String(options.limit));
  if (options?.status) params.set("status", options.status);
  const response = await fetch(`${API_BASE_URL}/api/v1/billing/invoices${params.toString() ? `?${params.toString()}` : ""}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: token ? `Bearer ${token}` : "",
    },
  });
  return handleResponse(response);
};
export const createInvoice = async (payload: {
  type: "SINGLE_PURCHASE" | "SUBSCRIPTION" | "REFUND"
  amount: number
  currency: "INR"
  paymentProvider?: string
  paymentReferenceId?: string
  status?: "PAID" | "FAILED" | "PENDING"
}): Promise<{ success: boolean; invoice: InvoiceRow }> => {
  const token = await getAccessToken();
  const response = await fetch(`${API_BASE_URL}/api/v1/billing/invoices`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: token ? `Bearer ${token}` : "",
    },
    body: JSON.stringify(payload),
  });
  return handleResponse(response);
};
export interface SanitizePromptResponse {
  status: string;
  rawPrompt: string;
  sanitizedPrompt: string;
  finalPrompt: string;
  meta: {
    provider: string;
    scope: string;
    hasUnsafeParts: boolean;
    removedSections: string[];
    warnings: string[];
  };
}

export const sanitizePrompt = async (payload: {
  rawPrompt: string;
  provider: string;
  scope: string;
  userId: string;
  email: string;
  includeMandatoryBlock: boolean;
}): Promise<SanitizePromptResponse> => {
  const token = await getAccessToken();
  const response = await fetch(`${API_BASE_URL}/v1/prompt/sanitize`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: token ? `Bearer ${token}` : "",
    },
    body: JSON.stringify(payload),
  });
  return handleResponse(response);
};

export const submitContactSupport = async (
  name: string,
  email: string,
  topic: string,
  message: string
): Promise<{ success: boolean; message: string }> => {
  const response = await fetch(`${API_BASE_URL}/support/contact`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      name,
      email,
      topic,
      message,
    }),
  });
  return handleResponse(response);
};

export interface AcquisitionInquiryData {
  name: string;
  email: string;
  organization: string;
  role: string;
  buyerType: string;
  acquisitionScope: string;
  timeline: string;
  message: string;
  acknowledgement: boolean;
}

export const submitAcquisitionInquiry = async (
  data: AcquisitionInquiryData
): Promise<{ success: boolean; message: string }> => {
  const response = await fetch(`${API_BASE_URL}/acquire/inquiry`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  return handleResponse(response);
};

// Developer Token Utilities
const DEV_ACCESS_TOKEN_KEY = "developer.accessToken";
const DEV_REFRESH_TOKEN_KEY = "developer.refreshToken";
const DEV_EXPIRES_AT_KEY = "developer.expiresAt";

export const getDeveloperStoredTokens = () => {
  const accessToken = localStorage.getItem(DEV_ACCESS_TOKEN_KEY) || "";
  const refreshToken = localStorage.getItem(DEV_REFRESH_TOKEN_KEY) || "";
  const expiresAt = Number(localStorage.getItem(DEV_EXPIRES_AT_KEY) || 0);
  return { accessToken, refreshToken, expiresAt };
};

export const refreshDeveloperAccessToken = async (): Promise<string> => {
  const { refreshToken } = getDeveloperStoredTokens();
  if (!refreshToken) throw new Error("No refresh token available");

  try {
    const response = await fetch(`${API_BASE_URL}/auth/refresh`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refreshToken }),
    });

    const data = await handleResponse(response);

    // Save new tokens
    if (data.accessToken) localStorage.setItem(DEV_ACCESS_TOKEN_KEY, data.accessToken);
    if (data.refreshToken) localStorage.setItem(DEV_REFRESH_TOKEN_KEY, data.refreshToken);
    // Parse exp from token or use returned expiresAt
    if (data.accessToken) {
      const [, payload] = data.accessToken.split(".");
      const json = JSON.parse(atob(payload));
      if (json && json.exp) {
        localStorage.setItem(DEV_EXPIRES_AT_KEY, (json.exp * 1000).toString());
      }
    }

    return data.accessToken;
  } catch (error) {
    // If refresh fails, clear tokens to force re-login
    localStorage.removeItem(DEV_ACCESS_TOKEN_KEY);
    localStorage.removeItem(DEV_REFRESH_TOKEN_KEY);
    localStorage.removeItem(DEV_EXPIRES_AT_KEY);
    throw error;
  }
};

export const getDeveloperAccessToken = async (): Promise<string> => {
  const { accessToken, expiresAt } = getDeveloperStoredTokens();
  if (!accessToken) return "";

  const now = Date.now();
  const FIVE_MIN = 5 * 60 * 1000;

  if (expiresAt && expiresAt - now <= FIVE_MIN) {
    try {
      return await refreshDeveloperAccessToken();
    } catch (e) {
      console.error("Failed to refresh developer token", e);
      return "";
    }
  }
  return accessToken;
};

// ------------------- Developer Settings APIs -------------------

export interface DeveloperProfile {
  displayName: string;
  email: string;
  bio?: string;
  avatarUrl?: string;
  visibility?: string;
  license?: string;
  verifiedBadge?: boolean;
  status?: string;
  financials?: {
    totalPaid: number;
    currency: string;
  };
}

export interface ApiKey {
  id: string;
  type: string;
  prefix: string;
  createdAt: string;
  status: string;
}

export interface DeveloperNotifications {
  deploymentStatus: boolean;
  payoutUpdates: boolean;
  marketingEmails: boolean;
}

export const getDeveloperProfile = async (): Promise<DeveloperProfile> => {
  const token = await getDeveloperAccessToken();
  const response = await fetch(`${API_BASE_URL}/api/v1/settings/profile`, {
    headers: { Authorization: token ? `Bearer ${token}` : "" },
  });
  return handleResponse(response);
};

export const updateDeveloperProfile = async (data: Partial<DeveloperProfile>): Promise<DeveloperProfile> => {
  const token = await getDeveloperAccessToken();
  const response = await fetch(`${API_BASE_URL}/api/v1/settings/profile`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json", Authorization: token ? `Bearer ${token}` : "" },
    body: JSON.stringify(data),
  });
  return handleResponse(response);
};

export const updateDeveloperAvatar = async (file: File): Promise<{ avatarUrl: string }> => {
  const token = await getDeveloperAccessToken();
  const formData = new FormData();
  formData.append("file", file);

  const response = await fetch(`${API_BASE_URL}/api/v1/settings/profile/avatar`, {
    method: "PATCH",
    headers: { Authorization: token ? `Bearer ${token}` : "" },
    body: formData,
  });
  return handleResponse(response);
};

export const getDeveloperApiKeys = async (): Promise<{ keys: ApiKey[] }> => {
  const token = await getDeveloperAccessToken();
  const response = await fetch(`${API_BASE_URL}/api/v1/settings/api-keys`, {
    headers: { Authorization: token ? `Bearer ${token}` : "" },
  });
  return handleResponse(response);
};

export const rollDeveloperApiKey = async (keyId: string): Promise<{ newKey: string }> => {
  const token = await getDeveloperAccessToken();
  const response = await fetch(`${API_BASE_URL}/api/v1/settings/api-keys/${keyId}/roll`, {
    method: "PATCH",
    headers: { Authorization: token ? `Bearer ${token}` : "" },
  });
  return handleResponse(response);
};

export const createDeveloperApiKey = async (type: string = 'production'): Promise<{ id: string, key: string, type: string, prefix: string, status: string, createdAt: string }> => {
  const token = await getDeveloperAccessToken();
  const response = await fetch(`${API_BASE_URL}/api/v1/settings/api-keys`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: token ? `Bearer ${token}` : "" },
    body: JSON.stringify({ type }),
  });
  return handleResponse(response);
};

export const deleteDeveloperApiKey = async (keyId: string): Promise<void> => {
  const token = await getDeveloperAccessToken();
  const response = await fetch(`${API_BASE_URL}/api/v1/settings/api-keys/${keyId}`, {
    method: "DELETE",
    headers: { Authorization: token ? `Bearer ${token}` : "" },
  });
  return handleResponse(response);
};

export const getDeveloperNotifications = async (): Promise<DeveloperNotifications> => {
  const token = await getDeveloperAccessToken();
  const response = await fetch(`${API_BASE_URL}/api/v1/settings/notifications`, {
    headers: { Authorization: token ? `Bearer ${token}` : "" },
  });
  return handleResponse(response);
};

export const updateDeveloperNotifications = async (data: Partial<DeveloperNotifications>): Promise<DeveloperNotifications> => {
  const token = await getDeveloperAccessToken();
  const response = await fetch(`${API_BASE_URL}/api/v1/settings/notifications`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json", Authorization: token ? `Bearer ${token}` : "" },
    body: JSON.stringify(data),
  });
  return handleResponse(response);
};

export const deleteDeveloperAccount = async (confirm: boolean): Promise<{ success: boolean }> => {
  const token = await getDeveloperAccessToken();
  const response = await fetch(`${API_BASE_URL}/api/v1/settings/account/delete`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json", Authorization: token ? `Bearer ${token}` : "" },
    body: JSON.stringify({ confirm }),
  });
  return handleResponse(response);
};

// ------------------- Banking & Payouts APIs -------------------

export interface PayoutAccount {
  id: string;
  bankName?: string;
  accountHolder?: string;
  accountLast4?: string;
  isPrimary: boolean;
  verified: boolean;
}

export interface TaxInfo {
  gstin?: string;
  pan?: string;
  panCardUrl?: string; // URL of the uploaded PAN image
  status: string;
  billingAddress?: string;
}

export interface PayoutSchedule {
  type: string;
  cycle: string;
  day: number;
  nextPayout: string;
}

export interface Transaction {
  id: string;
  date: string;
  description: string;
  status: string;
  amount: number;
  currency: string;
}

export const getBankingPayoutAccount = async (): Promise<PayoutAccount> => {
  const token = await getDeveloperAccessToken();
  const response = await fetch(`${API_BASE_URL}/api/v1/banking/payout-account`, {
    headers: { Authorization: token ? `Bearer ${token}` : "" },
  });
  return handleResponse(response);
};

export const updateBankingPayoutAccount = async (data: any): Promise<any> => {
  const token = await getDeveloperAccessToken();
  const response = await fetch(`${API_BASE_URL}/api/v1/banking/payout-account`, {
    method: "PATCH",
    headers: {
      Authorization: token ? `Bearer ${token}` : "",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
  return handleResponse(response);
};

export const getBankingTaxInfo = async (): Promise<TaxInfo> => {
  const token = await getDeveloperAccessToken();
  const response = await fetch(`${API_BASE_URL}/api/v1/banking/tax`, {
    headers: { Authorization: token ? `Bearer ${token}` : "" },
  });
  return handleResponse(response);
};

export const updateBankingTaxInfo = async (data: any): Promise<any> => {
  const token = await getDeveloperAccessToken();
  const response = await fetch(`${API_BASE_URL}/api/v1/banking/tax`, {
    method: "PATCH",
    headers: {
      Authorization: token ? `Bearer ${token}` : "",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
  return handleResponse(response);
};

export const getBankingPayoutSchedule = async (): Promise<PayoutSchedule> => {
  const token = await getDeveloperAccessToken();
  const response = await fetch(`${API_BASE_URL}/api/v1/banking/payout-schedule`, {
    headers: { Authorization: token ? `Bearer ${token}` : "" },
  });
  return handleResponse(response);
};

export const updateBankingPayoutSchedule = async (data: any): Promise<any> => {
  const token = await getDeveloperAccessToken();
  const response = await fetch(`${API_BASE_URL}/api/v1/banking/payout-schedule`, {
    method: "PATCH",
    headers: {
      Authorization: token ? `Bearer ${token}` : "",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
  return handleResponse(response);
};

export const getBankingTransactions = async (): Promise<{ items: Transaction[] }> => {
  const token = await getDeveloperAccessToken();
  const response = await fetch(`${API_BASE_URL}/api/v1/banking/transactions`, {
    headers: { Authorization: token ? `Bearer ${token}` : "" },
  });
  return handleResponse(response);
};

export const uploadBankingPanCard = async (file: File): Promise<{ panCardUrl: string }> => {
  const token = await getDeveloperAccessToken();
  const formData = new FormData();
  formData.append("file", file);

  const response = await fetch(`${API_BASE_URL}/api/v1/banking/tax/pan-card`, {
    method: "PATCH",
    headers: { Authorization: token ? `Bearer ${token}` : "" },
    body: formData,
  });
  return handleResponse(response);
};


// --- Revenue API ---

export interface RevenueSummary {
  totalEarnings: number;
  currency: string;
  monthlyGrowthPercent: number;
  nextPayout: {
    amount: number;
    currency: string;
    status: string;
    scheduledFor: string;
  };
}

export interface RevenueTransaction {
  id: string;
  date: string;
  description: string;
  status: string;
  amount: number;
  currency: string;
}

export const getRevenueSummary = async (): Promise<RevenueSummary> => {
  const token = await getDeveloperAccessToken();
  const response = await fetch(`${API_BASE_URL}/api/v1/revenue/summary`, {
    headers: { Authorization: token ? `Bearer ${token}` : "" },
  });
  return handleResponse(response);
};

export const getRevenueTransactions = async (limit: number = 10, page: number = 1): Promise<{ items: RevenueTransaction[], total: number, page: number, totalPages: number }> => {
  const token = await getDeveloperAccessToken();
  const response = await fetch(`${API_BASE_URL}/api/v1/revenue/transactions?limit=${limit}&page=${page}`, {
    headers: { Authorization: token ? `Bearer ${token}` : "" },
  });
  return handleResponse(response);
};

export const exportRevenueReport = async (format: string = 'csv', period: string = 'monthly') => {
  const token = await getDeveloperAccessToken();
  const response = await fetch(`${API_BASE_URL}/api/v1/revenue/export?format=${format}&period=${period}`, {
    headers: { Authorization: token ? `Bearer ${token}` : "" },
  });

  if (!response.ok) throw new Error("Failed to export report");

  const blob = await response.blob();
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `revenue-report-${period}.${format}`;
  document.body.appendChild(a);
  a.click();
  a.remove();
  window.URL.revokeObjectURL(url);
};

// --- Analytics API ---

export interface AnalyticsOverview {
  totalUsers: number;
  totalUsersChangePercent: number;
  activeSessions: number;
  activeSessionsChangePercent: number;
  avgSessionDurationSec: number;
  avgSessionDurationChangePercent: number;
}

export interface AnalyticsTraffic {
  points: { label: string; users: number }[];
}

export interface AnalyticsDevices {
  devices: { type: string; percentage: number }[];
}

export interface AnalyticsRealtime {
  activeUsers: number;
  activeSessions: number;
  requestsPerMinute: number;
}

export const getAnalyticsOverview = async (range: string = '7d', region: string = 'worldwide', appId?: string): Promise<AnalyticsOverview> => {
  const token = await getDeveloperAccessToken();
  const query = `range=${range}&region=${region}${appId ? `&appId=${appId}` : ''}`;
  const response = await fetch(`${API_BASE_URL}/api/v1/analytics/overview?${query}`, {
    headers: { Authorization: token ? `Bearer ${token}` : "" },
  });
  return handleResponse(response);
};

export const getAnalyticsTraffic = async (range: string = '7d', region: string = 'worldwide', appId?: string): Promise<AnalyticsTraffic> => {
  const token = await getDeveloperAccessToken();
  const query = `range=${range}&region=${region}${appId ? `&appId=${appId}` : ''}`;
  const response = await fetch(`${API_BASE_URL}/api/v1/analytics/traffic?${query}`, {
    headers: { Authorization: token ? `Bearer ${token}` : "" },
  });
  return handleResponse(response);
};

export const getAnalyticsDevices = async (range: string = '7d', region: string = 'worldwide', appId?: string): Promise<AnalyticsDevices> => {
  const token = await getDeveloperAccessToken();
  const query = `range=${range}&region=${region}${appId ? `&appId=${appId}` : ''}`;
  const response = await fetch(`${API_BASE_URL}/api/v1/analytics/devices?${query}`, {
    headers: { Authorization: token ? `Bearer ${token}` : "" },
  });
  return handleResponse(response);
};

export const getAnalyticsRealtime = async (appId?: string): Promise<AnalyticsRealtime> => {
  const token = await getDeveloperAccessToken();
  const query = appId ? `?appId=${appId}` : '';
  const response = await fetch(`${API_BASE_URL}/api/v1/analytics/realtime${query}`, {
    headers: { Authorization: token ? `Bearer ${token}` : "" },
  });
  return handleResponse(response);
};

// --- Overview API ---

export interface OverviewApp {
  id: string;
  name: string;
  status: string;
  users: number | null;
  color: string;
  logoUrl?: string | null;
  rejectionReason?: string | null;
}

export interface OverviewActivityItem {
  id: string;
  type: string;
  message: string;
  appName: string;
  timestamp: string;
}

export interface OverviewSnapshot {
  context: {
    displayName: string;
    timeOfDay: string;
    missingRequirements?: string[];
  };
  apps: OverviewApp[];
  activity: OverviewActivityItem[];
}

export const getOverviewSnapshot = async (search: string = ""): Promise<OverviewSnapshot> => {
  const token = await getDeveloperAccessToken();
  const response = await fetch(`${API_BASE_URL}/api/v1/overview?search=${search}`, {
    headers: { Authorization: token ? `Bearer ${token}` : "" },
  });
  return handleResponse(response);
};

export const publishApp = async (data: { name: string; status?: string; color?: string }) => {
  const token = await getDeveloperAccessToken();
  const response = await fetch(`${API_BASE_URL}/api/v1/apps`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: token ? `Bearer ${token}` : ""
    },
    body: JSON.stringify(data),
  });
  return handleResponse(response);
};

export const deleteApp = async (appId: string) => {
  const token = await getDeveloperAccessToken();
  const response = await fetch(`${API_BASE_URL}/api/v1/apps/${appId}`, {
    method: "DELETE",
    headers: { Authorization: token ? `Bearer ${token}` : "" },
  });
  return handleResponse(response);
};

export const getApp = async (appId: string) => {
  const token = await getDeveloperAccessToken();
  const response = await fetch(`${API_BASE_URL}/api/v1/apps/${appId}`, {
    method: "GET",
    headers: { Authorization: token ? `Bearer ${token}` : "" },
  });
  return handleResponse(response);
};

export const updateApp = async (appId: string, data: any) => {
  const token = await getDeveloperAccessToken();
  const response = await fetch(`${API_BASE_URL}/api/v1/apps/${appId}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: token ? `Bearer ${token}` : ""
    },
    body: JSON.stringify(data),
  });
  return handleResponse(response);
};

export const getAssetUploadUrl = async (appId: string, type: 'icon' | 'banner' | 'screenshot' | 'video', mime: string) => {
  const token = await getDeveloperAccessToken();
  const response = await fetch(`${API_BASE_URL}/api/v1/apps/${appId}/assets/upload-url`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: token ? `Bearer ${token}` : ""
    },
    body: JSON.stringify({ type, mime }),
  });
  return handleResponse(response);
};

export const updateAppAssets = async (appId: string, assets: any) => {
  const token = await getDeveloperAccessToken();
  const response = await fetch(`${API_BASE_URL}/api/v1/apps/${appId}/assets`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: token ? `Bearer ${token}` : ""
    },
    body: JSON.stringify(assets),
  });
  return handleResponse(response);
};

export const getBuildUploadUrl = async (appId: string, fileName: string, size: number) => {
  const token = await getDeveloperAccessToken();
  const response = await fetch(`${API_BASE_URL}/api/v1/apps/${appId}/build/upload-url`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: token ? `Bearer ${token}` : ""
    },
    body: JSON.stringify({ fileName, size }),
  });
  return handleResponse(response);
};

export const verifyApp = async (appId: string, verifyKey: string) => {
  const token = await getDeveloperAccessToken();
  const response = await fetch(`${API_BASE_URL}/api/v1/apps/${appId}/verify`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: token ? `Bearer ${token}` : ""
    },
    body: JSON.stringify({ verifyKey }),
  });
  return handleResponse(response);
};


export const deployApp = async (appId: string) => {
  const token = await getDeveloperAccessToken();
  const response = await fetch(`${API_BASE_URL}/api/v1/apps/${appId}/publish`, {
    method: "POST",
    headers: { Authorization: token ? `Bearer ${token}` : "" },
  });
  return handleResponse(response);
};


