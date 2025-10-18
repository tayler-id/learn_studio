import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <main className="container mx-auto flex flex-col items-center gap-4 p-8 text-center">
      <h1 className="text-3xl font-bold">KidStudio</h1>
      <p className="max-w-xl text-muted-foreground">
        A teacher-first adaptive lesson studio with per-student agents that react to feedback in real time.
      </p>
      <div className="flex gap-3">
        <Link href="/teacher">
          <Button>Teacher Studio</Button>
        </Link>
        <Link href="/student">
          <Button variant="secondary">Student Player</Button>
        </Link>
      </div>
    </main>
  );
}
