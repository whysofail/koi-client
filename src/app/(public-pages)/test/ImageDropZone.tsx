"use client";

import type React from "react";
import { useState, useRef, useCallback, useEffect } from "react";
import { Upload } from "lucide-react";
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

const ImageUploadEditor = () => {
  const [images, setImages] = useState<string[]>([]);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [aspectRatio, setAspectRatio] = useState("1:1");
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
  const minZoom = 0.1;
  const maxZoom = 3;

  useEffect(() => {
    console.log("Position:", position);
  }, [position]);

  const calculateInitialScale = (imgWidth: number, imgHeight: number) => {
    if (!containerRef.current) return 1;

    const containerRect = containerRef.current.getBoundingClientRect();
    const containerWidth = containerRect.width;
    const containerHeight = containerRect.height;

    // Calculate scales to fit width and height
    const scaleX = containerWidth / imgWidth;
    const scaleY = containerHeight / imgHeight;

    // Return the smaller scale to ensure image fits in container
    return Math.min(scaleX, scaleY);
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      const newImages = Array.from(files).map((file) =>
        URL.createObjectURL(file),
      );
      setImages((prevImages) => [...prevImages, ...newImages]);
    }
  };

  const handleDrop = useCallback((event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    const files = event.dataTransfer.files;
    if (files) {
      const newImages = Array.from(files)
        .filter((file) => file.type.startsWith("image/"))
        .map((file) => URL.createObjectURL(file));
      setImages((prevImages) => [...prevImages, ...newImages]);
    }
  }, []);

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

  const handleMouseMove = useCallback(
    (event: React.MouseEvent<HTMLDivElement>) => {
      if (!isDragging || !containerRef.current || !imageRef.current) return;

      event.preventDefault();
      const containerRect = containerRef.current.getBoundingClientRect();
      const x = event.clientX - containerRect.left;
      const y = event.clientY - containerRect.top;

      const newX = x - dragStart.x;
      const newY = y - dragStart.y;

      // Calculate scaled image dimensions
      const scaledImageWidth = imageDimensions.width * scale;
      const scaledImageHeight = imageDimensions.height * scale;

      // Calculate crop area dimensions (excluding overlays)
      const cropWidth = containerRect.width - 32; // 16px padding on each side
      const cropHeight = containerRect.height - 32; // 16px padding on each side

      // Calculate maximum allowed movement based on scaled image size
      const maxX = Math.max(0, (scaledImageWidth - cropWidth) / 2);
      const maxY = Math.max(0, (scaledImageHeight - cropHeight) / 2);

      // Debug logging for boundaries
      console.log("Movement:", {
        newX,
        newY,
        maxX,
        maxY,
        scaledWidth: scaledImageWidth,
        scaledHeight: scaledImageHeight,
        cropWidth,
        cropHeight,
      });

      console.log("Hit x boundary:", newX > maxX || newX < -maxX);
      console.log("Hit y boundary:", newY > maxY || newY < -maxY);

      // Constrain movement within image boundaries
      const constrainedX = Math.max(-maxX, Math.min(maxX, newX));
      const constrainedY = Math.max(-maxY, Math.min(maxY, newY));

      setPosition({
        x: constrainedX,
        y: constrainedY,
      });
    },
    [
      isDragging,
      dragStart,
      scale,
      imageDimensions.width,
      imageDimensions.height,
    ],
  );

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  const handleZoomChange = useCallback((value: number[]) => {
    setScale(value[0]);
  }, []);

  const aspectRatios = {
    "1:1": { width: 1, height: 1 },
    "4:3": { width: 4, height: 3 },
    "16:9": { width: 16, height: 9 },
    "3:2": { width: 3, height: 2 },
  };

  const openEditor = (image: string) => {
    setSelectedImage(image);
    setIsEditorOpen(true);
    setPosition({ x: 0, y: 0 });
    setScale(1);
    // Load image and set dimensions before opening editor
    const img = new Image();
    img.onload = () => {
      setImageDimensions({
        width: img.width,
        height: img.height,
      });
      setScale(calculateInitialScale(img.width, img.height));
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
    if (!selectedImage) return;

    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    if (!ctx || !imageRef.current || !containerRef.current) return;

    const containerRect = containerRef.current.getBoundingClientRect();
    canvas.width = containerRect.width;
    canvas.height = containerRect.height;

    const img = new Image();
    img.onload = async () => {
      ctx.drawImage(
        img,
        -position.x / scale,
        -position.y / scale,
        img.width / scale,
        img.height / scale,
      );

      const blob = await new Promise<Blob | null>((resolve) =>
        canvas.toBlob(resolve),
      );
      if (!blob) return;

      const formData = new FormData();
      formData.append("image", blob, "edited-image.jpg");

      try {
        const response = await fetch("/api/upload", {
          method: "POST",
          body: formData,
        });

        if (response.ok) {
          const result = await response.json();
          console.log("Image uploaded successfully:", result.url);
        } else {
          console.error("Failed to upload image");
        }
      } catch (error) {
        console.error("Error uploading image:", error);
      }

      closeEditor();
    };
    img.src = selectedImage;
  };

  return (
    <div className="mx-auto max-w-4xl p-4">
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
          multiple
        />
        <Upload className="mx-auto mb-2" />
        <p>Drag and drop images here, or click to select</p>
      </div>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
        {images.map((image, index) => (
          <div key={index} className="relative aspect-square">
            <img
              src={image || "/placeholder.svg"}
              alt={`Thumbnail ${index + 1}`}
              className="h-full w-full cursor-pointer rounded-lg object-cover"
              onClick={() => openEditor(image)}
            />
          </div>
        ))}
      </div>

      <Dialog open={isEditorOpen} onOpenChange={setIsEditorOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Edit Image</DialogTitle>
            <DialogDescription>
              Drag to reposition. Use slider to zoom.
            </DialogDescription>
          </DialogHeader>
          <div className="mt-4">
            <Select value={aspectRatio} onValueChange={setAspectRatio}>
              <SelectTrigger>
                <SelectValue placeholder="Select aspect ratio" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1:1">1:1 (Square)</SelectItem>
                <SelectItem value="4:3">4:3</SelectItem>
                <SelectItem value="16:9">16:9</SelectItem>
                <SelectItem value="3:2">3:2</SelectItem>
              </SelectContent>
            </Select>

            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <Label>Zoom</Label>
                <Slider
                  value={[scale]}
                  onValueChange={handleZoomChange}
                  min={minZoom}
                  max={maxZoom}
                  step={0.1}
                  className="w-[60%]"
                />
              </div>

              <div className="relative">
                <div
                  ref={containerRef}
                  className="relative overflow-hidden bg-black"
                  style={{
                    width: "100%",
                    paddingTop: `${(aspectRatios[aspectRatio as keyof typeof aspectRatios].height / aspectRatios[aspectRatio as keyof typeof aspectRatios].width) * 100}%`,
                  }}
                >
                  {/* Drag area - remove onWheel event */}
                  <div
                    className="absolute inset-0 z-30"
                    onMouseDown={handleMouseDown}
                    onMouseMove={handleMouseMove}
                    onMouseUp={handleMouseUp}
                    onMouseLeave={handleMouseUp}
                    style={{ cursor: isDragging ? "grabbing" : "grab" }}
                  />

                  {/* Dark overlays */}
                  <div className="absolute inset-0 z-10">
                    <div className="absolute left-0 top-0 h-16 w-full bg-black opacity-50" />
                    <div className="absolute bottom-0 left-0 h-16 w-full bg-black opacity-50" />
                    <div className="absolute bottom-16 left-0 top-16 w-16 bg-black opacity-50" />
                    <div className="absolute bottom-16 right-0 top-16 w-16 bg-black opacity-50" />
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

                  {/* Grid lines */}
                  <div className="pointer-events-none absolute inset-16 z-20 grid grid-cols-3 grid-rows-3">
                    {[...Array(9)].map((_, i) => (
                      <div key={i} className="border border-white opacity-50" />
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-4 flex justify-end space-x-2">
              <Button variant="outline" onClick={closeEditor}>
                Cancel
              </Button>
              <Button onClick={handleSave}>Save</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ImageUploadEditor;
