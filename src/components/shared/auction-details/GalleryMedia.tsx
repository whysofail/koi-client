"use client";

import { useState, useEffect } from "react";
import Lightbox from "yet-another-react-lightbox";
import Video from "yet-another-react-lightbox/plugins/video";
import Thumbnails from "yet-another-react-lightbox/plugins/thumbnails";
import Zoom from "yet-another-react-lightbox/plugins/zoom";
import Fullscreen from "yet-another-react-lightbox/plugins/fullscreen";
import "yet-another-react-lightbox/styles.css";
import "yet-another-react-lightbox/plugins/thumbnails.css";
import type { Slide } from "yet-another-react-lightbox";
import Image from "next/image";
import {
  ChevronRightCircle,
  ChevronLeftCircle,
  Play,
  Maximize,
  ImageIcon,
  Film,
} from "lucide-react";
import { cn } from "@/lib/utils";

export interface GalleryMediaItem {
  type: "image" | "video";
  largeURL: string;
  width: number;
  height: number;
  alt?: string;
  poster?: string;
  thumbnailURL?: string;
}

interface MediaGalleryProps {
  title: string;
  media?: GalleryMediaItem[];
  className?: string;
}

const FALLBACK_IMAGE = "/placeholder.svg?height=800&width=600";

// Mock data for demonstration
const mockMedia: GalleryMediaItem[] = [
  {
    type: "image",
    largeURL: "/placeholder.svg?height=800&width=600&text=Product+Image+1",
    width: 800,
    height: 600,
    alt: "Product Image 1",
  },
  {
    type: "image",
    largeURL: "/placeholder.svg?height=800&width=600&text=Product+Image+2",
    width: 800,
    height: 600,
    alt: "Product Image 2",
  },
  {
    type: "video",
    largeURL:
      "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
    poster: "/placeholder.svg?height=800&width=600&text=Video+Thumbnail",
    width: 800,
    height: 600,
    alt: "Product Video",
  },
  {
    type: "image",
    largeURL: "/placeholder.svg?height=800&width=600&text=Product+Image+3",
    width: 800,
    height: 600,
    alt: "Product Image 3",
  },
  {
    type: "image",
    largeURL: "/placeholder.svg?height=800&width=600&text=Product+Image+4",
    width: 800,
    height: 600,
    alt: "Product Image 4",
  },
  {
    type: "image",
    largeURL: "/placeholder.svg?height=800&width=600&text=Product+Image+5",
    width: 800,
    height: 600,
    alt: "Product Image 5",
  },
];

const MediaGallery = ({
  title,
  media = mockMedia,
  className,
}: MediaGalleryProps) => {
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  // Filter valid media and ensure fallbacks
  const validMedia = media
    .filter((item) => item.largeURL)
    .map((item) => ({
      ...item,
      largeURL: item.largeURL || FALLBACK_IMAGE,
      alt: item.alt || title || "Gallery Item",
    }));

  const slides: Slide[] = validMedia.map((item) =>
    item.type === "video"
      ? {
          type: "video",
          sources: [
            {
              src: item.largeURL,
              type: "video/mp4",
            },
          ],
          width: item.width,
          height: item.height,
          // Only use poster if available
          ...(item.poster ? { poster: item.poster } : {}),
        }
      : {
          type: "image",
          src: item.largeURL,
          width: item.width,
          height: item.height,
          alt: item.alt,
        },
  );

  // Get the currently selected main media
  const mainMedia = validMedia[currentIndex] ||
    validMedia[0] || {
      type: "image",
      largeURL: FALLBACK_IMAGE,
      alt: "No Image Available",
      width: 800,
      height: 600,
    };

  // Navigation functions
  const goToNext = () => {
    if (validMedia.length <= 1) return;
    setCurrentIndex((prev) => (prev + 1) % validMedia.length);
  };

  const goToPrev = () => {
    if (validMedia.length <= 1) return;
    setCurrentIndex(
      (prev) => (prev - 1 + validMedia.length) % validMedia.length,
    );
  };

  // Simulate loading
  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 500);
    return () => clearTimeout(timer);
  }, [currentIndex]);

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (lightboxOpen) return; // Let lightbox handle its own keyboard events

      if (e.key === "ArrowRight") {
        goToNext();
      } else if (e.key === "ArrowLeft") {
        goToPrev();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [goToNext, goToPrev, lightboxOpen]);

  // Empty state
  if (validMedia.length === 0) {
    return (
      <div
        className={cn(
          "flex flex-col items-center justify-center border border-dashed p-12 text-muted-foreground",
          className,
        )}
      >
        <ImageIcon className="mb-4 h-12 w-12" />
        <p>No media available</p>
      </div>
    );
  }

  return (
    <div className={cn("space-y-6", className)}>
      {/* Main Media with Navigation Buttons */}
      <div className="relative mx-auto aspect-[4/3] w-full max-w-[500px] overflow-hidden  border bg-muted/30 sm:max-w-[600px] lg:max-w-[700px]">
        {/* Loading overlay */}
        {isLoading && (
          <div className="absolute inset-0 z-10 flex items-center justify-center bg-background/80">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
          </div>
        )}

        {validMedia.length > 1 && (
          <>
            <button
              className="absolute left-4 top-1/2 z-10 -translate-y-1/2 rounded-full bg-background/80 p-2 text-foreground shadow-md transition-all hover:scale-105 hover:bg-background focus:outline-none focus:ring-2 focus:ring-primary"
              onClick={goToPrev}
              aria-label="Previous image"
            >
              <ChevronLeftCircle className="h-6 w-6 sm:h-8 sm:w-8" />
            </button>
            <button
              className="absolute right-4 top-1/2 z-10 -translate-y-1/2 rounded-full bg-background/80 p-2 text-foreground shadow-md transition-all hover:scale-105 hover:bg-background focus:outline-none focus:ring-2 focus:ring-primary"
              onClick={goToNext}
              aria-label="Next image"
            >
              <ChevronRightCircle className="h-6 w-6 sm:h-8 sm:w-8" />
            </button>
          </>
        )}

        {/* Media type indicator */}
        <div className="absolute left-4 top-4 z-10 rounded-md bg-background/80 px-2 py-1 text-xs font-medium text-foreground shadow-sm">
          {mainMedia.type === "video" ? (
            <div className="flex items-center gap-1">
              <Film className="h-3 w-3" />
              <span>Video</span>
            </div>
          ) : (
            <div className="flex items-center gap-1">
              <ImageIcon className="h-3 w-3" />
              <span>
                Image {currentIndex + 1}/{validMedia.length}
              </span>
            </div>
          )}
        </div>

        {/* Fullscreen button */}
        <button
          className="absolute right-4 top-4 z-10 rounded-full bg-background/80 p-2 text-foreground shadow-md transition-all hover:scale-105 hover:bg-background focus:outline-none focus:ring-2 focus:ring-primary"
          onClick={() => setLightboxOpen(true)}
          aria-label="View fullscreen"
        >
          <Maximize className="h-4 w-4" />
        </button>

        {/* Render Video or Image */}
        {mainMedia.type === "video" ? (
          <div className="relative h-full w-full">
            <video
              src={mainMedia.largeURL}
              poster={mainMedia.poster}
              width={mainMedia.width}
              height={mainMedia.height}
              className="h-full w-full object-contain"
              controls
              playsInline
              preload="metadata"
              onLoadedData={() => setIsLoading(false)}
            />
            {/* <button
              className="absolute left-1/2 top-1/2 z-10 -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/90 p-6 text-primary-foreground shadow-lg transition-all hover:scale-105 hover:bg-primary focus:outline-none focus:ring-2 focus:ring-primary"
              onClick={() => setLightboxOpen(true)}
              aria-label="Play video in fullscreen"
            >
              <Play className="h-8 w-8" fill="currentColor" />
            </button> */}
          </div>
        ) : (
          <div
            className="relative h-full w-full cursor-zoom-in transition-transform duration-300 hover:scale-105"
            onClick={() => setLightboxOpen(true)}
          >
            <Image
              src={mainMedia.largeURL || "/placeholder.svg"}
              alt={mainMedia.alt || ""}
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 600px, 700px"
              className="object-contain"
              priority={currentIndex === 0}
              onLoad={() => setIsLoading(false)}
            />
          </div>
        )}
      </div>

      {/* Thumbnail Grid */}
      {validMedia.length > 1 && (
        <div className="mt-4 grid grid-cols-4 gap-2 sm:grid-cols-6">
          {validMedia.map((item, index) => (
            <div
              key={index}
              className={cn(
                "relative aspect-square h-20 min-w-[5rem] cursor-pointer overflow-hidden rounded-lg border bg-muted/30 transition-all sm:h-auto",
                index === currentIndex
                  ? "ring-2 ring-primary ring-offset-2"
                  : "hover:ring-1 hover:ring-primary/50 hover:ring-offset-1",
              )}
              onClick={() => setCurrentIndex(index)}
            >
              {/* Media type indicator */}
              {item.type === "video" && (
                <div className="absolute right-1 top-1 z-10 rounded-full bg-background/80 p-1">
                  <Film className="h-3 w-3" />
                </div>
              )}

              {item.type === "video" ? (
                <div className="relative h-full w-full">
                  <video
                    src={item.largeURL}
                    className="absolute inset-0 h-full w-full object-cover"
                    muted
                    playsInline
                    preload="metadata"
                    onLoadedMetadata={(e) => {
                      // Set current time to 0.1 to grab the first frame
                      const video = e.currentTarget;
                      video.currentTime = 0.1;
                    }}
                  />
                  <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                    <Play className="h-6 w-6 text-white" />
                  </div>
                </div>
              ) : (
                <Image
                  src={item.thumbnailURL || item.largeURL}
                  alt={item.alt || `Thumbnail ${index + 1}`}
                  fill
                  sizes="80px"
                  className="object-cover"
                />
              )}
            </div>
          ))}
        </div>
      )}

      {/* Lightbox with Video & Thumbnails Support */}
      <Lightbox
        open={lightboxOpen}
        close={() => setLightboxOpen(false)}
        slides={slides}
        plugins={[Video, Thumbnails, Zoom, Fullscreen]}
        index={currentIndex}
        controller={{ closeOnBackdropClick: true }}
        carousel={{ finite: false }}
        render={{
          buttonPrev: validMedia.length <= 1 ? () => null : undefined,
          buttonNext: validMedia.length <= 1 ? () => null : undefined,
        }}
        on={{ view: ({ index }) => setCurrentIndex(index) }}
        video={{
          autoPlay: true,
          muted: false,
          loop: false,
          controls: true,
        }}
        thumbnails={{
          position: "bottom",
          width: 120,
          height: 120,
          border: 1,
          borderRadius: 8,
          padding: 4,
          gap: 16,
        }}
        zoom={{
          maxZoomPixelRatio: 3,
          zoomInMultiplier: 2,
          doubleTapDelay: 300,
          doubleClickDelay: 300,
          keyboardMoveDistance: 50,
          wheelZoomDistanceFactor: 100,
          pinchZoomDistanceFactor: 100,
        }}
        styles={{
          container: { backgroundColor: "rgba(0, 0, 0, .9)" },
          thumbnail: {
            border: "1px solid rgba(255, 255, 255, 0.2)",
            borderRadius: "8px",
            overflow: "hidden",
          },
          thumbnailsContainer: {
            backgroundColor: "rgba(0, 0, 0, 0.6)",
            padding: "16px 0",
          },
        }}
      />
    </div>
  );
};

export default MediaGallery;
