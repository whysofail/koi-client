"use client";

import React, { FC, useEffect } from "react";
import Image from "next/image";
import PhotoSwipeLightbox from "photoswipe/lightbox";
import "photoswipe/style.css";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

interface GalleryImage {
  thumbnailURL: string;
  largeURL: string;
  width: number;
  height: number;
  alt: string;
}

interface ImageGalleryProps {
  title: string;
  images?: GalleryImage[];
  maxImages?: number;
}

const ImageGallery: FC<ImageGalleryProps> = ({
  title,
  images,
  maxImages = 7,
}) => {
  const defaultImages: GalleryImage[] = Array(maxImages).fill({
    thumbnailURL: "/placeholder.webp",
    largeURL: "/placeholder.webp",
    width: 1200,
    height: 800,
    alt: title,
  });

  const galleryImages = images || defaultImages;
  const galleryID = `gallery-${title.replace(/\s+/g, "-")}`;

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
    <div className="space-y-4">
      <div className="pswp-gallery" id={galleryID}>
        <div className="space-y-4">
          <div className="bg-muted relative overflow-hidden rounded-lg border">
            <div
              className="relative w-full"
              style={{
                paddingBottom: `${(galleryImages[0]?.height / galleryImages[0]?.width) * 100}%`,
              }}
            >
              <a
                href={galleryImages[0]?.largeURL}
                data-pswp-width={galleryImages[0]?.width}
                data-pswp-height={galleryImages[0]?.height}
                className="absolute inset-0"
              >
                <Image
                  src={galleryImages[0]?.thumbnailURL}
                  alt={galleryImages[0]?.alt || title}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  className="object-contain"
                  priority
                />
              </a>
            </div>
          </div>

          {galleryImages.length > 1 && (
            <Carousel
              opts={{
                align: "start",
                loop: true,
              }}
              className="w-full"
            >
              <CarouselContent className="-ml-2 md:-ml-4">
                {galleryImages.slice(1).map((image, index) => (
                  <CarouselItem key={index} className="basis-1/4 pl-2 md:pl-4">
                    <div className="bg-muted relative overflow-hidden rounded-md border">
                      <div
                        className="relative w-full"
                        style={{
                          paddingBottom: `${(image.height / image.width) * 100}%`,
                        }}
                      >
                        <a
                          href={image.largeURL}
                          data-pswp-width={image.width}
                          data-pswp-height={image.height}
                          className="absolute inset-0"
                        >
                          <Image
                            src={image.thumbnailURL}
                            alt={image.alt || `${title} - ${index + 2}`}
                            fill
                            sizes="(max-width: 768px) 25vw, 20vw"
                            className="object-contain"
                          />
                        </a>
                      </div>
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious className="-left-4 h-8 w-8" />
              <CarouselNext className="-right-4 h-8 w-8" />
            </Carousel>
          )}
        </div>
      </div>
    </div>
  );
};

export default ImageGallery;
