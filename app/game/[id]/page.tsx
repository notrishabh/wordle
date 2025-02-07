"use client";
import RandomJoin from "@/components/random-join";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { useRouter, useParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { decryptWord } from "@/utils/utils";

enum GameStatus {
  Win = "win",
  Loss = "loss",
  Ongoing = "ongoing",
}

type GuessedLetter = {
  letter: string;
  index: number;
  status: "yellow" | "green" | "gray";
};

export default function GamePage() {
  const turns = 6;
  const router = useRouter();
  const id = useParams().id;
  const [word, setWord] = useState<string | null>(null);
  const [guess, setGuess] = useState<string[]>([]);
  const [error, setError] = useState<boolean>(false);
  const reffer = useRef<(HTMLInputElement | null)[]>([]);
  const [gameStatus, setGameStatus] = useState<GameStatus>(GameStatus.Ongoing);
  const [guessedLetters, setGuessedLetters] = useState<GuessedLetter[]>([]);
  const [submittedIndex, setSubmittedIndex] = useState(-1);
  const [multipleLetter, setMultipleLetter] = useState<string[]>([]);

  useEffect(() => {
    if (id) {
      decryptWord(decodeURIComponent(id as string)).then((decryptedWord) => {
        if (decryptedWord) {
          setWord(decryptedWord);
          const m = new Map<string, number>();
          for (const char of decryptedWord) {
            m.set(char, (m.get(char) || 0) + 1);
            if (m.get(char) === 2) {
              setMultipleLetter((prev) => [...prev, char]);
            }
          }
        } else {
          router.replace("/");
        }
      });
    }
  }, [id]);

  const checkWordApi = async (guessedWord: string) => {
    const res = await fetch(
      `https://api.dictionaryapi.dev/api/v2/entries/en/${guessedWord}`,
    );
    if (res.status !== 200) {
      setError(true);
      return;
    }
    setError(false);
    return res.json();
  };

  const verifyWord = (index: number) => {
    const currentWord = guess[index];
    checkWordApi(currentWord).then((res) => {
      if (res) {
        setSubmittedIndex(index);
        currentWord.split("").forEach((letter, index) => {
          if (word?.includes(letter)) {
            if (word[index] === letter) {
              setGuessedLetters((prev) => [
                ...prev,
                {
                  letter,
                  index,
                  status: "green",
                },
              ]);
            } else {
              setGuessedLetters((prev) => [
                ...prev,
                {
                  letter,
                  index,
                  status: "yellow",
                },
              ]);
            }
          } else {
            setGuessedLetters((prev) => [
              ...prev,
              {
                letter,
                index,
                status: "gray",
              },
            ]);
          }
        });
        if (currentWord === word) {
          setGameStatus(GameStatus.Win);
        } else if (index === turns - 1) {
          setGameStatus(GameStatus.Loss);
        } else {
          reffer.current[index + 1]?.focus();
        }
      }
    });
  };

  const handleChange = (e: string, index: number) => {
    if (error) {
      setError(false);
    }
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
      verifyWord(index);
    }
  };

  const renderGameOverModal = () => {
    switch (gameStatus) {
      case GameStatus.Loss:
        return (
          <Dialog defaultOpen>
            <DialogContent>
              <DialogHeader>
                <DialogTitle className="text-red-500">You Lose.</DialogTitle>
                <DialogDescription>The word was {word}</DialogDescription>
              </DialogHeader>
              <DialogFooter className="gap-2 flex flex-row">
                <div className="w-full">
                  <RandomJoin />
                </div>
                <Button className="w-full" onClick={() => router.replace("/")}>
                  Go Home
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        );
      case GameStatus.Win:
        return (
          <Dialog defaultOpen>
            <DialogContent>
              <DialogHeader>
                <DialogTitle className="text-green-500">
                  Awesome! You Win.
                </DialogTitle>
                <DialogDescription>
                  The word was {word} <br />
                  Challenge a friend or play again.
                </DialogDescription>
              </DialogHeader>
              <DialogFooter className="gap-2 flex flex-row">
                <div className="w-full">
                  <RandomJoin />
                </div>
                <Button className="w-full" onClick={() => router.replace("/")}>
                  Go Home
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        );
      default:
        return "";
    }
  };

  if (!word) return <p>Loading...</p>;

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div className="space-y-2">
        {error && (
          <p className="text-red-500 font-semibold text-center">
            Word not found
          </p>
        )}
        {renderGameOverModal()}
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
              {[...Array(5)].map((_, charIdx) => {
                const currentWord = guess[index] || ""; // Get the current word (if exists)
                const letter = currentWord[charIdx] || ""; // Get the letter at the current index
                const guessedLetter = guessedLetters.find(
                  (gl) => gl.index === charIdx && gl.letter === letter,
                );

                return (
                  <InputOTPSlot
                    key={charIdx}
                    index={charIdx}
                    className={`${
                      index <= submittedIndex && guessedLetter
                        ? guessedLetter.status === "green"
                          ? "bg-green-500 text-white"
                          : guessedLetter.status === "yellow"
                            ? "bg-yellow-500 text-black"
                            : "bg-gray-500 text-white"
                        : ""
                    }`}
                  />
                );
              })}
            </InputOTPGroup>
          </InputOTP>
        ))}
      </div>
    </div>
  );
}
