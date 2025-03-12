"use client";

import type React from "react";
import { useState, useRef, useCallback, useEffect } from "react";
import {
  Upload,
  X,
  RectangleHorizontal,
  RectangleVertical,
  Square,
  Circle,
  ImagesIcon,
} from "lucide-react"; // Add this import
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider"; // Add this import
import { Label } from "@/components/ui/label";

// Add this type before the interfaces
type AspectRatioKey = "1:1" | "16:9" | "9:16" | "circle" | "original";

interface AspectRatioOption {
  label: string;
  icon: React.ReactNode;
  width: number;
  height: number;
  isCircle?: boolean;
}

interface ImageUploadEditorProps {
  multiple?: boolean;
  maxFiles?: number;
  defaultAspectRatio?: AspectRatioKey;
  aspectRatios?: AspectRatioKey[];
  onSave?: (file: File) => void;
  onFileChange?: (file: File) => void;
  onFileSelect?: (file: File) => void;
  onImageEdit?: (file: File) => void;
  onSaveToPC?: (blob: Blob, filename: string) => void;
}

const defaultAspectRatios: Record<AspectRatioKey, AspectRatioOption> = {
  original: { label: "Original", icon: <ImagesIcon />, width: 0, height: 0 },
  circle: {
    label: "Circle",
    icon: <Circle />,
    width: 1,
    height: 1,
    isCircle: true,
  },
  "1:1": { label: "1:1 (Square)", icon: <Square />, width: 1, height: 1 },
  "16:9": {
    label: "16:9 Landscape",
    icon: <RectangleHorizontal />,
    width: 16,
    height: 9,
  },
  "9:16": {
    label: "9:16 Portrait",
    icon: <RectangleVertical />,
    width: 9,
    height: 16,
  },
};

const ImageUploadEditor = ({
  multiple = false,
  maxFiles = Infinity,
  aspectRatios = ["1:1", "16:9", "9:16"],
  defaultAspectRatio,

  onFileSelect,
  onImageEdit,
}: ImageUploadEditorProps) => {
  // Validate default aspect ratio based on provided aspectRatios
  const validDefaultRatio = aspectRatios.includes(
    (defaultAspectRatio as AspectRatioKey) || "",
  )
    ? defaultAspectRatio
    : aspectRatios[0];

  const [aspectRatio, setAspectRatio] = useState(validDefaultRatio);
  const [images, setImages] = useState<string[]>([]);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const imageRef = useRef<HTMLImageElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [scale, setScale] = useState(1);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [imageDimensions, setImageDimensions] = useState({
    width: 0,
    height: 0,
  });

  // Add helper for checking if we're in original mode
  const isOriginalMode = aspectRatio === "original";

  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const files = event.target.files;
    if (files) {
      const file = files[0];
      const objectUrl = URL.createObjectURL(file);

      // Process image through canvas to normalize format
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      const img = new Image();

      img.onload = async () => {
        canvas.width = img.width;
        canvas.height = img.height;
        ctx?.drawImage(img, 0, 0);

        canvas.toBlob(
          async (blob) => {
            if (blob) {
              const processedFile = new File([blob], file.name, {
                type: "image/jpeg",
              });

              // Call onFileSelect with the processed file
              onFileSelect?.(processedFile);

              // Update component state
              setImages([objectUrl]);
            }
          },
          "image/jpeg",
          0.95,
        );
      };

      img.src = objectUrl;
    }
  };

  const handleDrop = useCallback(
    (event: React.DragEvent<HTMLDivElement>) => {
      event.preventDefault();
      const files = event.dataTransfer.files;
      if (files) {
        const newImages = Array.from(files)
          .filter((file) => file.type.startsWith("image/"))
          .map((file) => URL.createObjectURL(file));

        if (multiple) {
          setImages((prevImages) => {
            const combined = [...prevImages, ...newImages];
            return combined.slice(0, maxFiles);
          });
        } else {
          // Revoke previous URLs to prevent memory leaks
          images.forEach((url) => URL.revokeObjectURL(url));
          setImages([newImages[0]]);
        }
      }
    },
    [multiple, maxFiles, images],
  );

  const handleDragOver = useCallback(
    (event: React.DragEvent<HTMLDivElement>) => {
      event.preventDefault();
    },
    [],
  );

  const handleMouseDown = useCallback(
    (event: React.MouseEvent<HTMLDivElement>) => {
      event.preventDefault();
      if (!containerRef.current) return;

      const containerRect = containerRef.current.getBoundingClientRect();
      const x = event.clientX - containerRect.left;
      const y = event.clientY - containerRect.top;

      setIsDragging(true);
      setDragStart({
        x: x - position.x,
        y: y - position.y,
      });
    },
    [position],
  );

  // Add constant for overlay padding
  const OVERLAY_PADDING = 32; // Reduce from 64 to 32 (16px on each side)

  const calculateBoundaries = useCallback(() => {
    if (!containerRef.current || !imageRef.current) return { maxX: 0, maxY: 0 };

    const containerRect = containerRef.current.getBoundingClientRect();
    const image = imageRef.current;

    // Get crop area dimensions
    const cropWidth = containerRect.width - OVERLAY_PADDING;
    const cropHeight = containerRect.height - OVERLAY_PADDING;

    // Calculate scaled image dimensions
    const scaledImageWidth = image.naturalWidth * scale;
    const scaledImageHeight = image.naturalHeight * scale;

    // Calculate maximum allowed movement to keep image within crop area
    const maxX = (scaledImageWidth - cropWidth) / 2;
    const maxY = (scaledImageHeight - cropHeight) / 2;

    return { maxX, maxY };
  }, [scale]);

  const handleMouseMove = useCallback(
    (event: React.MouseEvent<HTMLDivElement>) => {
      if (!isDragging || !containerRef.current) return;

      event.preventDefault();
      const containerRect = containerRef.current.getBoundingClientRect();
      const x = event.clientX - containerRect.left;
      const y = event.clientY - containerRect.top;

      const newX = x - dragStart.x;
      const newY = y - dragStart.y;

      const { maxX, maxY } = calculateBoundaries();

      // Allow movement within the expanded boundaries
      const constrainedX = Math.max(-maxX, Math.min(maxX, newX));
      const constrainedY = Math.max(-maxY, Math.min(maxY, newY));

      setPosition({
        x: constrainedX,
        y: constrainedY,
      });
    },
    [isDragging, dragStart, calculateBoundaries],
  );
  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  // Add touch event handlers
  const handleTouchStart = useCallback(
    (event: React.TouchEvent<HTMLDivElement>) => {
      event.preventDefault();
      if (!containerRef.current) return;

      const touch = event.touches[0];
      const containerRect = containerRef.current.getBoundingClientRect();
      const x = touch.clientX - containerRect.left;
      const y = touch.clientY - containerRect.top;

      setIsDragging(true);
      setDragStart({
        x: x - position.x,
        y: y - position.y,
      });
    },
    [position],
  );

  const handleTouchMove = useCallback(
    (event: React.TouchEvent<HTMLDivElement>) => {
      if (!isDragging || !containerRef.current) return;

      event.preventDefault();
      const touch = event.touches[0];
      const containerRect = containerRef.current.getBoundingClientRect();
      const x = touch.clientX - containerRect.left;
      const y = touch.clientY - containerRect.top;

      const newX = x - dragStart.x;
      const newY = y - dragStart.y;

      const { maxX, maxY } = calculateBoundaries();

      const constrainedX = Math.max(-maxX, Math.min(maxX, newX));
      const constrainedY = Math.max(-maxY, Math.min(maxY, newY));

      setPosition({
        x: constrainedX,
        y: constrainedY,
      });
    },
    [isDragging, dragStart, calculateBoundaries],
  );

  const calculateZoomConstraints = useCallback(() => {
    if (!containerRef.current || !imageRef.current) return { min: 1, max: 3 };

    const containerRect = containerRef.current.getBoundingClientRect();
    const image = imageRef.current;

    // Handle original aspect ratio
    if (aspectRatio === "original") {
      const scaleX =
        (containerRect.width - OVERLAY_PADDING) / image.naturalWidth;
      const scaleY =
        (containerRect.height - OVERLAY_PADDING) / image.naturalHeight;
      const minScale = Math.min(scaleX, scaleY);
      return { min: minScale, max: minScale * 3 };
    }

    // Get crop area dimensions
    const cropWidth = containerRect.width - OVERLAY_PADDING;
    const cropHeight = containerRect.height - OVERLAY_PADDING;

    // Calculate the minimum scale needed to fill either width or height
    const widthRatio = cropWidth / image.naturalWidth;
    const heightRatio = cropHeight / image.naturalHeight;
    const minScale = Math.max(widthRatio, heightRatio) || 0.1;

    // Calculate max scale to prevent excessive zoom
    const maxScale = minScale * 3;

    return { min: minScale, max: maxScale };
  }, [aspectRatio]);

  const handleZoomChange = useCallback(
    (value: number[]) => {
      if (!containerRef.current || !imageRef.current) return;

      const { min, max } = calculateZoomConstraints();
      const newScale = Math.max(min, Math.min(max, value[0]));

      // Calculate new boundaries with the new scale
      const containerRect = containerRef.current.getBoundingClientRect();
      const image = imageRef.current;

      const cropWidth = containerRect.width - OVERLAY_PADDING;
      const cropHeight = containerRect.height - OVERLAY_PADDING;

      // Calculate new maximum boundaries
      const scaledImageWidth = image.naturalWidth * newScale;
      const scaledImageHeight = image.naturalHeight * newScale;

      const maxX = Math.max(0, (scaledImageWidth - cropWidth) / 2);
      const maxY = Math.max(0, (scaledImageHeight - cropHeight) / 2);

      // Constrain current position to new boundaries
      const newX = Math.max(-maxX, Math.min(maxX, position.x));
      const newY = Math.max(-maxY, Math.min(maxY, position.y));

      // Update both scale and position
      setScale(newScale);
      setPosition({ x: newX, y: newY });
    },
    [calculateZoomConstraints, position],
  );

  // Add this useEffect to handle proper initial scaling
  useEffect(() => {
    if (!isEditorOpen || !containerRef.current || !imageRef.current) return;

    // Create an observer to watch for size changes
    const observer = new ResizeObserver(() => {
      if (containerRef.current && imageRef.current) {
        const { min } = calculateZoomConstraints();
        setScale(min);
        setPosition({ x: 0, y: 0 });
      }
    });

    // Start observing the container
    observer.observe(containerRef.current);

    return () => observer.disconnect();
  }, [isEditorOpen, calculateZoomConstraints]);

  // Add useEffect to handle wheel event
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const wheelOpts = { passive: false };

    const handleWheelEvent = (event: WheelEvent) => {
      if (!containerRef.current || !imageRef.current) return;

      event.preventDefault();
      if (aspectRatio === "original") return;

      const { min, max } = calculateZoomConstraints();
      const delta = -event.deltaY * 0.001;
      const newScale = Math.max(min, Math.min(max, scale + delta));

      handleZoomChange([newScale]);
    };

    container.addEventListener("wheel", handleWheelEvent, wheelOpts);

    return () => {
      container.removeEventListener(
        "wheel",
        handleWheelEvent as EventListener,
        wheelOpts as EventListenerOptions,
      );
    };
  }, [aspectRatio, scale, calculateZoomConstraints, handleZoomChange]);

  // Modify openEditor to remove scale calculation
  const openEditor = (image: string) => {
    setSelectedImage(image);
    setIsEditorOpen(true);
    setPosition({ x: 0, y: 0 });

    const img = new Image();
    img.onload = () => {
      setImageDimensions({
        width: img.width,
        height: img.height,
      });
      // Scale will be set by the ResizeObserver
    };
    img.src = image;
  };

  const closeEditor = () => {
    setIsEditorOpen(false);
    setSelectedImage(null);
  };

  useEffect(() => {
    if (selectedImage && imageRef.current) {
      const img = new Image();
      img.onload = () => {
        setImageDimensions({ width: img.width, height: img.height });
      };
      img.src = selectedImage;
    }
  }, [selectedImage]);

  const handleSave = async () => {
    if (!selectedImage || !containerRef.current || !imageRef.current) return;

    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const containerRect = containerRef.current.getBoundingClientRect();
    const cropWidth = containerRect.width - OVERLAY_PADDING;
    const cropHeight = containerRect.height - OVERLAY_PADDING;

    canvas.width = cropWidth;
    canvas.height = cropHeight;

    const img = new Image();
    img.onload = () => {
      // Draw the image with current position and scale
      ctx.drawImage(
        img,
        -position.x / scale,
        -position.y / scale,
        img.width / scale,
        img.height / scale,
      );

      canvas.toBlob(
        (blob) => {
          if (blob) {
            const editedFile = new File([blob], "edited-image.jpg", {
              type: "image/jpeg",
            });

            // Call onImageEdit with the edited file
            onImageEdit?.(editedFile);

            closeEditor();
          }
        },
        "image/jpeg",
        0.95,
      );
    };
    img.src = selectedImage;
  };

  const handleSaveToPC = async () => {
    if (!selectedImage || !containerRef.current || !imageRef.current) return;

    // Extract original filename from URL
    const originalFilename =
      selectedImage.split("/").pop()?.split(".")[0] || "image";

    // For original aspect ratio, download the original file directly
    if (aspectRatio === "original") {
      const link = document.createElement("a");
      link.download = `${originalFilename}-original.png`;
      link.href = selectedImage;
      link.click();
      return;
    }

    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const containerRect = containerRef.current.getBoundingClientRect();
    const imageRect = imageRef.current.getBoundingClientRect();

    // Always use square dimensions for circle
    const cropWidth = containerRect.width - OVERLAY_PADDING;
    const cropHeight =
      aspectRatio === "circle"
        ? cropWidth // Force square for circle
        : containerRect.height - OVERLAY_PADDING;

    canvas.width = cropWidth;
    canvas.height = cropHeight;

    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      // Calculate source rectangle based on displayed image position
      const displayedImageCenterX = imageRect.width / 2;
      const displayedImageCenterY = imageRect.height / 2;

      const scaleRatio = img.naturalWidth / imageRect.width;
      const sourceWidth = cropWidth * scaleRatio;
      const sourceHeight = cropHeight * scaleRatio;

      const sourceX =
        (displayedImageCenterX - cropWidth / 2 - position.x) * scaleRatio;
      const sourceY =
        (displayedImageCenterY - cropHeight / 2 - position.y) * scaleRatio;

      // Draw the cropped portion
      ctx.drawImage(
        img,
        sourceX,
        sourceY,
        sourceWidth,
        sourceHeight,
        0,
        0,
        cropWidth,
        cropHeight,
      );

      // Create download link with formatted filename
      const link = document.createElement("a");
      const ratioSuffix =
        aspectRatio === "circle"
          ? "circle"
          : aspectRatio?.replace(":", "-") || "original";
      link.download = `${originalFilename}-cropped-${ratioSuffix}.png`;
      link.href = canvas.toDataURL("image/png");
      link.click();
    };
    img.src = selectedImage;
  };

  const handleRemoveImage = (indexToRemove: number) => {
    setImages((prevImages) => {
      const newImages = prevImages.filter(
        (_, index) => index !== indexToRemove,
      );
      // Clean up URL objects to prevent memory leaks
      URL.revokeObjectURL(prevImages[indexToRemove]);
      return newImages;
    });
  };

  // Update constants
  const PREVIEW_WIDTH = {
    mobile: 260,
    desktop: 320 * 1.25,
  };

  const PREVIEW_HEIGHT = {
    mobile: 400,
    desktop: 480 * 1.25,
  };

  // Update getContainerStyle
  const getContainerStyle = useCallback(() => {
    const isMobile = typeof window !== "undefined" && window.innerWidth < 768;
    const maxWidth = isMobile ? PREVIEW_WIDTH.mobile : PREVIEW_WIDTH.desktop;
    const maxHeight = isMobile ? PREVIEW_HEIGHT.mobile : PREVIEW_HEIGHT.desktop;

    if (isOriginalMode && imageRef.current) {
      const imgWidth = imageRef.current.naturalWidth;
      const imgHeight = imageRef.current.naturalHeight;
      const ratio = imgHeight / imgWidth;

      let width = Math.min(imgWidth, maxWidth) * 0.5;
      let height = width * ratio;

      if (height > maxHeight) {
        width = maxHeight / ratio;
        height = maxHeight;
      }

      return {
        width: `${width}px`,
        height: `${height}px`,
        paddingTop: 0,
        margin: "0 auto",
      };
    }

    // For non-original aspect ratios
    let width = maxWidth;
    const aspectRatioValue =
      defaultAspectRatios[aspectRatio as keyof typeof defaultAspectRatios]
        .height /
      defaultAspectRatios[aspectRatio as keyof typeof defaultAspectRatios]
        .width;

    // Only adjust size for 9:16 to prevent scrollbar
    if (aspectRatio === "9:16") {
      const calculatedHeight = width * aspectRatioValue;
      if (calculatedHeight > maxHeight) {
        width = maxHeight / aspectRatioValue - 64;
      }
    }

    return {
      width: `${width}px`,
      height: `${width * aspectRatioValue}px`,
      paddingTop: 0,
      margin: "0 auto",
    };
  }, [
    PREVIEW_HEIGHT.desktop,
    PREVIEW_HEIGHT.mobile,
    PREVIEW_WIDTH.desktop,
    PREVIEW_WIDTH.mobile,
    aspectRatio,
    isOriginalMode,
  ]);

  return (
    <div className="mx-auto max-w-4xl p-2 sm:p-4">
      <div
        className="mb-4 cursor-pointer rounded-lg border-2 border-dashed border-gray-300 p-4 text-center"
        onClick={() => document.getElementById("fileInput")?.click()}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
      >
        <input
          type="file"
          id="fileInput"
          className="hidden"
          accept="image/*"
          onChange={handleFileChange}
          multiple={multiple}
        />
        <Upload className="mx-auto mb-2" />
        <p>
          {multiple
            ? `Drag and drop up to ${maxFiles} images here, or click to select`
            : "Drag and drop an image here, or click to select"}
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
        {images.map((image, index) => (
          <div key={index} className="group relative aspect-square">
            <img
              src={image || "/placeholder.svg"}
              alt={`Thumbnail ${index + 1}`}
              className="h-full w-full cursor-pointer rounded-lg object-cover"
              onClick={() => openEditor(image)}
            />
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleRemoveImage(index);
              }}
              className="absolute right-1 top-1 rounded-full bg-black/50 p-1 text-white opacity-0 transition-opacity hover:bg-black/75 group-hover:opacity-100"
            >
              <X size={16} />
            </button>
          </div>
        ))}
      </div>

      <Dialog open={isEditorOpen} onOpenChange={setIsEditorOpen}>
        <DialogContent className="flex h-[90vh] max-h-[90vh] w-[95vw] max-w-[95vw] flex-col p-4 sm:h-[80vh] sm:max-w-[500px] sm:p-6">
          <DialogHeader className="flex-none space-y-2">
            <DialogTitle className="text-lg sm:text-xl">Edit Image</DialogTitle>
            <DialogDescription className="hidden text-sm sm:block">
              Drag to reposition. Use slider to zoom.
            </DialogDescription>
            <DialogDescription className="text-sm sm:hidden">
              Pinch to zoom. Drag to reposition.
            </DialogDescription>
          </DialogHeader>

          <div className="flex flex-1 flex-col space-y-4">
            <Select
              value={aspectRatio}
              onValueChange={(value) => setAspectRatio(value as AspectRatioKey)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select aspect ratio" />
              </SelectTrigger>
              <SelectContent>
                {aspectRatios.map((key) => (
                  <SelectItem key={key} value={key}>
                    <div className="flex items-center">
                      {defaultAspectRatios[key].icon}
                      <span className="ml-2">
                        {defaultAspectRatios[key].label}
                      </span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <div className="flex flex-1 flex-col justify-center space-y-4">
              {/* Only show zoom controls if not in original mode */}
              {!isOriginalMode && (
                <div className="w-full flex-none items-center space-x-2 px-1">
                  <Label className="min-w-[3rem] text-sm">Zoom</Label>
                  <Slider
                    value={[scale]}
                    onValueChange={handleZoomChange}
                    min={calculateZoomConstraints().min}
                    max={calculateZoomConstraints().max}
                    step={0.1}
                    className="w-full"
                  />
                </div>
              )}

              <div className="relative flex flex-1 items-center justify-center">
                <div
                  ref={containerRef}
                  className="relative overflow-hidden bg-black"
                  style={getContainerStyle()}
                >
                  {isOriginalMode ? (
                    <img
                      ref={imageRef}
                      src={selectedImage || "/placeholder.svg"}
                      alt="Original preview"
                      className="absolute inset-0 h-full w-full object-contain"
                    />
                  ) : (
                    <>
                      {/* Drag area */}
                      <div
                        className="absolute inset-0 z-30"
                        onMouseDown={handleMouseDown}
                        onMouseMove={handleMouseMove}
                        onMouseUp={handleMouseUp}
                        onMouseLeave={handleMouseUp}
                        onTouchStart={handleTouchStart}
                        onTouchMove={handleTouchMove}
                        onTouchEnd={() => setIsDragging(false)}
                        style={{ cursor: isDragging ? "grabbing" : "grab" }}
                      />

                      {/* Dark overlay with circle mask if needed */}
                      <div className="absolute inset-0 z-10">
                        <div
                          className={`absolute inset-4 ${aspectRatio === "circle" ? "overflow-hidden rounded-full" : ""}`}
                          style={{
                            boxShadow: "0 0 0 9999px rgba(0, 0, 0, 0.5)",
                            border: "2px solid white",
                          }}
                        >
                          {aspectRatio === "circle" && (
                            <div className="pointer-events-none absolute inset-0 z-20">
                              <div className="h-full w-full rounded-full border-2 border-white opacity-75" />
                            </div>
                          )}
                        </div>
                      </div>

                      <img
                        ref={imageRef}
                        src={selectedImage || "/placeholder.svg"}
                        alt="Editor preview"
                        className="absolute left-1/2 top-1/2 max-w-none select-none"
                        style={{
                          transform: `translate(-50%, -50%) translate(${position.x}px, ${position.y}px) scale(${scale})`,
                          width: imageDimensions.width || "auto",
                          height: imageDimensions.height || "auto",
                          pointerEvents: "none",
                        }}
                      />

                      {/* Grid lines - only show for non-circle */}
                      {aspectRatio !== "circle" && (
                        <div className="pointer-events-none absolute inset-8 z-20 grid grid-cols-3 grid-rows-3">
                          {[...Array(9)].map((_, i) => (
                            <div
                              key={i}
                              className="border border-white opacity-50"
                            />
                          ))}
                        </div>
                      )}
                    </>
                  )}
                </div>
              </div>
            </div>

            <div className="flex flex-none flex-col-reverse gap-2 sm:flex-row sm:justify-end sm:space-x-2">
              <Button
                variant="outline"
                onClick={closeEditor}
                className="h-10 w-full sm:h-9 sm:w-auto"
              >
                Cancel
              </Button>
              <Button
                variant="secondary"
                onClick={handleSaveToPC}
                className="h-10 w-full sm:h-9 sm:w-auto"
              >
                Save to Device
              </Button>
              <Button
                onClick={handleSave}
                className="h-10 w-full sm:h-9 sm:w-auto"
              >
                Save
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ImageUploadEditor;
