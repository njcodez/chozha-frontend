"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import ErrorBanner from "./ErrorBanner";

export default function DeleteModal({
  jobId,
  onConfirm,
  onClose,
}: {
  jobId: string;
  onConfirm: (password: string) => Promise<void>;
  onClose: () => void;
}) {
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleConfirm = async () => {
    if (!password) {
      setError("Please enter the password.");
      return;
    }
    setLoading(true);
    setError(null);
    try {
      await onConfirm(password);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Failed to delete. Wrong password?");
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/30 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-lg max-w-sm w-full p-6 space-y-4">
        <h2 className="text-lg font-semibold text-stone-900">Delete this job?</h2>
        <p className="text-sm text-stone-600">This action cannot be undone. Enter the master password to confirm deletion of job <code className="bg-stone-100 px-2 py-1 rounded text-xs">{jobId}</code>.</p>

        {error && <ErrorBanner message={error} />}

        <Input
          type="password"
          placeholder="Master password"
          value={password}
          onChange={(e) => {
            setPassword(e.target.value);
            setError(null);
          }}
          disabled={loading}
          onKeyDown={(e) => e.key === "Enter" && handleConfirm()}
        />

        <div className="flex gap-2 pt-2">
          <Button
            variant="outline"
            onClick={onClose}
            disabled={loading}
            className="flex-1"
          >
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={handleConfirm}
            disabled={loading || !password}
            className="flex-1"
          >
            {loading ? "Deleting…" : "Delete"}
          </Button>
        </div>
      </div>
    </div>
  );
}