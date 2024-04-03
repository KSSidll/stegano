/**
 * @jest-environment node
 */

import { encrypt, decrypt } from "@/utils/crypto/chacha20";

test("encrypt followed by decrypt doesn't change the message", () => {
  const message = "test_message";
  const key = "test_key";

  const encrypted_message = encrypt(key, message);
  const decrypted_message = decrypt(key, encrypted_message);

  expect(decrypted_message).toBe(message);
});
