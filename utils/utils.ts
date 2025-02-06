const SECRET_KEY = process.env.NEXT_PUBLIC_SECRET;

export async function encryptWord(word: string) {
  const key = await getCryptoKey();
  const iv = crypto.getRandomValues(new Uint8Array(12)); // ✅ Random 12-byte IV
  const encoded = new TextEncoder().encode(word);

  const encrypted = await crypto.subtle.encrypt(
    { name: "AES-GCM", iv },
    key,
    encoded,
  );

  // ✅ Convert encrypted data & IV to Base64 using `Buffer`
  const encryptedBase64 = Buffer.from(new Uint8Array(encrypted)).toString(
    "base64",
  );
  const ivBase64 = Buffer.from(iv).toString("base64");

  return `${encryptedBase64}.${ivBase64}`; // ✅ Return "<encryptedText>.<iv>"
}

async function getCryptoKey() {
  const keyMaterial = new TextEncoder().encode(SECRET_KEY);
  const hash = await crypto.subtle.digest("SHA-256", keyMaterial);
  return crypto.subtle.importKey(
    "raw",
    hash.slice(0, 32),
    { name: "AES-GCM" },
    false,
    ["encrypt", "decrypt"],
  );
}

export async function decryptWord(encryptedData: string) {
  try {
    const key = await getCryptoKey();
    const [encryptedBase64, ivBase64] = encryptedData.split(".");

    if (!encryptedBase64 || !ivBase64)
      throw new Error("Invalid encrypted data");

    // ✅ Decode Base64 properly
    const encryptedArray = new Uint8Array(
      Buffer.from(encryptedBase64, "base64"),
    );
    const ivArray = new Uint8Array(Buffer.from(ivBase64, "base64"));

    if (ivArray.length !== 12) throw new Error("Invalid IV length");

    const decrypted = await crypto.subtle.decrypt(
      { name: "AES-GCM", iv: ivArray },
      key,
      encryptedArray,
    );

    return new TextDecoder().decode(decrypted);
  } catch (error) {
    console.error("Decryption failed:", error);
    return null;
  }
}
