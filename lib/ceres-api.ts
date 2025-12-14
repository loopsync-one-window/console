export const CERES_BASE_URL = "http://localhost:9000"

export interface CeresAccessCodeResponse {
  provider: string
  appName: string
  currentAccessCode: string
  totalChangeCount: string
  isChargable: boolean
  isBlocked: boolean
}

export interface CeresUsageStatusResponse {
  email: string
  channel: string
  totalConsumedRequests: number
  totalBurnRate: number
}

export interface CeresCollectionItem {
  id: string
  date: string
  time: string
  owner: string
  interaction: string
  session: string
  actions: string[]
}

export interface CeresCollectionsResponse {
  collections: CeresCollectionItem[]
}

export interface CeresCollectionDetail {
  id: string
  session: string
  interaction: string
  goal?: string
  responses: {
    todos?: unknown[]
    actions?: unknown[]
    message?: string
    requestId?: string
  }
}
let cachedCeresByEmail: Record<string, CeresAccessCodeResponse> = {}
let ceresExpiryByEmail: Record<string, number> = {}
const CERES_CACHE_TTL_MS = 15 * 60 * 1000
const ceresInFlightByEmail: Map<string, Promise<CeresAccessCodeResponse>> = new Map()

let cachedCeresUsageByEmail: Record<string, CeresUsageStatusResponse> = {}
let ceresUsageExpiryByEmail: Record<string, number> = {}
const ceresUsageInFlightByEmail: Map<string, Promise<CeresUsageStatusResponse>> = new Map()

export const getCachedCeresAccessCode = (email: string): CeresAccessCodeResponse | null => {
  const exp = ceresExpiryByEmail[email] || 0
  if (exp > Date.now() && cachedCeresByEmail[email]) return cachedCeresByEmail[email]
  return null
}

export const invalidateCeresAccessCodeCache = (email?: string) => {
  if (email) {
    delete cachedCeresByEmail[email]
    delete ceresExpiryByEmail[email]
    ceresInFlightByEmail.delete(email)
  } else {
    cachedCeresByEmail = {}
    ceresExpiryByEmail = {}
    ceresInFlightByEmail.clear()
    cachedCeresUsageByEmail = {}
    ceresUsageExpiryByEmail = {}
    ceresUsageInFlightByEmail.clear()
  }
}

export const getCeresAccessCode = async (
  email: string
): Promise<CeresAccessCodeResponse> => {
  const url = `${CERES_BASE_URL}/v1/user/access-code?email=${encodeURIComponent(email)}`
  const res = await fetch(url, {
    method: "GET",
    headers: {
      Accept: "application/json",
      "X-Pepron-Key": process.env.CERES_API_KEY || "ceres.access.9048BBDGEB32",
    },
    cache: "no-store",
  })
  if (!res.ok) {
    let message = `Failed to fetch access code (${res.status})`
    try {
      const txt = await res.text()
      if (txt) message = txt
    } catch {}
    throw new Error(message)
  }
  return res.json()
}

export const getCeresAccessCodeClient = async (
  email: string,
  options?: { force?: boolean }
): Promise<CeresAccessCodeResponse> => {
  const now = Date.now()
  const force = options?.force === true
  if (!force) {
    const exp = ceresExpiryByEmail[email] || 0
    if (exp > now && cachedCeresByEmail[email]) {
      return cachedCeresByEmail[email]
    }
    const inflight = ceresInFlightByEmail.get(email)
    if (inflight) return inflight
  }
  ceresInFlightByEmail.set(email, (async () => {
    const res = await fetch(`/api/ceres/access-code`, { cache: "no-store", headers: { "x-email": email } })
    const data = await res.json()
    if (!res.ok) throw new Error(data?.message || "Failed to load access code")
    cachedCeresByEmail[email] = data as CeresAccessCodeResponse
    ceresExpiryByEmail[email] = Date.now() + CERES_CACHE_TTL_MS
    return data as CeresAccessCodeResponse
  })())
  try {
    return await ceresInFlightByEmail.get(email)!
  } finally {
    ceresInFlightByEmail.delete(email)
  }
}

export const getCeresUsageStatus = async (
  email: string
): Promise<CeresUsageStatusResponse> => {
  const url = `${CERES_BASE_URL}/v1/user/usage/status?email=${encodeURIComponent(email)}`
  const res = await fetch(url, {
    method: "GET",
    headers: {
      Accept: "application/json",
      "X-Pepron-Key": process.env.CERES_API_KEY || "ceres.access.9048BBDGEB32",
    },
    cache: "no-store",
  })
  if (!res.ok) {
    let message = `Failed to fetch usage status (${res.status})`
    try {
      const txt = await res.text()
      if (txt) message = txt
    } catch {}
    throw new Error(message)
  }
  return res.json()
}

export const getCeresUsageStatusClient = async (
  email: string,
  options?: { force?: boolean }
): Promise<CeresUsageStatusResponse> => {
  const now = Date.now()
  const force = options?.force === true
  if (!force) {
    const exp = ceresUsageExpiryByEmail[email] || 0
    if (exp > now && cachedCeresUsageByEmail[email]) {
      return cachedCeresUsageByEmail[email]
    }
    const inflight = ceresUsageInFlightByEmail.get(email)
    if (inflight) return inflight
  }
  ceresUsageInFlightByEmail.set(email, (async () => {
    const res = await fetch(`/api/ceres/usage/status`, { cache: "no-store", headers: { "x-email": email } })
    const data = await res.json()
    if (!res.ok) throw new Error(data?.message || "Failed to load usage status")
    cachedCeresUsageByEmail[email] = data as CeresUsageStatusResponse
    ceresUsageExpiryByEmail[email] = Date.now() + CERES_CACHE_TTL_MS
    return data as CeresUsageStatusResponse
  })())
  try {
    return await ceresUsageInFlightByEmail.get(email)!
  } finally {
    ceresUsageInFlightByEmail.delete(email)
  }
}

export const getCeresCollections = async (
  email: string
): Promise<CeresCollectionsResponse> => {
  const url = `${CERES_BASE_URL}/v1/ceres/collections?email=${encodeURIComponent(email)}`
  const res = await fetch(url, {
    method: "GET",
    headers: {
      Accept: "application/json",
      "X-Pepron-Key": process.env.CERES_API_KEY || "ceres.access.9048BBDGEB32",
    },
    cache: "no-store",
  })
  if (!res.ok) {
    let message = `Failed to fetch ceres collections (${res.status})`
    try {
      const txt = await res.text()
      if (txt) message = txt
    } catch {}
    throw new Error(message)
  }
  try {
    return await res.json()
  } catch {
    return { collections: [] }
  }
}

export const getCeresCollectionsClient = async (
  email: string
): Promise<CeresCollectionsResponse> => {
  const res = await fetch(`/api/v1/ceres/collections`, { cache: "no-store", headers: { "x-email": email } })
  const ct = res.headers.get("content-type") || ""
  if (ct.includes("application/json")) {
    const data = await res.json()
    if (!res.ok) throw new Error(data?.error || data?.message || "Failed to load ceres collections")
    return data as CeresCollectionsResponse
  }
  const txt = await res.text()
  if (!res.ok) throw new Error(txt || "Failed to load ceres collections")
  return { collections: [] }
}

export const getCeresCollectionDetail = async (
  id: string,
  email: string
): Promise<CeresCollectionDetail> => {
  const url = `${CERES_BASE_URL}/v1/ceres/collections/${encodeURIComponent(id)}/${encodeURIComponent(email)}`
  const res = await fetch(url, {
    method: "GET",
    headers: {
      Accept: "application/json",
      "X-Pepron-Key": process.env.CERES_API_KEY || "ceres.access.9048BBDGEB32",
    },
    cache: "no-store",
  })
  if (!res.ok) {
    let message = `Failed to fetch ceres collection (${res.status})`
    try {
      const txt = await res.text()
      if (txt) message = txt
    } catch {}
    throw new Error(message)
  }
  return res.json()
}

export const getCeresCollectionDetailClient = async (
  id: string,
  email: string
): Promise<CeresCollectionDetail> => {
  const res = await fetch(`/api/v1/ceres/collections/${encodeURIComponent(id)}`, {
    method: "GET",
    cache: "no-store",
    headers: { "x-email": email },
  })
  const ct = res.headers.get("content-type") || ""
  if (ct.includes("application/json")) {
    const data = await res.json()
    if (!res.ok) throw new Error(data?.error || data?.message || "Failed to load ceres collection")
    return data as CeresCollectionDetail
  }
  const txt = await res.text()
  throw new Error(txt || "Failed to load ceres collection")
}

export const updateCeresAccessCode = async (
  email: string
): Promise<CeresAccessCodeResponse> => {
  const url = `${CERES_BASE_URL}/v1/user/access-code/update`
  const res = await fetch(url, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "X-Pepron-Key": process.env.CERES_API_KEY || "ceres.access.9048BBDGEB32",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email }),
    cache: "no-store",
  })
  if (!res.ok) {
    let message = `Failed to update access code (${res.status})`
    try {
      const txt = await res.text()
      if (txt) message = txt
    } catch {}
    throw new Error(message)
  }
  return res.json()
}

export const updateCeresAccessCodeClient = async (
  email: string
): Promise<CeresAccessCodeResponse> => {
  const res = await fetch(`/api/ceres/access-code/update`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email }),
    cache: "no-store",
  })
  const data = await res.json()
  if (!res.ok) throw new Error(data?.message || "Failed to update access code")
  cachedCeresByEmail[email] = data as CeresAccessCodeResponse
  ceresExpiryByEmail[email] = Date.now() + CERES_CACHE_TTL_MS
  return data as CeresAccessCodeResponse
}

export const recoverCeresAccessCode = async (
  email: string
): Promise<CeresAccessCodeResponse> => {
  const url = `${CERES_BASE_URL}/v1/user/access-code/recover`
  const res = await fetch(url, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "X-Pepron-Key": process.env.CERES_API_KEY || "ceres.access.9048BBDGEB32",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email }),
    cache: "no-store",
  })
  if (!res.ok) {
    let message = `Failed to recover access code (${res.status})`
    try {
      const txt = await res.text()
      if (txt) message = txt
    } catch {}
    throw new Error(message)
  }
  return res.json()
}

export const recoverCeresAccessCodeClient = async (
  email: string
): Promise<CeresAccessCodeResponse> => {
  const res = await fetch(`/api/ceres/access-code/recover`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email }),
    cache: "no-store",
  })
  const data = await res.json()
  if (!res.ok) throw new Error(data?.message || "Failed to recover access code")
  cachedCeresByEmail[email] = data as CeresAccessCodeResponse
  ceresExpiryByEmail[email] = Date.now() + CERES_CACHE_TTL_MS
  return data as CeresAccessCodeResponse
}

export const registerCeresUser = async (
  email: string
): Promise<{ success: boolean; message: string }> => {
  const url = `${CERES_BASE_URL}/auth/register`;
  const res = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Pepron-Key": process.env.CERES_API_KEY || "ceres.access.9048BBDGEB32",
    },
    body: JSON.stringify({ email }),
    cache: "no-store",
  });
  
  if (!res.ok) {
    let message = `Failed to register Ceres user (${res.status})`;
    try {
      const txt = await res.text();
      if (txt) message = txt;
    } catch {}
    throw new Error(message);
  }
  
  return res.json();
};

export const registerCeresUserClient = async (
  email: string
): Promise<{ success: boolean; message: string }> => {
  const res = await fetch(`/api/ceres/auth/register`, {
    method: "POST",
    headers: { 
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email }),
    cache: "no-store",
  });
  
  const data = await res.json();
  if (!res.ok) throw new Error(data?.message || "Failed to register Ceres user");
  return data;
};
