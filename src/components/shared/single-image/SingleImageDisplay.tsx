"use client";

import React, { FC, useEffect } from "react";
import Image from "next/image";
import PhotoSwipeLightbox from "photoswipe/lightbox";
import "photoswipe/style.css";

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
}

const SingleImageDisplay: FC<SingleImageDisplayProps> = ({ title, image }) => {
  const defaultImage: SingleImage = {
    thumbnailURL: "/placeholder.webp",
    largeURL: "/placeholder.webp",
    width: 1200,
    height: 800,
    alt: title,
  };

  const displayImage = image || defaultImage;
  const galleryID = `single-${title.replace(/\s+/g, "-")}`;

  const aspectRatio = (displayImage.height / displayImage.width) * 100;

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
    <div className="pswp-gallery h-full" id={galleryID}>
      <div className="bg-muted relative h-full w-full overflow-hidden rounded-lg border">
        <div
          className="relative w-full"
          style={{ paddingBottom: `${aspectRatio}%` }}
        >
          <a
            href={displayImage.largeURL}
            data-pswp-width={displayImage.width}
            data-pswp-height={displayImage.height}
            className="absolute inset-0"
          >
            <Image
              src={displayImage.thumbnailURL}
              alt={displayImage.alt || title}
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-contain"
              priority
            />
          </a>
        </div>
      </div>
    </div>
  );
};

export default SingleImageDisplay;
