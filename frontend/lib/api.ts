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

  // Applicant
  submitApplication: async (formData: FormData) => {
    const response = await fetch(`${BASE_URL}/applicant/submit`, {
      method: "POST",
      body: formData,
    });
    const data = await response.json();
    if (!data.success) throw new Error(data.error);
    return data;
  },

  // CV Parsing
  parseCV: async (resumeText: string) => {
    const response = await fetch(`${BASE_URL}/applicant/parse-cv`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ resume_text: resumeText }),
    });
    const data = await response.json();
    if (!data.success) throw new Error(data.error);
    return data;
  },
};
