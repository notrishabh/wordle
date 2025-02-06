"use client";
import { useState } from "react";
import { Button } from "./ui/button";
import { encryptWord } from "@/utils/utils";
import { useRouter } from "next/navigation";

export default function RandomJoin() {
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const checkWordApi = async (randomWord: string) => {
    const res = await fetch(
      `https://api.dictionaryapi.dev/api/v2/entries/en/${randomWord}`,
    );
    if (res.status !== 200) {
      setError(true);
      return;
    }
    setError(false);
    return res.json();
  };

  const getRandomWord = async () => {
    const res = await fetch(
      "https://random-word-api.vercel.app/api?words=1&length=5",
    );
    if (res.status !== 200) {
      setError(true);
      return;
    }
    setError(false);
    return res.json();
  };

  const startRandomGame = async () => {
    setLoading(true);
    getRandomWord().then((word) => {
      if (word) {
        checkWordApi(word[0]).then(async (res) => {
          if (res) {
            setLoading(false);
            const encryptedWord = await encryptWord(word[0].trim());
            router.replace(`/game/${encodeURIComponent(encryptedWord)}`);
          }
        });
      }
    });
  };

  return (
    <div className="h-full">
      {error && <p>Something went wrong.</p>}
      <Button className="h-full" onClick={startRandomGame}>
        {loading ? "Loading" : "Random"}
      </Button>
    </div>
  );
}
