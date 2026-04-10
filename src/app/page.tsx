"use client";
import { useEffect, useState } from "react";
import { getUsername, setUsername } from "@/lib/cookies";
import { checkUsername } from "@/lib/api";
import HomeFeed from "@/components/HomeFeed";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type Phase = "splash" | "username" | "home";

export default function Page() {
  const [phase, setPhase] = useState<Phase>("splash");
  const [input, setInput] = useState("");
  const [takenWarning, setTakenWarning] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // If cookie exists, skip splash+username
    if (getUsername()) { setPhase("home"); return; }
    const t = setTimeout(() => setPhase("username"), 2000);
    return () => clearTimeout(t);
  }, []);

  const submit = async (forceProceed = false) => {
    if (!input.trim()) return;
    setLoading(true); setError(null);
    try {
      if (!forceProceed) {
        const { taken } = await checkUsername(input.trim());
        if (taken) { setTakenWarning(true); setLoading(false); return; }
      }
      setUsername(input.trim());
      setPhase("home");
    } catch {
      setError("Could not reach the server. Check your connection.");
    } finally {
      setLoading(false);
    }
  };

  if (phase === "splash") return (
    <div className="min-h-screen flex items-center justify-center bg-[#fdf8f0]">
      <div className="text-center animate-fadeIn">
        <p className="font-catamaran text-stone-400 text-sm mb-1">சோழர் கல்வெட்டு</p>
        <h1 className="font-catamaran font-bold text-5xl text-stone-800">Project Chozha</h1>
        <p className="text-stone-400 mt-2 text-sm">Tamil inscription binarization</p>
      </div>
    </div>
  );

  if (phase === "username") return (
    <div className="min-h-screen flex items-center justify-center bg-[#fdf8f0] p-4">
      <div className="w-full max-w-sm animate-fadeIn">
        <h1 className="font-catamaran font-bold text-3xl text-stone-800 mb-1">Choose a username</h1>
        <p className="text-stone-500 text-sm mb-6">This identifies your work in the community feed.</p>
        <Input
          value={input}
          onChange={e => { setInput(e.target.value); setTakenWarning(false); }}
          onKeyDown={e => e.key === "Enter" && submit()}
          placeholder="e.g. arjun_epigraphy"
          disabled={loading}
        />
        {error && <p className="text-red-500 text-xs mt-2">{error}</p>}
        {takenWarning ? (
          <div className="mt-3 p-3 bg-amber-50 border border-amber-200 rounded-lg text-sm text-amber-800">
            <p className="mb-2">This username is already taken — proceed anyway or choose a different one.</p>
            <div className="flex gap-2">
              <Button size="sm" variant="outline" onClick={() => setTakenWarning(false)}>Choose different</Button>
              <Button size="sm" onClick={() => submit(true)}>Proceed anyway</Button>
            </div>
          </div>
        ) : (
          <Button className="w-full mt-3" onClick={() => submit()} disabled={loading || !input.trim()}>
            {loading ? "Checking…" : "Continue →"}
          </Button>
        )}
      </div>
    </div>
  );

  return <HomeFeed />;
}