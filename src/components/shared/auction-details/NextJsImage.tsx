import Image from "next/image";
import {
  isImageFitCover,
  isImageSlide,
  useLightboxProps,
  useLightboxState,
} from "yet-another-react-lightbox";

function isNextJsImage(slide: {
  src?: string;
  width?: number;
  height?: number;
}) {
  return (
    isImageSlide({ ...slide, src: slide.src || "" }) &&
    typeof slide.src === "string" &&
    typeof slide.width === "number" &&
    typeof slide.height === "number"
  );
}

export default function NextJsImage({ slide, offset, rect }: any) {
  const {
    on: { click },
    carousel: { imageFit },
  } = useLightboxProps();
  const { currentIndex } = useLightboxState();

  const cover = isImageSlide(slide) && isImageFitCover(slide, imageFit);

  if (!isNextJsImage(slide)) return null;

  const width = cover
    ? rect.width
    : Math.round(
        Math.min(rect.width, (rect.height / slide.height) * slide.width),
      );

  const height = cover
    ? rect.height
    : Math.round(
        Math.min(rect.height, (rect.width / slide.width) * slide.height),
      );

  return (
    <div style={{ position: "relative", width, height }}>
      <Image
        fill
        alt={slide.alt || "Gallery Image"}
        src={slide.src}
        loading="eager"
        draggable={false}
        placeholder={slide.blurDataURL ? "blur" : undefined}
        onError={(e) => {
          e.currentTarget.src = "/placeholder.webp";
        }}
        style={{
          objectFit: cover ? "cover" : "contain",
          cursor: click ? "pointer" : undefined,
        }}
        sizes={`${Math.ceil((width / window.innerWidth) * 100)}vw`}
        onClick={
          offset === 0 ? () => click?.({ index: currentIndex }) : undefined
        }
      />
    </div>
  );
}
