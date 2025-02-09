import React, { FC } from "react";
import Image from "next/image";

const ImageGallery: FC<{ title: string }> = ({ title }) => {
  const placeholderImageCount = 4;

  return (
    <div className="space-y-4">
      <div className="bg-muted relative aspect-square overflow-hidden rounded-lg border">
        <Image
          src="/placeholder.svg"
          alt={title}
          fill
          className="object-cover"
          priority
        />
      </div>
      <div className="grid grid-cols-4 gap-4">
        {Array.from({ length: placeholderImageCount }).map((_, index) => (
          <div
            key={index}
            className="bg-muted relative aspect-square cursor-pointer overflow-hidden rounded-md border"
          >
            <Image
              src="/placeholder.svg"
              alt={`${title} - Image ${index + 1}`}
              fill
              className="object-cover"
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default ImageGallery;
