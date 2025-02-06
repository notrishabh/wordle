import CreateForm from "@/components/create-form";
import RandomJoin from "@/components/random-join";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function Home() {
  return (
    <section className="flex justify-center items-center h-screen gap-10">
      <CreateForm />
      <div className="border border-gray-400 p-10 flex justify-center items-center rounded-2xl gap-12">
        <div className="flex flex-col justify-center items-center gap-8">
          <Input placeholder="Enter ID" />
          <Button className="w-full">Join</Button>
        </div>
        OR
        <div className="h-24">
          <RandomJoin />
        </div>
      </div>
    </section>
  );
}
