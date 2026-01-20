// export const API = "http://localhost:5000";

// // ---------- GET ----------
// export const apiGet = async (url: string, token?: string) => {
//   const res = await fetch(`${API}${url}`, {
//     headers: {
//       ...(token ? { Authorization: `Bearer ${token}` } : {})
//     },
//   });

//   return res.json();
// };

// // ---------- POST ----------
// export const apiPost = async (url: string, data: any, token?: string) => {
//   const res = await fetch(`${API}${url}`, {
//     method: "POST",
//     headers: {
//       "Content-Type": "application/json",
//       ...(token ? { Authorization: `Bearer ${token}` } : {})
//     },
//     body: JSON.stringify(data),
//   });

//   return res.json();
// };

// // ---------- FILE UPLOAD ----------
// export const apiUpload = async (url: string, formData: FormData, token: string) => {
//   const res = await fetch(`${API}${url}`, {
//     method: "POST",
//     headers: {
//       Authorization: `Bearer ${token}`,
//     },
//     body: formData,
//   });

//   return res.json();
// };

// // ---------- DELETE ----------
// export const apiDelete = async (url: string, token?: string) => {
//   const res = await fetch(`${API}${url}`, {
//     method: "DELETE",
//     headers: {
//       ...(token ? { Authorization: `Bearer ${token}` } : {})
//     },
//   });

//   return res.json();
// };


// // ---------- PUT ----------
// export const apiPut = async (url: string, data: any, token?: string) => {
//   const res = await fetch(`${API}${url}`, {
//     method: "PUT",
//     headers: {
//       "Content-Type": "application/json",
//       ...(token ? { Authorization: `Bearer ${token}` } : {}),
//     },
//     body: JSON.stringify(data),
//   });

//   return res.json();
// };

// src/lib/api.ts
// Base URL comes from .env (VITE_API_URL=http://localhost:5000/api)
const API_BASE = import.meta.env.VITE_API_URL || "https://filhaal.onrender.com/api";

/**
 * Get token from localStorage (so refresh keeps you signed in)
 */
function getToken(): string | null {
  return localStorage.getItem("token");
}

/**
 * Build headers for JSON / auth
 */
function buildHeaders(
  token?: string | null,
  extra?: Record<string, string>
): HeadersInit {
  const headers: Record<string, string> = extra ? { ...extra } : {};
  if (!headers["Content-Type"]) headers["Content-Type"] = "application/json";
  const t = token ?? getToken();
  if (t) headers["Authorization"] = `Bearer ${t}`;
  return headers;
}

/**
 * Generic request helper with proper error handling.
 * path should NOT include /api (API_BASE already includes it).
 * Example: request("GET", "/auth/me")
 */
async function request<T = any>(
  method: "GET" | "POST" | "PUT" | "DELETE",
  path: string,
  body?: any,
  options?: { token?: string | null; headers?: Record<string, string> }
): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    method,
    headers: buildHeaders(options?.token, options?.headers),
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });

  const isJson =
    res.headers.get("content-type")?.includes("application/json") ?? false;

  // Parse payload safely
  const payload = isJson ? await res.json().catch(() => ({})) : null;

  if (!res.ok) {
    const message =
      (payload && (payload.error || payload.message)) ||
      `Request failed (${res.status})`;
    throw new Error(message);
  }

  return (payload as T) ?? ({} as T);
}

/**
 * Public helpers
 */

// ---------- GET ----------
export async function apiGet<T = any>(
  path: string,
  token?: string | null
): Promise<T> {
  return request<T>("GET", path, undefined, { token });
}

// ---------- POST ----------
export async function apiPost<T = any>(
  path: string,
  data: any,
  token?: string | null
): Promise<T> {
  return request<T>("POST", path, data, { token });
}

// ---------- PUT ----------
export async function apiPut<T = any>(
  path: string,
  data: any,
  token?: string | null
): Promise<T> {
  return request<T>("PUT", path, data, { token });
}

// ---------- DELETE ----------
export async function apiDelete<T = any>(
  path: string,
  token?: string | null
): Promise<T> {
  return request<T>("DELETE", path, undefined, { token });
}

// ---------- FILE UPLOAD ----------
export async function apiUpload<T = any>(
  path: string,
  formData: FormData,
  token?: string | null
): Promise<T> {
  const t = token ?? getToken();
  const res = await fetch(`${API_BASE}${path}`, {
    method: "POST",
    // Do NOT set Content-Type for FormData; the browser sets proper boundary
    headers: t ? { Authorization: `Bearer ${t}` } : undefined,
    body: formData,
  });

  const isJson =
    res.headers.get("content-type")?.includes("application/json") ?? false;
  const payload = isJson ? await res.json().catch(() => ({})) : null;

  if (!res.ok) {
    const message =
      (payload && (payload.error || payload.message)) ||
      `Upload failed (${res.status})`;
    throw new Error(message);
  }
  return (payload as T) ?? ({} as T);
}

// ---------- API OBJECT FOR CONVENIENCE ----------
export const api = {
  get: apiGet,
  post: apiPost,
  put: apiPut,
  delete: apiDelete,
  upload: apiUpload,
};
