import type { JobStatus } from "@/lib/api";

export default function StatusStepper({ status }: { status: JobStatus }) {
  const steps = [
    { id: "queued", label: "Queued" },
    { id: "processing", label: "Processing" },
    { id: "done", label: "Done" },
  ];

  const activeIdx = steps.findIndex((s) => s.id === status);
  const isActive = (idx: number) => idx <= activeIdx;

  return (
    <div className="flex items-center justify-between max-w-sm mx-auto">
      {steps.map((step, idx) => (
        <div key={step.id} className="flex flex-col items-center flex-1">
          {/* Circle */}
          <div
            className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium transition-colors ${
              isActive(idx)
                ? "bg-blue-500 text-white"
                : "bg-stone-200 text-stone-500"
            } ${idx === activeIdx && status === "processing" ? "animate-pulse" : ""}`}
          >
            {isActive(idx) && idx < activeIdx ? "✓" : idx + 1}
          </div>
          <p className="text-xs text-stone-600 mt-2 text-center">{step.label}</p>

          {/* Connector */}
          {idx < steps.length - 1 && (
            <div
              className={`h-1 flex-1 mx-2 mt-1 rounded transition-colors ${
                isActive(idx + 1) ? "bg-blue-500" : "bg-stone-200"
              }`}
            />
          )}
        </div>
      ))}
    </div>
  );
}