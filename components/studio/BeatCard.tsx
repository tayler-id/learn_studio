"use client";

import { useState } from "react";
import { Beat } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { generateImage, generateVideo } from "@/lib/media";
import { safeImagePrompt, safeVideoScript } from "@/lib/safety";
import { useTeacher } from "@/lib/store";

export default function BeatCard({ beat }: { beat: Beat }) {
  const { lesson, setLesson } = useTeacher();
  const [imagePending, setImagePending] = useState(false);
  const [videoPending, setVideoPending] = useState(false);

  const applyUpdates = (updates: Partial<Beat>) => {
    const updatedBeats = lesson.beats.map((candidate) =>
      candidate.id === beat.id ? { ...candidate, ...updates } : candidate
    );
    setLesson({ ...lesson, beats: updatedBeats });
  };

  const onGenerateImage = async () => {
    try {
      setImagePending(true);
      const image = await generateImage(safeImagePrompt(`${beat.title}: add labels 1/2`));
      applyUpdates({ image });
    } catch (error) {
      console.error("Failed to generate image", error);
    } finally {
      setImagePending(false);
    }
  };

  const onGenerateVideo = async () => {
    try {
      setVideoPending(true);
      const video = await generateVideo(safeVideoScript(`Narrate: ${beat.text}.`));
      applyUpdates({ video });
    } catch (error) {
      console.error("Failed to generate video", error);
    } finally {
      setVideoPending(false);
    }
  };

  return (
    <Card className="flex h-full flex-col">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          {beat.title}
          <Badge variant="secondary">{beat.theme}</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <p className="text-sm text-muted-foreground">{beat.text}</p>
        <div className="space-x-2">
          <Button size="sm" onClick={onGenerateImage} disabled={imagePending}>
            {imagePending ? "Generating…" : "Generate Image"}
          </Button>
          <Button size="sm" variant="secondary" onClick={onGenerateVideo} disabled={videoPending}>
            {videoPending ? "Generating…" : "Generate 8s Video"}
          </Button>
        </div>
        {beat.image && (
          <div className="overflow-hidden rounded border bg-muted">
            {beat.image.placeholder ? (
              <div className="p-6 text-center text-sm text-muted-foreground">
                Add a Gemini API key to replace this placeholder illustration.
              </div>
            ) : (
              <img
                src={beat.image.src}
                alt={beat.image.alt ?? "Generated illustration"}
                className="h-auto w-full object-contain"
              />
            )}
          </div>
        )}
        {beat.video && (
          beat.video.placeholder ? (
            <div className="rounded border bg-muted p-4 text-sm text-muted-foreground">
              Enable the Veo feature flag to stream generated clips here.
            </div>
          ) : (
            <video className="w-full rounded" controls src={beat.video.src} />
          )
        )}
      </CardContent>
    </Card>
  );
}
