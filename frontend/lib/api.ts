import { getCsrfToken } from "./security";

const BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

export const api = {

  // Jobs
  getAllJobs: async (page = 1, perPage = 10) => {
    const response = await fetch(`${BASE_URL}/jobs/?page=${page}&per_page=${perPage}`);
    const data = await response.json();
    if (!data.success) throw new Error(data.error);
    return data;
  },

  getSingleJob: async (id: string) => {
    const response = await fetch(`${BASE_URL}/jobs/${id}`);
    const data = await response.json();
    if (!data.success) throw new Error(data.error);
    return data;
  },

  // Jobs (Admin)
  createJob: async (payload: object) => {
    const csrfToken = getCsrfToken();
    const response = await fetch(`${BASE_URL}/admin/jobs`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(csrfToken ? { "X-CSRF-Token": csrfToken } : {}),
      },
      credentials: "include",
      body: JSON.stringify(payload),
    });
    const data = await response.json();
    if (!data.success) throw new Error(data.error);
    return data;
  },

  // ← NEW: get Cloudinary signature from Flask
  getCloudinarySignature: async () => {
    const response = await fetch(`${BASE_URL}/applicant/cloudinary-signature`);
    const data = await response.json();
    if (!data.success) throw new Error(data.error);
    return data.data;
  },

  // ← NEW: upload CV directly to Cloudinary from the browser
  uploadCVToCloudinary: async (file: File) => {
    const sig = await api.getCloudinarySignature();

    const formData = new FormData();
    formData.append("file", file);
    formData.append("signature", sig.signature);
    formData.append("timestamp", String(sig.timestamp));
    formData.append("api_key", sig.api_key);
    formData.append("folder", sig.folder);
    formData.append("public_id", sig.public_id);
    formData.append("overwrite", "true");

    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${sig.cloud_name}/auto/upload`,
      { method: "POST", body: formData }
    );

    if (!response.ok) throw new Error("CV upload to Cloudinary failed");
    const result = await response.json();
    return result.secure_url;
  },

  // ← UPDATED: now sends JSON instead of FormData
  submitApplication: async (payload: object) => {
    const response = await fetch(`${BASE_URL}/applicant/submit`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const data = await response.json();
    if (!data.success) throw new Error(data.error);
    return data;
  },

  // CV Parsing
  parseCV: async (resumeText: string) => {
    const response = await fetch(`/api/parse-cv`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ resume_text: resumeText }),
    });
    const data = await response.json();
    if (!data.success) throw new Error(data.error);
    return data;
  },
};