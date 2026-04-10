"use client";
import { useState } from "react";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import ErrorBanner from "@/components/ErrorBanner";

export default function AdminPage() {
  const [password, setPassword] = useState("");
  const [authenticated, setAuthenticated] = useState(false);
  const [apiUrl, setApiUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleAuth = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === process.env.NEXT_PUBLIC_ADMIN_PASSWORD) {
      setAuthenticated(true);
      setError(null);
    } else {
      setError("Invalid password");
    }
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!apiUrl.trim()) {
      setError("URL cannot be empty");
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const docRef = doc(db, "config", "api_link");
      await updateDoc(docRef, { url: apiUrl.trim() });
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
      setApiUrl("");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to update URL");
    } finally {
      setLoading(false);
    }
  };

  if (!authenticated) {
    return (
      <div className="min-h-screen bg-[#fdf8f0] flex items-center justify-center p-4">
        <div className="bg-white rounded-xl border border-stone-200 p-6 w-full max-w-sm">
          <h1 className="text-xl font-semibold text-stone-900 mb-4">Admin Access</h1>
          <form onSubmit={handleAuth} className="space-y-4">
            <Input
              type="password"
              placeholder="Enter admin password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setError(null);
              }}
              autoFocus
            />
            {error && <ErrorBanner message={error} />}
            <Button type="submit" className="w-full">
              Unlock
            </Button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#fdf8f0] p-4">
      <div className="max-w-lg mx-auto mt-10">
        <div className="bg-white rounded-xl border border-stone-200 p-6 space-y-4">
          <h1 className="text-2xl font-semibold text-stone-900">API Configuration</h1>
          <p className="text-sm text-stone-500">Update the API URL for all clients</p>

          <form onSubmit={handleUpdate} className="space-y-4">
            <Input
              type="text"
              placeholder="https://api.example.com or http://localhost:8000"
              value={apiUrl}
              onChange={(e) => setApiUrl(e.target.value)}
              disabled={loading}
            />

            {error && <ErrorBanner message={error} />}

            {success && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-sm text-green-700">
                ✓ API URL updated successfully
              </div>
            )}

            <Button type="submit" disabled={loading || !apiUrl.trim()} className="w-full">
              {loading ? "Updating…" : "Update URL"}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}