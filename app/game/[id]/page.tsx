"use client";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { useRouter, useParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";

const SECRET_KEY = process.env.NEXT_PUBLIC_SECRET;

async function decryptWord(encryptedData: string) {
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

async function getCryptoKey() {
  const keyMaterial = new TextEncoder().encode(SECRET_KEY);
  const hash = await crypto.subtle.digest("SHA-256", keyMaterial); // ✅ Ensure 32-byte key
  return crypto.subtle.importKey(
    "raw",
    hash.slice(0, 32),
    { name: "AES-GCM" },
    false,
    ["encrypt", "decrypt"],
  );
}

export default function GamePage() {
  const turns = 6;
  const router = useRouter();
  const id = useParams().id;
  const [word, setWord] = useState<string | null>(null);
  const [guess, setGuess] = useState<string[]>([]);
  const reffer = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    if (id) {
      decryptWord(decodeURIComponent(id as string)).then((decryptedWord) => {
        if (decryptedWord) {
          setWord(decryptedWord);
        } else {
          router.replace("/");
        }
      });
    }
  }, [id]);

  const handleChange = (e: string, index: number) => {
    setGuess((prev) => {
      const newGuess = [...prev];
      newGuess[index] = e;
      return newGuess;
    });
  };

  const handleWordSubmit = (
    e: React.KeyboardEvent<HTMLInputElement>,
    index: number,
  ) => {
    if (e.code === "Enter") {
      reffer.current[index + 1]?.focus();
    }
  };

  if (!word) return <p>Loading...</p>;

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div className="space-y-2">
        {[...Array(turns)].map((_, index) => (
          <InputOTP
            onKeyDown={(e) => handleWordSubmit(e, index)}
            autoFocus={index === 0}
            maxLength={5}
            ref={(ref) => {
              reffer.current[index] = ref;
            }}
            key={index}
            value={guess[index] || ""}
            onChange={(e) => handleChange(e, index)}
          >
            <InputOTPGroup className="uppercase font-semibold">
              <InputOTPSlot index={0} />
              <InputOTPSlot index={1} />
              <InputOTPSlot index={2} />
              <InputOTPSlot index={3} />
              <InputOTPSlot index={4} />
            </InputOTPGroup>
          </InputOTP>
        ))}
      </div>
    </div>
  );
}
