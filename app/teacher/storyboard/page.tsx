"use client";

import BeatCard from "@/components/studio/BeatCard";
import { useTeacher } from "@/lib/store";

export default function StoryboardPage() {
  const { lesson } = useTeacher();
  return (
    <div className="container mx-auto grid gap-4 p-6 md:grid-cols-2 xl:grid-cols-3">
      {lesson.beats.map((beat) => (
        <BeatCard key={beat.id} beat={beat} />
      ))}
    </div>
  );
}
