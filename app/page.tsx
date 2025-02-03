import CreateForm from "@/components/create-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function Home() {
  return (
    <section className="flex justify-center items-center h-screen gap-10">
      <CreateForm />
      <div className="border border-gray-400 p-10 flex flex-col justify-center items-center rounded-2xl gap-8">
        <Input placeholder="Enter ID" />
        <Button className="w-full">Join</Button>
      </div>
    </section>
  );
}
