"use client";

import { FC, useEffect, useState } from "react";
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
import { ImageIcon } from "lucide-react";
import GallerySkeleton from "@/components/skeletons/GalleryImageSkeleton";

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
  images = [],
  maxImages = 7,
}) => {
  const [isLoading, setIsLoading] = useState(true);
  const [errorImages, setErrorImages] = useState<Record<string, boolean>>({});

  // Validate maxImages
  const validMaxImages = Math.max(1, Math.min(maxImages, 20));

  const handleImageError = (imageUrl: string) => {
    setErrorImages((prev) => ({
      ...prev,
      [imageUrl]: true,
    }));
  };

  const defaultImage = {
    thumbnailURL: "/placeholder.webp",
    largeURL: "/placeholder.webp",
    width: 1200,
    height: 800,
    alt: "Image not available",
  };

  // Filter out error images and handle fallbacks
  const galleryImages = images
    .filter((img) => img?.thumbnailURL && img?.largeURL)
    .slice(0, validMaxImages)
    .map((img) => {
      if (errorImages[img.thumbnailURL]) {
        return defaultImage;
      }
      return {
        thumbnailURL: img.thumbnailURL,
        largeURL: img.largeURL,
        width: img.width || 1200,
        height: img.height || 800,
        alt: img.alt || title || "Gallery Image",
      };
    });

  const galleryID = `gallery-${
    title
      ?.trim()
      .replace(/[^a-zA-Z0-9]+/g, "-")
      .toLowerCase() || "default"
  }`;

  useEffect(() => {
    if (images !== undefined) {
      setIsLoading(false);
    }
  }, [images]);

  useEffect(() => {
    if (galleryImages.length === 0) return;

    let lightbox: PhotoSwipeLightbox | null = null;

    try {
      lightbox = new PhotoSwipeLightbox({
        gallery: "#" + galleryID,
        children: "a",
        pswpModule: () => import("photoswipe"),
        wheelToZoom: true,
        initialZoomLevel: "fit", // This ensures image fits in viewport
        secondaryZoomLevel: 1, // This will show image at actual size
        maxZoomLevel: 4,
        imageClickAction: "zoom",
        tapAction: "zoom",
        doubleTapAction: "zoom",
        showHideAnimationType: "fade",
        preloadFirstSlide: true,
        preload: [1, 2], // Preload next/previous images
        padding: { top: 20, bottom: 20, left: 20, right: 20 },
        showAnimationDuration: 300,
        hideAnimationDuration: 300,
      });
      lightbox.init();
    } catch (error) {
      console.error("Error initializing PhotoSwipe:", error);
    }

    return () => {
      if (lightbox) {
        try {
          lightbox.destroy();
        } catch (error) {
          console.error("Error destroying PhotoSwipe:", error);
        }
      }
    };
  }, [galleryID, galleryImages.length]);

  if (isLoading) {
    return <GallerySkeleton />;
  }
  if (galleryImages.length === 0 && isLoading) {
    return <GallerySkeleton />;
  }

  if (galleryImages.length === 0 && !isLoading) {
    return (
      <div className="space-y-4">
        <div className="relative overflow-hidden rounded-lg border bg-muted">
          <div className="relative w-full" style={{ paddingBottom: "50%" }}>
            {" "}
            {/* 9:16 Aspect Ratio */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center text-muted-foreground">
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
    <div className="space-y-4">
      <div className="pswp-gallery" id={galleryID}>
        <div className="space-y-4">
          {/* Main Image */}
          <div className="relative overflow-hidden rounded-lg border bg-muted">
            <div
              className="relative w-full"
              style={{
                paddingBottom: `${Math.min(
                  Math.max(
                    (galleryImages[0].height / galleryImages[0].width) * 100,
                    100,
                  ),
                  75,
                )}%`,
              }}
            >
              <a
                href={galleryImages[0].largeURL}
                data-pswp-width={galleryImages[0].width}
                data-pswp-height={galleryImages[0].height}
                className="absolute inset-0"
              >
                <Image
                  src={galleryImages[0].thumbnailURL}
                  alt={galleryImages[0].alt}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 800px"
                  className="object-contain"
                  priority
                  onError={() =>
                    handleImageError(galleryImages[0].thumbnailURL)
                  }
                  unoptimized={errorImages[galleryImages[0].thumbnailURL]}
                />
              </a>
            </div>
          </div>

          {/* Carousel of Additional Images */}
          {galleryImages.length > 1 && (
            <Carousel
              opts={{
                align: "start",
                loop: galleryImages.length > 4,
              }}
              className="w-full"
            >
              <CarouselContent className="-ml-2 md:-ml-4">
                {galleryImages.slice(1).map((image, index) => (
                  <CarouselItem
                    key={`${image.thumbnailURL}-${index}`}
                    className="basis-1/2 pl-2 md:basis-1/4 md:pl-4"
                  >
                    <div className="relative overflow-hidden rounded-md border bg-muted">
                      <div
                        className="relative w-full"
                        style={{
                          paddingBottom: `${Math.min(
                            Math.max((image.height / image.width) * 100, 50),
                            100,
                          )}%`,
                        }}
                      >
                        <a
                          href={image.largeURL}
                          data-pswp-width={540}
                          data-pswp-height={720}
                          className="absolute inset-0"
                        >
                          <Image
                            src={image.thumbnailURL}
                            alt={image.alt}
                            fill
                            sizes="(max-width: 768px) 50vw, 25vw"
                            className="object-contain"
                            onError={() => handleImageError(image.thumbnailURL)}
                            unoptimized={errorImages[image.thumbnailURL]}
                          />
                        </a>
                      </div>
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
              {galleryImages.length > 4 && (
                <>
                  <CarouselPrevious className="-left-4 h-8 w-8" />
                  <CarouselNext className="-right-4 h-8 w-8" />
                </>
              )}
            </Carousel>
          )}
        </div>
      </div>
    </div>
  );
};

export default ImageGallery;
