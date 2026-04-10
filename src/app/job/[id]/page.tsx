"use client";
import React, { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { getJob, patchJob, deleteJob, type Job } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import ComparisonSlider from "@/components/ComparisonSlider";
import StatusStepper from "@/components/StatusStepper";
import DeleteModal from "@/components/DeleteModal";
import Header from "@/components/Header";
import { getUsername } from "@/lib/cookies";

export default function JobPage({ params }: { params: Promise<{ id: string }> }) {
  const unwrappedParams = React.use(params);
  const jobId = unwrappedParams.id;

  const router = useRouter();
  const username = getUsername();

  const [job, setJob] = useState<Job | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [showDelete, setShowDelete] = useState(false);
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [isPublic, setIsPublic] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const load = useCallback(async () => {
    try {
      const j = await getJob(jobId);
      setJob(j);
      setTitle(j.title ?? "");
      setDesc(j.description ?? "");
      setIsPublic(j.is_public);
    } catch {
      setError("Could not load this job. The server may be unreachable.");
    }
  }, [jobId]);

  useEffect(() => { void load(); }, [load]);

  // Poll while queued/processing
  useEffect(() => {
    if (!job || job.status === "done" || job.status === "failed") return;
    const t = setInterval(() => void load(), 3000);
    return () => clearInterval(t);
  }, [job, load]);

  const save = async () => {
    if (!job) return;
    setSaving(true);
    try {
      await patchJob(job.job_id, { title, description: desc, is_public: isPublic });
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch { /* ignore */ } finally { setSaving(false); }
  };

  const handleDelete = async (password: string) => {
    if (!job) return;
    await deleteJob(job.job_id, password);
    router.push("/");
  };

  if (error) return (
    <div className="min-h-screen bg-[#fdf8f0]">
      <Header username={username} />
      <div className="max-w-2xl mx-auto px-4 py-10">
        <div className="error-banner">{error}</div>
      </div>
    </div>
  );

  if (!job) return (
    <div className="min-h-screen bg-[#fdf8f0] flex items-center justify-center">
      <div className="w-8 h-8 border-2 border-stone-300 border-t-amber-500 rounded-full animate-spin" />
    </div>
  );

  const isPending = job.status === "queued" || job.status === "processing";

  return (
    <div className="min-h-screen bg-[#fdf8f0]">
      <Header username={username} />
      <main className="max-w-2xl mx-auto px-4 py-8 space-y-6">

        {/* Status stepper */}
        {isPending && (
          <div className="bg-white border border-stone-200 rounded-xl p-6 text-center space-y-4">
            <StatusStepper status={job.status} />
            <p className="text-sm text-stone-500">Processing your inscription with SAM2…</p>
          </div>
        )}

        {/* Input image with pulsing overlay while pending */}
        {isPending && (
          <div className="relative rounded-xl overflow-hidden">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={job.input_image_url} alt="Input" className="w-full" />
            <div className="absolute inset-0 bg-amber-400/15 animate-pulse" />
          </div>
        )}

        {/* Comparison slider when done */}
        {job.status === "done" && job.output_image_url && (
          <ComparisonSlider
            beforeSrc={job.input_image_url}
            afterSrc={job.output_image_url}
          />
        )}

        {/* Failed state */}
        {job.status === "failed" && (
          <div className="error-banner">
            Processing failed{job.error_message ? `: ${job.error_message}` : "."}
          </div>
        )}

        {/* Metadata form */}
        <div className="bg-white border border-stone-200 rounded-xl p-5 space-y-4">
          <h2 className="font-semibold text-stone-800 text-sm">Details</h2>
          <Input placeholder="Title (optional)" value={title} onChange={e => setTitle(e.target.value)} />
          <Textarea placeholder="Description (optional)" value={desc} onChange={e => setDesc(e.target.value)} rows={3} />
          <label className="flex items-center justify-between text-sm text-stone-700">
            <span>Public</span>
            <label className="toggle">
              <input type="checkbox" checked={isPublic} onChange={e => setIsPublic(e.target.checked)} />
              <span className="toggle-slider" />
            </label>
          </label>
          <Button onClick={save} disabled={saving} className="w-full">
            {saved ? "Saved ✓" : saving ? "Saving…" : "Save"}
          </Button>
        </div>

        {/* Download */}
        {job.status === "done" && job.output_image_url && (
          <a href={job.output_image_url} download className="btn-secondary w-full flex items-center justify-center gap-2 text-sm">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            Download binarized image
          </a>
        )}

        {/* Delete */}
        <button onClick={() => setShowDelete(true)}
          className="w-full text-sm text-red-500 hover:text-red-700 transition-colors py-2">
          Delete this job
        </button>
      </main>

      {showDelete && (
        <DeleteModal
          jobId={job.job_id}
          onConfirm={handleDelete}
          onClose={() => setShowDelete(false)}
        />
      )}
    </div>
  );
}