"use client";
import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { getUsername } from "@/lib/cookies";
import { createJob } from "@/lib/api";
import { Button } from "@/components/ui/button";
import Header from "@/components/Header";

export default function UploadPage() {
  const router = useRouter();
  const username = getUsername();
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [dragging, setDragging] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInput = useRef<HTMLInputElement>(null);

  const pick = (f: File) => {
    setFile(f);
    setPreview(URL.createObjectURL(f));
  };

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault(); setDragging(false);
    const f = e.dataTransfer.files[0];
    if (f?.type.startsWith("image/")) pick(f);
  };

  const submit = async () => {
    if (!file || !username) return;
    setLoading(true); setError(null);
    try {
      const fd = new FormData();
      fd.append("image", file);
      fd.append("username", username);
      fd.append("is_public", "true");
      const { job_id } = await createJob(fd);
      router.push(`/job/${job_id}`);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Upload failed.");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#fdf8f0]">
      <Header username={username} />
      <main className="max-w-lg mx-auto px-4 py-10">
        <h1 className="font-catamaran font-bold text-2xl text-stone-800 mb-6">Upload Inscription</h1>

        {/* Dropzone */}
        <div
          className={`dropzone p-10 text-center cursor-pointer transition-colors ${dragging ? "active" : ""}`}
          onDragOver={e => { e.preventDefault(); setDragging(true); }}
          onDragLeave={() => setDragging(false)}
          onDrop={onDrop}
          onClick={() => fileInput.current?.click()}
        >
          {preview ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={preview} alt="Preview" className="max-h-64 mx-auto rounded-lg object-contain" />
          ) : (
            <div className="text-stone-400">
              <svg className="w-10 h-10 mx-auto mb-3" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
              </svg>
              <p className="font-medium text-stone-600">Drop image here or click to browse</p>
              <p className="text-xs mt-1">JPG, PNG, WEBP supported</p>
            </div>
          )}
        </div>

        {/* Hidden inputs */}
        <input ref={fileInput} type="file" accept="image/*" className="hidden"
          onChange={e => { const f = e.target.files?.[0]; if (f) pick(f); }} />
        {/* Mobile camera */}
        <input type="file" accept="image/*" capture="environment" className="hidden" id="camera-input"
          onChange={e => { const f = e.target.files?.[0]; if (f) pick(f); }} />

        <label htmlFor="camera-input"
          className="mt-3 w-full flex items-center justify-center gap-2 border border-stone-200 rounded-lg py-2.5 text-sm text-stone-600 cursor-pointer hover:bg-stone-50 transition-colors">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6.827 6.175A2.31 2.31 0 015.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 00-1.134-.175 2.31 2.31 0 01-1.64-1.055l-.822-1.316a2.192 2.192 0 00-1.736-1.039 48.774 48.774 0 00-5.232 0 2.192 2.192 0 00-1.736 1.039l-.821 1.316z" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 12.75a4.5 4.5 0 11-9 0 4.5 4.5 0 019 0zM18.75 10.5h.008v.008h-.008V10.5z" />
          </svg>
          Use camera
        </label>

        <div className="mt-3 p-3 bg-stone-100 rounded-lg text-sm text-stone-500">
          Uploading as <span className="font-medium text-stone-700">@{username}</span>
        </div>

        {error && <div className="error-banner mt-3">{error}</div>}

        <Button className="w-full mt-4" disabled={!file || loading} onClick={submit}>
          {loading ? "Uploading…" : "Process Inscription"}
        </Button>
      </main>
    </div>
  );
}