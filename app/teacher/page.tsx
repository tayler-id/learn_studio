"use client";

import { useState } from "react";
import { useTeacher } from "@/lib/store";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

export default function TeacherConcept() {
  const { lesson } = useTeacher();
  const [bullets, setBullets] = useState(
    lesson.concepts.map((c) => `- ${c.name}: ${c.coreIdea}`).join("\n")
  );

  const applyAssists = () => {
    alert(
      "Applied: standards tags, misconceptions, pacing, reading-level. Move to Storyboard."
    );
    window.location.href = "/teacher/storyboard";
  };

  return (
    <div className="container mx-auto space-y-4 p-6">
      <Card className="mx-auto max-w-3xl">
        <CardHeader>
          <CardTitle>Concept Map</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Textarea
            value={bullets}
            onChange={(event) => setBullets(event.target.value)}
            rows={12}
          />
          <div className="flex gap-2">
            <Button onClick={applyAssists}>Apply Micro-Assists → Storyboard</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
