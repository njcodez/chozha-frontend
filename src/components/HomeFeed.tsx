"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { getUserJobs, listJobs, type JobListItem } from "@/lib/api";
import { getUsername } from "@/lib/cookies";
import JobCard from "./JobCard";
import Header from '@/components/Header';

export default function HomeFeed() {
  const username = getUsername()!;
  const [myJobs, setMyJobs] = useState<JobListItem[]>([]);
  const [publicJobs, setPublicJobs] = useState<JobListItem[]>([]);
  const [sort, setSort] = useState<"newest" | "grouped">("newest");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    Promise.all([getUserJobs(username), listJobs({ limit: 50 })])
      .then(([mine, pub]) => { setMyJobs(mine); setPublicJobs(pub.items); })
      .catch(() => setError("Could not reach the server. Is the backend running?"))
      .finally(() => setLoading(false));
  }, [username]);

  const sortedPublic = sort === "grouped"
    ? [...publicJobs].sort((a, b) => a.username.localeCompare(b.username))
    : publicJobs;

  return (
    <div className="min-h-screen bg-[#fdf8f0]">
      <Header username={username} />
      <main className="max-w-5xl mx-auto px-4 py-6">
        {error && <div className="error-banner mb-4">{error}</div>}
        <Tabs defaultValue="mine">
          <TabsList className="mb-6">
            <TabsTrigger value="mine">My Work</TabsTrigger>
            <TabsTrigger value="public">Public Feed</TabsTrigger>
          </TabsList>

          <TabsContent value="mine">
            {loading ? <GridSkeleton /> : myJobs.length === 0
              ? <Empty text="You haven't uploaded anything yet." />
              : <Grid jobs={myJobs} />}
          </TabsContent>

          <TabsContent value="public">
            <div className="flex justify-end mb-4">
              <select
                className="text-sm border border-stone-200 rounded-lg px-3 py-1.5 bg-white"
                value={sort}
                onChange={e => setSort(e.target.value as typeof sort)}
              >
                <option value="newest">Newest First</option>
                <option value="grouped">Grouped by Username</option>
              </select>
            </div>
            {loading ? <GridSkeleton /> : sortedPublic.length === 0
              ? <Empty text="No public jobs yet." />
              : <Grid jobs={sortedPublic} showUsername />}
          </TabsContent>
        </Tabs>
      </main>

      {/* FAB */}
      <Link
        href="/upload"
        className="fixed bottom-6 right-6 w-14 h-14 rounded-full text-white flex items-center justify-center shadow-lg hover:scale-105 transition-transform"
        style={{ background: "var(--gold, #c9952a)" }}
        aria-label="Upload inscription"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
        </svg>
      </Link>
    </div>
  );
}

function Grid({ jobs, showUsername = false }: { jobs: JobListItem[]; showUsername?: boolean }) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
      {jobs.map(j => <JobCard key={j.job_id} job={j} showUsername={showUsername} />)}
    </div>
  );
}

function GridSkeleton() {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
      {Array.from({ length: 8 }).map((_, i) => (
        <div key={i} className="rounded-xl overflow-hidden border border-stone-200">
          <div className="aspect-[4/3] skeleton" />
          <div className="p-3 space-y-2">
            <div className="skeleton h-3 w-3/4 rounded" />
            <div className="skeleton h-3 w-1/3 rounded" />
          </div>
        </div>
      ))}
    </div>
  );
}

function Empty({ text }: { text: string }) {
  return <p className="text-center text-stone-400 py-16 text-sm">{text}</p>;
}