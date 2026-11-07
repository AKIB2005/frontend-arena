import { cn } from '../lib/utils'

const skeletonBase = 'animate-pulse rounded-lg bg-line/60'

export function CardSkeleton() {
  return (
    <div className="flex gap-4 rounded-xl border border-line bg-white p-5" aria-hidden>
      <div className={cn(skeletonBase, 'h-16 w-16 rounded-full')} />
      <div className="flex flex-1 flex-col gap-2">
        <div className={cn(skeletonBase, 'h-5 w-3/4')} />
        <div className={cn(skeletonBase, 'h-4 w-1/2')} />
        <div className={cn(skeletonBase, 'mt-2 h-5 w-1/3')} />
        <div className="mt-2 flex gap-2">
          <div className={cn(skeletonBase, 'h-8 w-28 rounded-full')} />
          <div className={cn(skeletonBase, 'h-8 w-20 rounded-full')} />
        </div>
      </div>
    </div>
  )
}
