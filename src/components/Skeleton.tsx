export function CardSkeleton() {
  return (
    <div
      aria-hidden="true"
      className="flex animate-pulse gap-4 rounded-xl border-2 border-edge bg-surface p-5 shadow-hard"
    >
      <div className="h-[72px] w-[72px] shrink-0 rounded-full border-2 border-edge bg-paper" />
      <div className="flex-1 space-y-3">
        <div className="h-5 w-3/4 rounded-md bg-paper" />
        <div className="h-4 w-1/2 rounded-md bg-paper" />
        <div className="h-10 w-2/3 rounded-xl bg-paper" />
      </div>
    </div>
  )
}
