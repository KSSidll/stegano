import { useState, DragEvent, useEffect } from "react";
import Image from "next/image";

type ImageDropProps = {
  onImageAccepted?: (imageData: string) => void;
  message?: string;
  acceptedType?: string;
  imageAlt?: string;
  imageWidth?: number;
  imageHeight?: number;
  errorMessage?: string;
  errorMessageTimeout?: number;
};

/**
 * Image drop component
 *
 * Will accept an image of type [acceptedType] via Drag&Drop and display it
 *
 * Calls [onImageAccepted] with image blob string when a valid image is provided
 * @param message Text displayed in the component
 * @param acceptedType Type of image that the component can accept
 * @param imageAlt Alternative text of the image
 * @param imageWidth Width in pixels of the image
 * @param imageHeight Height in pixels of the image
 * @param errorMessage Message displayed when an incorrect file is provided
 * @param errorMessageTimeout Timeout after which the error is cleared
 */
const ImageDrop: React.FC<ImageDropProps> = ({
  onImageAccepted = () => {},
  message = "Drag & Drop PNG Image Here",
  acceptedType = "image/png",
  imageAlt = "Dropped Image",
  imageWidth = 300,
  imageHeight = 300,
  errorMessage = "Please drop a PNG image.",
  errorMessageTimeout = 5000,
}) => {
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();

    const file = e.dataTransfer.files[0];
    if (file === undefined) {
      return;
    }

    // Check if the dropped file is a PNG image
    if (file.type !== acceptedType) {
      setError(errorMessage);
      return;
    }

    const reader = new FileReader();

    reader.onload = () => {
      const newImage = reader.result as string;
      setImageSrc(newImage);
      onImageAccepted(newImage);
      setError(null);
    };

    reader.readAsDataURL(file);
  };

  useEffect(() => {
    const timeout = setTimeout(() => setError(null), errorMessageTimeout);

    return () => clearTimeout(timeout);
  }, [error, errorMessageTimeout]);

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  return (
    <div
      className="w-full h-full flex justify-center items-center"
      onDrop={handleDrop}
      onDragOver={handleDragOver}
    >
      {imageSrc ? (
        <Image
          src={imageSrc}
          alt={imageAlt}
          width={imageWidth}
          height={imageHeight}
        />
      ) : (
        <div className="rounded-xl border-2 border-dashed p-8">
          {!error ? (
            <p className="text-center">{message}</p>
          ) : (
            <p className="text-red-500 text-center">{error}</p>
          )}
        </div>
      )}
    </div>
  );
};

export default ImageDrop;
