import { Chacha20 } from "ts-chacha20";

const encoder = new TextEncoder();
const decoder = new TextDecoder();

// typically we could increment that for each operation but since this is local only and we aren't storing any information anywhere, we do the oopsie that is unsafe nonce value, not very great, but i don't know how else we could handle that in current context
const nonce: Uint8Array = stringToUint8Array("nonce_value", 12);

/**
 * Encrypts the [message] with [key]
 * @param key Key to use to encrypt the [message]
 * @param message Message to encrypt
 * @returns Encrypted [message]
 */
export function encrypt(key: string, message: string): string {
  return Buffer.from(
    new Chacha20(stringToUint8Array(key, 32), nonce).encrypt(
      new Uint8Array(Buffer.from(message))
    ).buffer
  ).toString("base64");
}

/**
 * Decrypts the [encrypted_message] with [key]
 * @param key Key to use to decrypt the [encrypted_message]
 * @param encrypted_message Message to decrypt
 * @returns Decrypted [encrypted_message]
 */
export function decrypt(key: string, encrypted_message: string): string {
  return Buffer.from(
    new Chacha20(stringToUint8Array(key, 32), nonce).decrypt(
      new Uint8Array(Buffer.from(encrypted_message, "base64"))
    ).buffer
  ).toString();
}

/**
 * Converts string [str] to Uint8Array of [lenght] length
 * @param str String to convert
 * @param length Length in bytes of the resulting Uint8Array
 * @returns Uint8Array representation of [str] with [length] length
 */
function stringToUint8Array(str: string, length: number): Uint8Array {
  const encoded = encoder.encode(str);
  const array = new Uint8Array(length);
  array.set(encoded.subarray(0, Math.min(length, encoded.length)));

  return array;
}
