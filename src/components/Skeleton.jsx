export function ProjectDetailSkeleton() {
  return (
    <div className="min-h-screen bg-background text-white pt-16 md:pt-20 font-body select-none">
      {/* Header Fold Skeleton */}
      <div className="relative border-b border-border py-16 md:py-24">
        <div className="container-main flex flex-col gap-8">
          {/* Back button link */}
          <div className="w-28 h-4 bg-elevated rounded-md animate-pulse" />
          
          {/* Main Title and Tagline */}
          <div className="flex flex-col gap-4 max-w-4xl">
            <div className="w-48 h-3 bg-elevated rounded-md animate-pulse" />
            <div className="w-3/4 h-12 bg-elevated rounded-md animate-pulse" />
            <div className="w-5/6 h-5 bg-elevated rounded-md mt-2 animate-pulse" />
          </div>

          {/* Metrics & CTAs row */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 border-t border-border pt-8 mt-4 items-center">
            <div className="md:col-span-2 grid grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex flex-col gap-2">
                  <div className="w-16 h-8 bg-elevated rounded-md animate-pulse" />
                  <div className="w-24 h-3 bg-elevated rounded-md animate-pulse" />
                </div>
              ))}
            </div>
            <div className="flex gap-4 md:justify-end">
              <div className="w-28 h-10 bg-elevated rounded-md animate-pulse" />
              <div className="w-28 h-10 bg-elevated rounded-md animate-pulse" />
            </div>
          </div>
        </div>
      </div>

      {/* Grid content mockup */}
      <div className="container-main py-16 md:py-20 flex flex-col gap-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-8 flex flex-col gap-4">
            <div className="w-32 h-4 bg-elevated rounded-md animate-pulse" />
            <div className="w-48 h-6 bg-elevated rounded-md animate-pulse" />
            <div className="w-full h-32 bg-elevated rounded-md mt-2 animate-pulse" />
          </div>
          <div className="lg:col-span-4 p-6 bg-surface border border-border rounded-lg flex flex-col gap-4 h-48">
            <div className="w-32 h-5 bg-elevated rounded-md animate-pulse" />
            <div className="w-full h-4 bg-elevated rounded-md animate-pulse" />
            <div className="w-2/3 h-4 bg-elevated rounded-md animate-pulse" />
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProjectDetailSkeleton;
