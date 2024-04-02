"use client";

import ImageDrop from "@/components/ImageDrop";
import { ChangeEvent, useEffect, useState } from "react";
import Image from "next/image";
import { encode, decode } from "@/utils/steganography";

export default function Home() {
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [messageToEncode, setMessageToEncode] = useState<string>("");
  const [encodedImageSrc, setEncodedImageSrc] = useState<string | null>(null);
  const [decodedMessage, setDecodedMessage] = useState<string | null>(null);

  useEffect(() => {
    if (imageSrc !== null) {
      const decodedMessage = decode(imageSrc);

      if (decodedMessage) {
        setEncodedImageSrc(imageSrc);
        setDecodedMessage(decodedMessage);
      }
    }

    return () => {};
  }, [imageSrc]);

  const handleSetMessageToEncode = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setMessageToEncode(e.target.value);
  };

  const handleEncodeEvent = () => {
    if (messageToEncode !== "") {
      const newEncodedImageSrc = encode(messageToEncode, imageSrc);
      setEncodedImageSrc(newEncodedImageSrc);

      const decodedMessage = decode(newEncodedImageSrc);
      setDecodedMessage(decodedMessage);
    }
  };

  return (
    <main className="h-screen w-screen">
      <div className="flex flex-row h-full w-full items-center justify-center">
        <div className="flex-1">
          <ImageDrop onImageAccepted={(image) => setImageSrc(image)} />

          {imageSrc ? (
            <div className="flex flex-col justify-center pt-2 items-center">
              <div>Message to encode in the image</div>

              <div className="pt-2" />

              <textarea
                value={messageToEncode}
                onChange={handleSetMessageToEncode}
                className="bg-gray-900 rounded-xl w-2/3 p-3"
              />

              <div className="pt-2" />

              <button
                type="button"
                onClick={handleEncodeEvent}
                className="bg-gray-900 p-3 rounded-2xl"
              >
                Encode
              </button>
            </div>
          ) : (
            <></>
          )}
        </div>

        {encodedImageSrc ? (
          <>
            <div style={{ fontSize: "4.5em" }}>&rarr;</div>

            <div className="flex-1 flex w-full justify-center">
              <div className="flex flex-col items-center">
                <Image src={encodedImageSrc} alt="" width={300} height={300} />

                {decodedMessage ? (
                  <div className="flex flex-col pt-2 items-center">
                    <div>Message extracted from the image</div>
                    <div className="pt-2" />
                    <div>{decodedMessage}</div>
                  </div>
                ) : (
                  <></>
                )}
              </div>
            </div>
          </>
        ) : (
          <></>
        )}
      </div>
    </main>
  );
}
