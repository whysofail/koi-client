"use client";

const GallerySkeleton = () => {
  return (
    <div className="space-y-4">
      {/* Main Image Skeleton */}
      <div className="relative overflow-hidden rounded-lg border bg-muted">
        <div
          className="relative w-full"
          style={{
            paddingBottom: "66.67%", // 3:2 aspect ratio
          }}
        >
          <div className="absolute inset-0">
            <div className="shimmer h-full w-full" />
          </div>
        </div>
      </div>

      {/* Thumbnail Skeletons */}
      <div className="grid grid-cols-2 gap-2 md:grid-cols-4 md:gap-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <div
            key={index}
            className="relative overflow-hidden rounded-md border bg-muted"
          >
            <div
              className="relative w-full"
              style={{
                paddingBottom: "66.67%",
              }}
            >
              <div className="absolute inset-0">
                <div className="shimmer h-full w-full" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default GallerySkeleton;
