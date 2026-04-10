"use client";
import { useEffect, useState } from "react";
import { getApiUrl } from "@/lib/config";

export default function TestFirebase() {
  const [url, setUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
  const fetchUrl = async () => {
    try {
      const result = await getApiUrl();
      setUrl(result);
    } catch (err) {
      console.error("Failed to fetch API URL:", err);
      setUrl(null);
    } finally {
      setLoading(false);
    }
  };

  fetchUrl();
}, []);

  return (
    <div className="p-4">
      <h1>Firebase Test</h1>
      {loading ? <p>Loading...</p> : <p>API URL: <code>{url}</code></p>}
    </div>
  );
}
