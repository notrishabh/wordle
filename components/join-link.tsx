"use client";
import { useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { useRouter } from "next/navigation";

export default function JoinLink() {
  const [link, setLink] = useState("");
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLink(e.target.value);
  };

  const handleJoinLink = () => {
    router.push(link);
  };
  return (
    <div className="flex flex-col justify-center items-center gap-8">
      <Input value={link} onChange={handleChange} placeholder="Enter Link" />
      <Button onClick={handleJoinLink} className="w-full">
        Join
      </Button>
    </div>
  );
}
