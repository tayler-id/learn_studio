"use client";

import { useParams } from "next/navigation";
import { StudentPlayer } from "@/components/player/StudentPlayer";
import { useClass, useTeacher } from "@/lib/store";

export default function StudentPage() {
  const params = useParams();
  const studentId = params?.id as string;
  const { students, onFeedback, currentBeatIndex } = useClass();
  const { lesson } = useTeacher();
  const student = students.find((item) => item.id === studentId);

  if (!student) {
    return <div className="container mx-auto p-6">Unknown student.</div>;
  }

  const beat = lesson.beats[currentBeatIndex[student.id]];

  return (
    <div className="container mx-auto space-y-4 p-6">
      <StudentPlayer
        beat={beat}
        student={student}
        onFeedback={async (feedback) => onFeedback(student.id, feedback)}
      />
    </div>
  );
}
