"use client";

import type React from "react";

import { type FC, useEffect, useState, useRef } from "react";
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
import { ChevronLeft, ChevronRight, ImageIcon, ZoomIn } from "lucide-react";
import GallerySkeleton from "@/components/skeletons/GalleryImageSkeleton";
import { Button } from "@/components/ui/button";

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
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const lightboxRef = useRef<PhotoSwipeLightbox | null>(null);
  const galleryRef = useRef<HTMLDivElement>(null);

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

  // Navigation functions
  const goToPrevious = (e: React.MouseEvent) => {
    e.stopPropagation(); // Stop event propagation
    setActiveImageIndex((prev) =>
      prev === 0 ? galleryImages.length - 1 : prev - 1,
    );
  };

  const goToNext = (e: React.MouseEvent) => {
    e.stopPropagation(); // Stop event propagation
    setActiveImageIndex((prev) =>
      prev === galleryImages.length - 1 ? 0 : prev + 1,
    );
  };

  const setActiveImage = (index: number) => {
    setActiveImageIndex(index);
  };

  // Function to open the lightbox programmatically
  const openLightbox = (index: number = activeImageIndex) => {
    if (lightboxRef.current && galleryRef.current) {
      // Find all links in the gallery
      const links = galleryRef.current.querySelectorAll("a.lightbox-link");
      if (links[index]) {
        // Simulate a click on the appropriate link
        (links[index] as HTMLElement).click();
      }
    }
  };

  useEffect(() => {
    if (images !== undefined) {
      setIsLoading(false);
    }
  }, [images]);

  useEffect(() => {
    if (galleryImages.length === 0) return;

    try {
      lightboxRef.current = new PhotoSwipeLightbox({
        gallery: "#" + galleryID,
        children: "a.lightbox-link",
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
      lightboxRef.current.init();
    } catch (error) {
      console.error("Error initializing PhotoSwipe:", error);
    }

    return () => {
      if (lightboxRef.current) {
        try {
          lightboxRef.current.destroy();
          lightboxRef.current = null;
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

  const activeImage = galleryImages[activeImageIndex];

  return (
    <div className="space-y-4">
      <div className="pswp-gallery" id={galleryID} ref={galleryRef}>
        <div className="space-y-4">
          {/* Main Image with Navigation */}
          <div className="group relative overflow-hidden rounded-lg border bg-muted">
            <div
              className="relative w-full"
              style={{
                paddingBottom: `${Math.min(Math.max((activeImage.height / activeImage.width) * 100, 100), 75)}%`,
              }}
            >
              {/* Hidden links for PhotoSwipe to use */}
              {galleryImages.map((image, index) => (
                <a
                  key={`lightbox-link-${index}`}
                  href={image.largeURL}
                  data-pswp-width={image.width}
                  data-pswp-height={image.height}
                  className={`lightbox-link absolute inset-0 ${index === activeImageIndex ? "" : "hidden"}`}
                  aria-hidden={index !== activeImageIndex}
                  tabIndex={-1}
                >
                  <span className="sr-only">View full size</span>
                </a>
              ))}

              {/* Visible image (not wrapped in an anchor) */}
              <div
                className="absolute inset-0 cursor-zoom-in"
                onClick={() => openLightbox()}
              >
                <Image
                  src={activeImage.thumbnailURL || "/placeholder.svg"}
                  alt={activeImage.alt}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 800px"
                  className="object-contain"
                  priority
                  onError={() => handleImageError(activeImage.thumbnailURL)}
                  unoptimized={errorImages[activeImage.thumbnailURL]}
                />
              </div>

              {/* Zoom indicator */}
              <div className="absolute right-2 top-2 rounded-full bg-black/50 p-1.5 text-white opacity-0 transition-opacity group-hover:opacity-100">
                <ZoomIn size={16} />
              </div>

              {/* Navigation arrows */}
              {galleryImages.length > 1 && (
                <>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute left-2 top-1/2 z-10 -translate-y-1/2 rounded-full bg-black/50 p-1 text-white opacity-0 transition-opacity hover:bg-black/70 group-hover:opacity-100"
                    onClick={goToPrevious}
                  >
                    <ChevronLeft size={24} />
                    <span className="sr-only">Previous image</span>
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute right-2 top-1/2 z-10 -translate-y-1/2 rounded-full bg-black/50 p-1 text-white opacity-0 transition-opacity hover:bg-black/70 group-hover:opacity-100"
                    onClick={goToNext}
                  >
                    <ChevronRight size={24} />
                    <span className="sr-only">Next image</span>
                  </Button>
                </>
              )}
            </div>
          </div>

          {/* Image Counter */}
          {galleryImages.length > 1 && (
            <div className="text-center text-sm text-muted-foreground">
              {activeImageIndex + 1} / {galleryImages.length}
            </div>
          )}

          {/* Carousel of Thumbnails */}
          {galleryImages.length > 1 && (
            <Carousel
              opts={{
                align: "start",
                loop: galleryImages.length > 4,
              }}
              className="w-full"
            >
              <CarouselContent className="-ml-2 md:-ml-4">
                {galleryImages.map((image, index) => (
                  <CarouselItem
                    key={`${image.thumbnailURL}-${index}`}
                    className="basis-1/4 pl-2 md:basis-1/5 md:pl-4"
                  >
                    <div
                      className={`relative cursor-pointer overflow-hidden rounded-md border transition-all ${
                        activeImageIndex === index
                          ? "border-primary ring-2 ring-primary ring-opacity-50"
                          : "border-muted hover:border-primary/50"
                      }`}
                      onClick={() => setActiveImage(index)}
                    >
                      <div
                        className="relative w-full"
                        style={{
                          paddingBottom: `${Math.min(Math.max((image.height / image.width) * 100, 50), 100)}%`,
                        }}
                      >
                        <Image
                          src={image.thumbnailURL || "/placeholder.svg"}
                          alt={image.alt}
                          fill
                          sizes="(max-width: 768px) 25vw, 20vw"
                          className="object-cover"
                          onError={() => handleImageError(image.thumbnailURL)}
                          unoptimized={errorImages[image.thumbnailURL]}
                        />
                      </div>
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
              {galleryImages.length > 5 && (
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
