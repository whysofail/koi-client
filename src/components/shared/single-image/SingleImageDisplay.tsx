"use client";

import React, { FC, useEffect, useState } from "react";
import Image from "next/image";
import PhotoSwipeLightbox from "photoswipe/lightbox";
import "photoswipe/style.css";
import { cn } from "@/lib/utils";
import { ImageIcon } from "lucide-react";

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
  const [imageError, setImageError] = useState(!image);

  const galleryID = `single-${title.replace(/\s+/g, "-")}`;

  const handleImageLoad = (e: React.SyntheticEvent<HTMLImageElement>) => {
    const img = e.currentTarget;
    setDimensions({
      width: img.naturalWidth,
      height: img.naturalHeight,
    });
  };

  const handleImageError = () => {
    setImageError(true);
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

  if (imageError || !image) {
    return (
      <div className="pswp-gallery h-full w-full rounded-xl">
        <div
          className={cn(
            "bg-muted relative aspect-[4/3] h-auto w-full overflow-hidden rounded-xl md:aspect-auto md:h-full",
            className,
          )}
        >
          <div className="relative h-full w-full rounded-xl">
            <div className="absolute inset-0 flex items-center justify-center rounded-xl">
              <div className="text-muted-foreground text-center">
                <ImageIcon className="mx-auto h-12 w-12" />
                <p className="mt-2 text-sm">No images available</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

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
            href={image.largeURL}
            data-pswp-width={dimensions.width}
            data-pswp-height={dimensions.height}
            className="relative block h-full w-full"
          >
            <Image
              src={image.thumbnailURL}
              alt={image.alt || title}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              className="object-contain"
              priority
              onLoad={handleImageLoad}
              onError={handleImageError}
            />
          </a>
        </div>
      </div>
    </div>
  );
};

export default SingleImageDisplay;
