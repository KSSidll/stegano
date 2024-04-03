import { encrypt, decrypt } from "@/utils/crypto/chacha20";

test("encrypt followed by decrypt doesn't change the message", () => {
  const message = "test_message";
  const key = "test_key";

  expect(decrypt(key, encrypt(key, message)));
});
