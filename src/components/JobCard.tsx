"use client";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import type { JobListItem } from "../lib/api";

const chipClass: Record<string, string> = {
  queued:     "bg-amber-100 text-amber-800 border border-amber-200",
  processing: "bg-blue-100 text-blue-800 border border-blue-200 animate-pulse",
  done:       "bg-green-100 text-green-800 border border-green-200",
  failed:     "bg-red-100 text-red-800 border border-red-200",
};

export default function JobCard({ job, showUsername = false }: { job: JobListItem; showUsername?: boolean }) {
  return (
    <Link href={`/job/${job.job_id}`} className="block group">
      <div className="card">
        <div className="relative aspect-[4/3] bg-stone-100 overflow-hidden">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={job.input_image_url} alt="" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" loading="lazy" />
          {(job.status === "queued" || job.status === "processing") && (
            <div className="absolute inset-0 bg-amber-400/10 animate-pulse" />
          )}
          <span className={`absolute top-2 left-2 text-xs font-medium px-2 py-0.5 rounded-full ${chipClass[job.status]}`}>
            {job.status}
          </span>
        </div>
        <div className="p-3">
          {job.title && <p className="text-sm font-medium truncate text-stone-800">{job.title}</p>}
          <div className="flex justify-between items-center mt-0.5">
            {showUsername && <span className="text-xs text-stone-500">@{job.username}</span>}
            <span className="text-xs text-stone-400 ml-auto">{formatDistanceToNow(new Date(job.created_at), { addSuffix: true })}</span>
          </div>
        </div>
      </div>
    </Link>
  );
}