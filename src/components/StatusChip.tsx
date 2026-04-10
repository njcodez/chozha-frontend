import type { JobStatus } from "@/lib/api";

const chipStyles: Record<JobStatus, string> = {
  queued: "bg-amber-100 text-amber-800 border border-amber-200",
  processing: "bg-blue-100 text-blue-800 border border-blue-200 animate-pulse",
  done: "bg-green-100 text-green-800 border border-green-200",
  failed: "bg-red-100 text-red-800 border border-red-200",
};

export default function StatusChip({ status }: { status: JobStatus }) {
  return (
    <span className={`inline-flex items-center text-xs font-medium px-2.5 py-0.5 rounded-full capitalize ${chipStyles[status]}`}>
      {status}
    </span>
  );
}