"use client";

import { useClass, useTeacher } from "@/lib/store";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

export default function Live() {
  const { students, currentBeatIndex } = useClass();
  const { lesson } = useTeacher();

  return (
    <div className="container mx-auto grid gap-4 p-6 md:grid-cols-2 xl:grid-cols-3">
      {students.map((student) => {
        const idx = currentBeatIndex[student.id];
        const conceptId = lesson.beats[idx]?.conceptId;
        const mastery = Math.round(100 * (student.mastery[conceptId ?? ""] ?? 0));
        return (
          <Card key={student.id}>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>{student.name}</span>
                <span className="text-sm text-muted-foreground">
                  Beat {idx + 1}/{lesson.beats.length}
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-sm">Mastery</div>
              <Progress value={mastery} className="h-2" />
              <div className="mt-2 text-xs text-muted-foreground">
                Modality: V {student.preferences.modality.visual.toFixed(2)} · A {student.preferences.modality.audio.toFixed(2)} · S {student.preferences.modality.steps.toFixed(2)}
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
