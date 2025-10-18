"use client";

import { useState } from "react";
import type { Beat, Feedback, StudentProfile } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";

export interface StudentPlayerProps {
  beat: Beat;
  student: StudentProfile;
  onFeedback: (feedback: Feedback) => Promise<void>;
}

export function StudentPlayer({ beat, student, onFeedback }: StudentPlayerProps) {
  const [pending, setPending] = useState(false);

  const send = async (feedback: Feedback) => {
    try {
      setPending(true);
      await onFeedback(feedback);
    } finally {
      setPending(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex aspect-video w-full items-center justify-center rounded bg-muted">
        {beat.video && !beat.video.placeholder ? (
          <video className="w-full rounded" controls src={beat.video.src} />
        ) : (
          <div className="p-6 text-center text-sm text-muted-foreground">
            {beat.video?.placeholder
              ? "Video adapts once Veo preview is enabled."
              : "(Video will appear here when generated)"}
          </div>
        )}
      </div>
      {beat.image && (
        beat.image.placeholder ? (
          <div className="rounded border bg-muted p-4 text-center text-sm text-muted-foreground">
            Illustration adapts once Gemini image generation is enabled.
          </div>
        ) : (
          <img className="w-full rounded" src={beat.image.src} alt={beat.image.alt ?? ""} />
        )
      )}
      <div className="rounded border p-3">
        <div className="font-medium">Try it</div>
        <div className="text-sm text-muted-foreground">Task type: {beat.task.kind}</div>
      </div>
      <div className="space-y-3 rounded border p-3">
        <div className="font-medium">React</div>
        <div className="flex gap-2">
          <Button
            disabled={pending}
            onClick={() => send({ correct: true, emoji: "wow", taps: { pictures: true } })}
          >
            🤩 More pictures
          </Button>
          <Button
            disabled={pending}
            variant="secondary"
            onClick={() => send({ correct: false, hintUsed: true, taps: { steps: true } })}
          >
            😕 More steps
          </Button>
          <Button
            variant="outline"
            disabled={pending}
            onClick={() => send({ correct: true, taps: { audio: true }, captions: true })}
          >
            🙂 More audio
          </Button>
        </div>
        <div className="text-xs text-muted-foreground">
          (Demo buttons simulate correctness + taps; wire to real widgets later.)
        </div>
        <div className="pt-2 text-sm text-muted-foreground">Pace</div>
        <Slider defaultValue={[50]} max={100} step={1} disabled />
      </div>
      <div className="text-xs text-muted-foreground">
        Language: {student.language.toUpperCase()} · Scaffolding: {student.scaffolding.replace(/_/g, " ")}
      </div>
    </div>
  );
}
