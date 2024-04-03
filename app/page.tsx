"use client";

import ImageDrop from "@/components/ImageDrop";
import { ChangeEvent, useEffect, useState } from "react";
import Image from "next/image";
import { encode, decode } from "@/utils/steganography";
import { decrypt, encrypt } from "@/utils/crypto/chacha20";

export default function Home() {
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [messageToEncode, setMessageToEncode] = useState<string>("");
  const [messageCipherKey, setMessageCipherKey] = useState<string>("");
  const [shouldMessageCipher, setShouldMessageCipher] =
    useState<boolean>(false);
  const [messageDecipherKey, setMessageDecipherKey] = useState<string>("");
  const [shouldMessageDecipher, setShouldMessageDecipher] =
    useState<boolean>(false);
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

  const handleSetCipherKey = (e: ChangeEvent<HTMLInputElement>) => {
    setMessageCipherKey(e.target.value);
  };

  const handleSetShouldMessageCipher = (e: any) => {
    setShouldMessageCipher(!shouldMessageCipher);
  };

  const handleSetDecipherKey = (e: ChangeEvent<HTMLInputElement>) => {
    setMessageDecipherKey(e.target.value);
  };

  const handleSetShouldMessageDecipher = (e: any) => {
    setShouldMessageDecipher(!shouldMessageDecipher);
  };

  const handleEncodeEvent = () => {
    if (messageToEncode !== "") {
      var message = messageToEncode;

      if (shouldMessageCipher) {
        if (messageCipherKey === "") {
          return;
        }

        message = encrypt(messageCipherKey, message);
      }

      const newEncodedImageSrc = encode(message, imageSrc);
      setEncodedImageSrc(newEncodedImageSrc);

      setTimeout(() => {
        const decodedMessage = decode(newEncodedImageSrc);
        setDecodedMessage(decodedMessage);
      }, 500); // i couldn't find out why, but if we try to decode too fast, we get an index error, so to have that happen less we decode after 500ms
    }
  };

  const handleDecodeEvent = () => {
    if (messageDecipherKey !== "" && decodedMessage !== null) {
      setDecodedMessage(decrypt(messageDecipherKey, decodedMessage));
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
                placeholder="Message to encode in the image"
                value={messageToEncode}
                onChange={handleSetMessageToEncode}
                className="bg-gray-900 rounded-xl w-2/3 p-3"
              />

              <div className="pt-2" />

              <div className="flex flex-row w-2/3 items-center justify-center">
                <div
                  className="flex flex-row"
                  onClick={handleSetShouldMessageCipher}
                >
                  <input
                    name="shouldMessageCipherCheckbox"
                    type="checkbox"
                    checked={shouldMessageCipher}
                    onChange={handleSetShouldMessageCipher}
                  />

                  <div className="pe-2" />

                  <label htmlFor="shouldMessageCipherCheckbox">
                    Cipher Message
                  </label>
                </div>

                {shouldMessageCipher ? (
                  <>
                    <div className="pe-2" />
                    <input
                      placeholder="Cipher key"
                      type="text"
                      value={messageCipherKey}
                      onChange={handleSetCipherKey}
                      className="bg-gray-900 rounded-xl w-2/3 p-3"
                    />
                  </>
                ) : (
                  <></>
                )}
              </div>

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

                    <div className="pt-2" />

                    <div className="flex flex-row items-center justify-center">
                      <div
                        className="flex flex-row"
                        onClick={handleSetShouldMessageDecipher}
                      >
                        <input
                          name="shouldMessageDecipherCheckbox"
                          type="checkbox"
                          checked={shouldMessageDecipher}
                          onChange={handleSetShouldMessageDecipher}
                        />

                        <div className="pe-2" />

                        <label htmlFor="shouldMessageDecipherCheckbox">
                          Decipher
                        </label>
                      </div>

                      {shouldMessageDecipher ? (
                        <>
                          <div className="pe-2" />
                          <input
                            placeholder="Decipher key"
                            type="text"
                            value={messageDecipherKey}
                            onChange={handleSetDecipherKey}
                            className="bg-gray-900 rounded-xl w-2/3 p-3"
                          />
                        </>
                      ) : (
                        <></>
                      )}
                    </div>
                    {shouldMessageDecipher ? (
                      <>
                        <div className="pt-2" />
                        <button
                          type="button"
                          onClick={handleDecodeEvent}
                          className="bg-gray-900 p-3 rounded-2xl"
                        >
                          Decode
                        </button>
                      </>
                    ) : (
                      <></>
                    )}
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
