export default function CardSkeleton() {
  return (
    <div className="rounded-xl overflow-hidden border border-stone-200 bg-white animate-pulse">
      <div className="aspect-[4/3] bg-stone-200" />
      <div className="p-3 space-y-2">
        <div className="h-3 bg-stone-200 rounded w-3/4" />
        <div className="h-3 bg-stone-200 rounded w-1/3" />
      </div>
    </div>
  );
}