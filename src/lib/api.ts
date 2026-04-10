import { doc, getDoc } from "firebase/firestore";
import { db } from "./firebase";

let cachedBaseUrl: string | null = null;

async function getBaseUrl(): Promise<string> {
  if (cachedBaseUrl) return cachedBaseUrl;
  
  try {
    const docRef = doc(db, "config", "api_link");
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      const data = docSnap.data();
      const url = data && (data as { url?: unknown }).url;
      if (typeof url === "string") {
        cachedBaseUrl = url;
        return cachedBaseUrl;
      }
    }
  } catch {
    console.warn("Failed to fetch API URL from Firestore");
  }
  return "http://localhost:8000"; 
}

export type JobStatus = "queued" | "processing" | "done" | "failed";

export interface Job {
  job_id: string;
  username: string;
  title: string | null;
  description: string | null;
  status: JobStatus;
  error_message: string | null;
  is_public: boolean;
  created_at: string;
  updated_at: string;
  input_image_url: string;
  output_image_url: string | null;
}

export interface JobListItem {
  job_id: string;
  username: string;
  title: string | null;
  status: JobStatus;
  created_at: string;
  input_image_url: string;
}

interface ErrorResponse {
  detail?: string;
}

async function req<T>(path: string, init?: RequestInit): Promise<T> {
  const BASE = await getBaseUrl();
  const res = await fetch(`${BASE}${path}`, init);
  if (!res.ok) {
    let json: ErrorResponse = {};
    try {
      json = (await res.json()) as ErrorResponse;
    } catch {
      json = {};
    }
    throw new Error(json.detail ?? `HTTP ${res.status}`);
  }
  if (res.status === 204) return undefined as unknown as T;
  return (await res.json()) as T;
}

export const checkUsername = (u: string) =>
  req<{ taken: boolean }>(`/usernames/check?username=${encodeURIComponent(u)}`);

export const listJobs = (params: { username?: string; page?: number; limit?: number }) => {
  const q = new URLSearchParams();
  if (params.username) q.set("username", params.username);
  if (params.page !== undefined) q.set("page", params.page.toString());
  if (params.limit !== undefined) q.set("limit", params.limit.toString());
  return req<{ total: number; items: JobListItem[] }>(`/jobs?${q.toString()}`);
};

export const getUserJobs = (username: string) =>
  req<JobListItem[]>(`/users/${username}/jobs`);

export const getJob = (id: string) => req<Job>(`/jobs/${id}`);

export const createJob = (form: FormData) =>
  req<{ job_id: string }>("/jobs", { method: "POST", body: form });

export const patchJob = (
  id: string,
  body: Partial<Pick<Job, "title" | "description" | "is_public">>
) =>
  req<Job>(`/jobs/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

export const deleteJob = (id: string, master_password: string) =>
  req<void>(`/jobs/${id}`, {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ master_password }),
  });

// ✅ Function to refresh cached URL (call after updating in admin)
export function invalidateBaseUrlCache() {
  cachedBaseUrl = null;
}