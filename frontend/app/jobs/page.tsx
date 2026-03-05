"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { api } from "@/lib/api";

interface Job {
  id: number;
  job_id: string;
  title: string;
  location: string;
  employment_type: string;
  department: string;
  salary_range: string;
  status: string;
}

export default function JobsPage() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const data = await api.getAllJobs();
        setJobs(data.data);
      } catch (err: any) {
        setError(err.message || "Failed to load jobs");
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, []);

  if (loading) {
    return (
      <main className="min-h-screen px-10 py-10">
        <p className="text-slate-500">Loading jobs...</p>
      </main>
    );
  }

  if (error) {
    return (
      <main className="min-h-screen px-10 py-10">
        <p className="text-red-500">{error}</p>
      </main>
    );
  }

  return (
    <main className="min-h-screen px-10 py-10">
      <h1 className="text-3xl font-bold text-slate-900 mb-6">Open Positions</h1>
      {jobs.length === 0 ? (
        <p className="text-slate-500">No open positions at the moment.</p>
      ) : (
        <div className="grid gap-4">
          {jobs.map((job) => (
            <div key={job.id} className="bg-white rounded-lg shadow p-6 flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-slate-900">{job.title}</h2>
                <div className="flex gap-4 mt-1 text-sm text-slate-500">
                  <span>{job.location}</span>
                  <span>{job.employment_type}</span>
                  {job.department && <span>{job.department}</span>}
                  {job.salary_range && <span>{job.salary_range}</span>}
                </div>
              </div>
              <Link
                href={`/jobs/${job.id}`}
                className="inline-block px-6 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
              >
                Apply Now
              </Link>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}