"use client";

import React, { FC, useEffect, useState } from "react";
import Image from "next/image";
import PhotoSwipeLightbox from "photoswipe/lightbox";
import "photoswipe/style.css";
import { cn } from "@/lib/utils";

export interface SingleImage {
  thumbnailURL: string;
  largeURL: string;
  width: number;
  height: number;
  alt: string;
}

interface SingleImageDisplayProps {
  title: string;
  image?: SingleImage;
  className?: string;
}

const SingleImageDisplay: FC<SingleImageDisplayProps> = ({
  title,
  image,
  className,
}) => {
  const [dimensions, setDimensions] = useState({ width: 1200, height: 800 });
  const [imageError, setImageError] = useState(false);

  const defaultImage: SingleImage = {
    thumbnailURL: "/placeholder.webp",
    largeURL: "/placeholder.webp",
    width: dimensions.width,
    height: dimensions.height,
    alt: title,
  };

  const displayImage = imageError ? defaultImage : image || defaultImage;
  const galleryID = `single-${title.replace(/\s+/g, "-")}`;

  // Get actual image dimensions on load
  const handleImageLoad = (e: React.SyntheticEvent<HTMLImageElement>) => {
    const img = e.currentTarget;
    setDimensions({
      width: img.naturalWidth,
      height: img.naturalHeight,
    });
  };

  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement>) => {
    setImageError(true);
    e.currentTarget.src = defaultImage.thumbnailURL;
    setDimensions({ width: 1200, height: 800 }); // Reset to default dimensions
  };

  useEffect(() => {
    const lightbox = new PhotoSwipeLightbox({
      gallery: "#" + galleryID,
      children: "a",
      pswpModule: () => import("photoswipe"),
      wheelToZoom: true,
      initialZoomLevel: "fit",
      secondaryZoomLevel: 2,
      maxZoomLevel: 4,
      imageClickAction: "zoom",
      tapAction: "zoom",
      doubleTapAction: "zoom",
    });
    lightbox.init();

    return () => {
      lightbox.destroy();
    };
  }, [galleryID]);

  return (
    <div className="pswp-gallery h-full w-full" id={galleryID}>
      <div
        className={cn(
          "bg-muted relative aspect-[4/3] h-auto w-full overflow-hidden rounded-lg border md:aspect-auto md:h-full",
          className,
        )}
      >
        <div className="relative h-full w-full">
          <a
            href={displayImage.largeURL}
            data-pswp-width={dimensions.width}
            data-pswp-height={dimensions.height}
            className="relative block h-full w-full"
          >
            <Image
              src={displayImage.thumbnailURL}
              alt={displayImage.alt || title}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              className="object-contain"
              priority
              onLoad={handleImageLoad}
              onError={handleImageError}
              unoptimized={imageError} // Disable Next.js image optimization when using fallback
            />
          </a>
        </div>
      </div>
    </div>
  );
};

export default SingleImageDisplay;
