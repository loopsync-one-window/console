export const ATLAS_BASE_URL = "https://srv02.loopsync.cloud/api";

export interface AtlasAccessCodeResponse {
  provider: string;
  appName: string;
  currentAccessCode: string;
  totalChangeCount: string;
  isChargable: boolean;
  isBlocked: boolean;
}

export interface AtlasUsageStatusResponse {
  email: string;
  channel: string;
  usage: {
    openai: { consumedRequests: number; burnRate: number };
    gemini: { consumedRequests: number; burnRate: number };
    grok: { consumedRequests: number; burnRate: number };
  };
  totalConsumedRequests: number;
  totalBurnRate: number;
}

let cachedAtlasByEmail: Record<string, AtlasAccessCodeResponse> = {};
let atlasExpiryByEmail: Record<string, number> = {};
const ATLAS_CACHE_TTL_MS = 15 * 60 * 1000;
const atlasInFlightByEmail: Map<string, Promise<AtlasAccessCodeResponse>> = new Map();

let cachedAtlasUsageByEmail: Record<string, AtlasUsageStatusResponse> = {};
let atlasUsageExpiryByEmail: Record<string, number> = {};
const atlasUsageInFlightByEmail: Map<string, Promise<AtlasUsageStatusResponse>> = new Map();

export const getCachedAtlasAccessCode = (email: string): AtlasAccessCodeResponse | null => {
  const exp = atlasExpiryByEmail[email] || 0;
  if (exp > Date.now() && cachedAtlasByEmail[email]) return cachedAtlasByEmail[email];
  return null;
};

export const invalidateAtlasAccessCodeCache = (email?: string) => {
  if (email) {
    delete cachedAtlasByEmail[email];
    delete atlasExpiryByEmail[email];
    atlasInFlightByEmail.delete(email);
    delete cachedAtlasUsageByEmail[email];
    delete atlasUsageExpiryByEmail[email];
    atlasUsageInFlightByEmail.delete(email);
  } else {
    cachedAtlasByEmail = {};
    atlasExpiryByEmail = {};
    atlasInFlightByEmail.clear();
    cachedAtlasUsageByEmail = {};
    atlasUsageExpiryByEmail = {};
    atlasUsageInFlightByEmail.clear();
  }
};

export const getAtlasUsageStatusClient = async (
  email: string,
  options?: { force?: boolean }
): Promise<AtlasUsageStatusResponse> => {
  const now = Date.now();
  const force = options?.force === true;
  if (!force) {
    const exp = atlasUsageExpiryByEmail[email] || 0;
    if (exp > now && cachedAtlasUsageByEmail[email]) {
      return cachedAtlasUsageByEmail[email];
    }
    const inflight = atlasUsageInFlightByEmail.get(email);
    if (inflight) return inflight;
  }
  atlasUsageInFlightByEmail.set(email, (async () => {
    const res = await fetch(`/api/atlas/usage/status`, { cache: "no-store", headers: { "x-email": email } });
    const data = await res.json();
    if (!res.ok) throw new Error(data?.message || "Failed to load usage status");
    cachedAtlasUsageByEmail[email] = data as AtlasUsageStatusResponse;
    atlasUsageExpiryByEmail[email] = Date.now() + ATLAS_CACHE_TTL_MS;
    return data as AtlasUsageStatusResponse;
  })());
  try {
    return await atlasUsageInFlightByEmail.get(email)!;
  } finally {
    atlasUsageInFlightByEmail.delete(email);
  }
};

export const getAtlasAccessCode = async (
  email: string
): Promise<AtlasAccessCodeResponse> => {
  const url = `${ATLAS_BASE_URL}/v1/user/access-code?email=${encodeURIComponent(email)}`;
  const res = await fetch(url, {
    method: "GET",
    headers: {
      Accept: "application/json",
      "X-Pepron-Key": process.env.ATLAS_API_KEY || "",
      email,
    },
    cache: "no-store",
  });
  if (!res.ok) {
    let message = `Failed to fetch access code (${res.status})`;
    try {
      const txt = await res.text();
      if (txt) message = txt;
    } catch {}
    throw new Error(message);
  }
  return res.json();
};

export const updateAtlasAccessCode = async (
  email: string
): Promise<AtlasAccessCodeResponse> => {
  const url = `${ATLAS_BASE_URL}/v1/user/access-code/update`;
  const res = await fetch(url, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "X-Pepron-Key": process.env.ATLAS_API_KEY || "",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email }),
    cache: "no-store",
  });
  if (!res.ok) {
    let message = `Failed to update access code (${res.status})`;
    try {
      const txt = await res.text();
      if (txt) message = txt;
    } catch {}
    throw new Error(message);
  }
  return res.json();
};

export const getAtlasAccessCodeClient = async (
  email: string,
  options?: { force?: boolean }
): Promise<AtlasAccessCodeResponse> => {
  const now = Date.now();
  const force = options?.force === true;
  if (!force) {
    const exp = atlasExpiryByEmail[email] || 0;
    if (exp > now && cachedAtlasByEmail[email]) {
      return cachedAtlasByEmail[email];
    }
    const inflight = atlasInFlightByEmail.get(email);
    if (inflight) return inflight;
  }
  atlasInFlightByEmail.set(email, (async () => {
    const res = await fetch(`/api/atlas/access-code`, { cache: "no-store", headers: { "x-email": email } });
    const data = await res.json();
    if (!res.ok) throw new Error(data?.message || "Failed to load access code");
    cachedAtlasByEmail[email] = data as AtlasAccessCodeResponse;
    atlasExpiryByEmail[email] = Date.now() + ATLAS_CACHE_TTL_MS;
    return data as AtlasAccessCodeResponse;
  })());
  try {
    return await atlasInFlightByEmail.get(email)!;
  } finally {
    atlasInFlightByEmail.delete(email);
  }
};

export const updateAtlasAccessCodeClient = async (
  email: string
): Promise<AtlasAccessCodeResponse> => {
  const res = await fetch(`/api/atlas/access-code/update`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email }),
    cache: "no-store",
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data?.message || "Failed to update access code");
  cachedAtlasByEmail[email] = data as AtlasAccessCodeResponse;
  atlasExpiryByEmail[email] = Date.now() + ATLAS_CACHE_TTL_MS;
  return data as AtlasAccessCodeResponse;
};

export const recoverAtlasAccessCode = async (
  email: string
): Promise<AtlasAccessCodeResponse> => {
  const url = `${ATLAS_BASE_URL}/v1/user/access-code/recover`;
  const res = await fetch(url, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "X-Pepron-Key": process.env.ATLAS_API_KEY || "",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email }),
    cache: "no-store",
  });
  if (!res.ok) {
    let message = `Failed to recover access code (${res.status})`;
    try {
      const txt = await res.text();
      if (txt) message = txt;
    } catch {}
    throw new Error(message);
  }
  return res.json();
};

export const getAtlasUsageStatus = async (
  email: string
): Promise<AtlasUsageStatusResponse> => {
  const url = `${ATLAS_BASE_URL}/v1/user/usage/status?email=${encodeURIComponent(email)}`;
  const res = await fetch(url, {
    method: "GET",
    headers: {
      Accept: "application/json",
      "X-Pepron-Key": process.env.ATLAS_API_KEY || "",
    },
    cache: "no-store",
  });
  if (!res.ok) {
    let message = `Failed to fetch usage status (${res.status})`;
    try {
      const txt = await res.text();
      if (txt) message = txt;
    } catch {}
    throw new Error(message);
  }
  return res.json();
};

export const recoverAtlasAccessCodeClient = async (
  email: string
): Promise<AtlasAccessCodeResponse> => {
  const res = await fetch(`/api/atlas/access-code/recover`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email }),
    cache: "no-store",
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data?.message || "Failed to recover access code");
  cachedAtlasByEmail[email] = data as AtlasAccessCodeResponse;
  atlasExpiryByEmail[email] = Date.now() + ATLAS_CACHE_TTL_MS;
  return data as AtlasAccessCodeResponse;
};

export interface PromptModeProvider {
  mode: string;
  prompt: string | null;
  provider: string;
  scope: string;
  updatedAt: string | null;
}

export interface PromptModeStatusResponse {
  providers: PromptModeProvider[];
}

export const getPromptModeStatus = async (
  email: string
): Promise<PromptModeStatusResponse> => {
  const url = `${ATLAS_BASE_URL}/v1/prompt-mode/status?email=${encodeURIComponent(email)}`;
  const res = await fetch(url, {
    method: "GET",
    headers: {
      Accept: "application/json",
      "X-Pepron-Key": process.env.ATLAS_API_KEY || "",
    },
    cache: "no-store",
  });
  if (!res.ok) {
    let message = `Failed to fetch prompt mode status (${res.status})`;
    try {
      const txt = await res.text();
      if (txt) message = txt;
    } catch {}
    throw new Error(message);
  }
  return res.json();
};

export const getPromptModeStatusClient = async (
  email: string,
  options?: { force?: boolean }
): Promise<PromptModeStatusResponse> => {
  const res = await fetch(`/api/prompt-mode/status`, { cache: "no-store", headers: { "x-email": email } });
  const data = await res.json();
  if (!res.ok) throw new Error(data?.message || "Failed to load prompt mode status");
  return data as PromptModeStatusResponse;
};

export interface UpdatePromptModePayload {
  email: string;
  mode: "default" | "custom";
  prompt: string;
  provider: string;
  scope: string;
}

export const updatePromptMode = async (
  payload: UpdatePromptModePayload
): Promise<PromptModeProvider> => {
  const url = `${ATLAS_BASE_URL}/v1/prompt-mode`;
  const res = await fetch(url, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      "X-Pepron-Key": "loopsync-system-00AC256b7A",
    },
    body: JSON.stringify(payload),
    cache: "no-store",
  });
  if (!res.ok) {
    let message = `Failed to update prompt mode (${res.status})`;
    try {
      const txt = await res.text();
      if (txt) message = txt;
    } catch {}
    throw new Error(message);
  }
  return res.json();
};

export const updatePromptModeClient = async (
  payload: UpdatePromptModePayload
): Promise<PromptModeProvider> => {
  const res = await fetch(`/api/prompt-mode`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
    cache: "no-store",
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data?.message || "Failed to update prompt mode");
  return data as PromptModeProvider;
};

export const deletePromptMode = async (
  provider: string,
  email: string
): Promise<PromptModeProvider> => {
  const url = `${ATLAS_BASE_URL}/v1/prompt-mode?provider=${encodeURIComponent(provider)}`;
  const res = await fetch(url, {
    method: "DELETE",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      "X-Pepron-Key": "loopsync-system-00AC256b7A",
    },
    body: JSON.stringify({ email }),
    cache: "no-store",
  });
  if (!res.ok) {
    let message = `Failed to delete prompt mode (${res.status})`;
    try {
      const txt = await res.text();
      if (txt) message = txt;
    } catch {}
    throw new Error(message);
  }
  return res.json();
};

export const deletePromptModeClient = async (
  provider: string,
  email: string
): Promise<PromptModeProvider> => {
  const res = await fetch(`/api/prompt-mode?provider=${encodeURIComponent(provider)}`, {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email }),
    cache: "no-store",
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data?.message || "Failed to delete prompt mode");
  return data as PromptModeProvider;
};

export interface SmartActionsResponse {
  stealthMode: boolean;
  sphereBoxMode: boolean;
  completionSound: boolean;
  temporaryLock: boolean;
  incognitoCapture: boolean;
}

export type SmartActionKey = keyof SmartActionsResponse;

export interface UpdateSmartActionPayload {
  email: string;
  key: SmartActionKey;
  enabled: boolean;
}

export const getSmartActions = async (
  email: string
): Promise<SmartActionsResponse> => {
  const url = `${ATLAS_BASE_URL}/v1/smart-actions?email=${encodeURIComponent(email)}`;
  const res = await fetch(url, {
    method: "GET",
    headers: {
      Accept: "application/json",
      "X-Pepron-Key": process.env.ATLAS_API_KEY || "",
    },
    cache: "no-store",
  });
  if (!res.ok) {
    let message = `Failed to fetch smart actions (${res.status})`;
    try {
      const txt = await res.text();
      if (txt) message = txt;
    } catch {}
    throw new Error(message);
  }
  return res.json();
};

export const getSmartActionsClient = async (
  email: string
): Promise<SmartActionsResponse> => {
  const res = await fetch(`/api/v1/smart-actions`, { cache: "no-store", headers: { "x-email": email } });
  const data = await res.json();
  if (!res.ok) throw new Error(data?.error || data?.message || "Failed to load smart actions");
  return data as SmartActionsResponse;
};

export const updateSmartAction = async (
  payload: UpdateSmartActionPayload
): Promise<{ key: string; enabled: boolean; message: string }> => {
  const url = `${ATLAS_BASE_URL}/v1/smart-actions`;
  const res = await fetch(url, {
    method: "PATCH",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      "X-Pepron-Key": process.env.ATLAS_API_KEY || "",
    },
    body: JSON.stringify(payload),
    cache: "no-store",
  });
  if (!res.ok) {
    let message = `Failed to update smart action (${res.status})`;
    try {
      const txt = await res.text();
      if (txt) message = txt;
    } catch {}
    throw new Error(message);
  }
  return res.json();
};

export const updateSmartActionClient = async (
  payload: UpdateSmartActionPayload
): Promise<{ key: string; enabled: boolean; message: string }> => {
  const res = await fetch(`/api/v1/smart-actions`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
    cache: "no-store",
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data?.error || data?.message || "Failed to update smart action");
  return data as { key: string; enabled: boolean; message: string };
};

export interface AtlasCollectionItem {
  id: string;
  date: string;
  time: string;
  owner: string;
  interaction: string;
  session: string;
  providers: string[];
  actions: string[];
}

export interface AtlasCollectionsResponse {
  collections: AtlasCollectionItem[];
}

export const getAtlasCollections = async (
  email: string
): Promise<AtlasCollectionsResponse> => {
  const url = `${ATLAS_BASE_URL}/v1/atlas/collections?email=${encodeURIComponent(email)}`;
  const res = await fetch(url, {
    method: "GET",
    headers: {
      Accept: "application/json",
      "X-Pepron-Key": process.env.ATLAS_API_KEY || "",
    },
    cache: "no-store",
  });
  if (!res.ok) {
    let message = `Failed to fetch atlas collections (${res.status})`;
    try {
      const txt = await res.text();
      if (txt) message = txt;
    } catch {}
    throw new Error(message);
  }
  if (res.status === 204) {
    return { collections: [] };
  }
  try {
    return await res.json();
  } catch {
    return { collections: [] };
  }
};

export const getAtlasCollectionsClient = async (
  email: string
): Promise<AtlasCollectionsResponse> => {
  const res = await fetch(`/api/v1/atlas/collections`, { cache: "no-store", headers: { "x-email": email } });
  const ct = res.headers.get("content-type") || "";
  if (ct.includes("application/json")) {
    const data = await res.json();
    if (!res.ok) throw new Error(data?.error || data?.message || "Failed to load atlas collections");
    return data as AtlasCollectionsResponse;
  }
  const txt = await res.text();
  if (!res.ok) throw new Error(txt || "Failed to load atlas collections");
  return { collections: [] };
};

export interface ProviderResponseDetail {
  engine: string;
  content: string;
}

export interface AtlasCollectionDetail {
  id: string;
  session: string;
  interaction: string;
  responses: {
    openai?: ProviderResponseDetail;
    gemini?: ProviderResponseDetail;
    grok?: ProviderResponseDetail;
  };
}

export const getAtlasCollectionDetail = async (
  id: string,
  email: string
): Promise<AtlasCollectionDetail> => {
  const url = `${ATLAS_BASE_URL}/v1/atlas/collections/${encodeURIComponent(id)}/${encodeURIComponent(email)}`;
  const res = await fetch(url, {
    method: "GET",
    headers: {
      Accept: "application/json",
      "X-Pepron-Key": process.env.ATLAS_API_KEY || "",
    },
    cache: "no-store",
  });
  if (!res.ok) {
    let message = `Failed to fetch collection (${res.status})`;
    try {
      const txt = await res.text();
      if (txt) message = txt;
    } catch {}
    throw new Error(message);
  }
  return res.json();
};

export const getAtlasCollectionDetailClient = async (
  id: string,
  email: string
): Promise<AtlasCollectionDetail> => {
  const res = await fetch(`/api/v1/atlas/collections/${encodeURIComponent(id)}`, {
    method: "GET",
    cache: "no-store",
    headers: { "x-email": email },
  });
  const ct = res.headers.get("content-type") || "";
  if (ct.includes("application/json")) {
    const data = await res.json();
    if (!res.ok) throw new Error(data?.error || data?.message || "Failed to load collection");
    return data as AtlasCollectionDetail;
  }
  const txt = await res.text();
  throw new Error(txt || "Failed to load collection");
};

export const registerAtlasUser = async (
  email: string
): Promise<{ success: boolean; message: string }> => {
  const url = `${ATLAS_BASE_URL}/v1/auth/register`;
  const res = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Pepron-Key": process.env.ATLAS_API_KEY || "",
    },
    body: JSON.stringify({ email }),
    cache: "no-store",
  });
  
  if (!res.ok) {
    let message = `Failed to register Atlas user (${res.status})`;
    try {
      const txt = await res.text();
      if (txt) message = txt;
    } catch {}
    throw new Error(message);
  }
  
  return res.json();
};

export const registerAtlasUserClient = async (
  email: string
): Promise<{ success: boolean; message: string }> => {
  const res = await fetch(`/api/atlas/auth/register`, {
    method: "POST",
    headers: { 
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email }),
    cache: "no-store",
  });
  
  const data = await res.json();
  if (!res.ok) throw new Error(data?.message || "Failed to register Atlas user");
  return data;
};
