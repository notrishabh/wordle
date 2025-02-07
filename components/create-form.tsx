"use client";
import { useState } from "react";
import { Button } from "./ui/button";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "./ui/input-otp";
import { useRouter } from "next/navigation";
import { encryptWord } from "@/utils/utils";
import { REGEXP_ONLY_CHARS } from "input-otp";

export default function CreateForm() {
  const [createWord, setCreateWord] = useState("");
  const [error, setError] = useState<boolean>(false);
  const router = useRouter();

  const checkWordApi = async () => {
    const res = await fetch(
      `https://api.dictionaryapi.dev/api/v2/entries/en/${createWord}`,
    );
    if (res.status !== 200) {
      setError(true);
      return;
    }
    setError(false);
    return res.json();
  };
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    checkWordApi().then(async (res) => {
      if (res) {
        const encryptedWord = await encryptWord(createWord.trim());
        router.push(`/game/${encodeURIComponent(encryptedWord)}`);
      }
    });
  };
  return (
    <form
      onSubmit={handleSubmit}
      className="border border-gray-400 p-10 flex flex-col justify-center items-center rounded-2xl gap-8"
    >
      <div>
        {error ? <p className="text-red-700 mb-2">Word not found</p> : ""}
        <p className="text-left w-full mb-2">Enter word</p>
        <InputOTP
          pattern={REGEXP_ONLY_CHARS}
          inputMode="text"
          maxLength={5}
          value={createWord}
          onChange={(e) => setCreateWord(e)}
        >
          <InputOTPGroup className="uppercase font-semibold">
            <InputOTPSlot index={0} />
            <InputOTPSlot index={1} />
            <InputOTPSlot index={2} />
            <InputOTPSlot index={3} />
            <InputOTPSlot index={4} />
          </InputOTPGroup>
        </InputOTP>
      </div>
      <Button type="submit" className="w-full">
        Create
      </Button>
    </form>
  );
}
