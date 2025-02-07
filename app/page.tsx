import CreateForm from "@/components/create-form";
import JoinLink from "@/components/join-link";
import RandomJoin from "@/components/random-join";

export default function Home() {
  return (
    <section className="flex flex-col md:flex-row justify-center items-center h-screen gap-10">
      <CreateForm />
      <div className="border border-gray-400 p-10 flex flex-col md:flex-row justify-center items-center rounded-2xl gap-2 md:gap-8">
        <JoinLink />
        OR
        <div className="h-24">
          <RandomJoin />
        </div>
      </div>
    </section>
  );
}
