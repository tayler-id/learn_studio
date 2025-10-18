import type { Beat, Feedback, StudentProfile, ThemeKey } from "./types";

const clamp01 = (value: number) => Math.max(0, Math.min(1, value));

const softmax = (modalities: { visual: number; audio: number; steps: number }) => {
  const exp = {
    visual: Math.exp(modalities.visual),
    audio: Math.exp(modalities.audio),
    steps: Math.exp(modalities.steps),
  };
  const total = exp.visual + exp.audio + exp.steps;
  return {
    visual: exp.visual / total,
    audio: exp.audio / total,
    steps: exp.steps / total,
  };
};

export function updateFromFeedback(
  student: StudentProfile,
  conceptId: string,
  feedback: Feedback,
  lastBeat: Beat
): StudentProfile {
  const updated: StudentProfile = {
    ...student,
    mastery: { ...student.mastery },
    preferences: {
      ...student.preferences,
      modality: { ...student.preferences.modality },
    },
    themeWeights: { ...student.themeWeights },
  };

  const previousMastery = updated.mastery[conceptId] ?? 0;
  updated.mastery[conceptId] = clamp01(0.7 * previousMastery + 0.3 * (feedback.correct ? 1 : 0));

  const expected = 1 / (1 + Math.exp(-(updated.difficulty - lastBeat.itemDifficulty)));
  const k = 0.1 * (feedback.hintUsed ? 0.5 : 1);
  updated.difficulty = clamp01(updated.difficulty + k * ((feedback.correct ? 1 : 0) - expected));

  const modality = updated.preferences.modality;
  const addVisual = (feedback.taps?.pictures ? 0.3 : 0) + (feedback.emoji === "wow" ? 0.1 : 0);
  const addSteps = (feedback.taps?.steps ? 0.3 : 0) + (feedback.emoji === "sad" ? 0.1 : 0);
  const addAudio = (feedback.taps?.audio ? 0.3 : 0) + (feedback.captions ? 0.1 : 0);
  updated.preferences.modality = softmax({
    visual: modality.visual + addVisual,
    steps: modality.steps + addSteps,
    audio: modality.audio + addAudio,
  });

  if (feedback.correct && feedback.emoji === "wow") {
    const theme = lastBeat.theme as ThemeKey;
    const weight = updated.themeWeights[theme] ?? 0.25;
    updated.themeWeights[theme] = clamp01(weight + 0.1);
    (Object.keys(updated.themeWeights) as ThemeKey[]).forEach((key) => {
      if (key !== theme) {
        updated.themeWeights[key] = clamp01(updated.themeWeights[key] - 0.03);
      }
    });
  }

  if (feedback.translate) {
    updated.language = "bilingual";
  }
  if (!feedback.correct || feedback.hintUsed) {
    updated.scaffolding = updated.scaffolding === "minimal" ? "guided" : "step_by_step";
  } else if (feedback.correct && updated.scaffolding !== "minimal") {
    updated.scaffolding = updated.scaffolding === "step_by_step" ? "guided" : "minimal";
  }

  return updated;
}

export type Plan = {
  imageDelta?: string;
  videoScript?: string;
  nextTaskKind: Beat["task"]["kind"];
  theme: ThemeKey;
};

export function decidePlan(
  student: StudentProfile,
  conceptId: string,
  lastBeat: Beat
): Plan {
  const modality = student.preferences.modality;
  const theme = pickTheme(student);

  const lowMastery = (student.mastery[conceptId] ?? 0) < 0.5;
  const wantsSteps = modality.steps > Math.max(modality.visual, modality.audio);
  const wantsVisual = modality.visual > Math.max(modality.steps, modality.audio);
  const wantsAudio = modality.audio > Math.max(modality.visual, modality.steps);

  let nextTaskKind: Beat["task"]["kind"] = lastBeat.task.kind;
  if (lowMastery) nextTaskKind = "guided";
  if (!lowMastery && wantsVisual) nextTaskKind = "drag";
  if (!lowMastery && wantsSteps) nextTaskKind = "guided";
  if (!lowMastery && !wantsSteps && !wantsVisual) nextTaskKind = "choice";

  const imageDelta = wantsVisual
    ? `Increase outline thickness; add large labels (1/2, 1/4); high-contrast; theme: ${theme}`
    : undefined;
  const videoScript = wantsSteps
    ? `Step 1: draw a line through the middle. Step 2: check both sides are equal. Slow narration. Overlays 1 then 2. Theme: ${theme}`
    : wantsAudio
    ? `Add clearer narration with friendly tone; keep visuals simple; captions on. Theme: ${theme}`
    : undefined;

  return { imageDelta, videoScript, nextTaskKind, theme };
}

function pickTheme(student: StudentProfile): ThemeKey {
  const entries = Object.entries(student.themeWeights) as [ThemeKey, number][];
  entries.sort((a, b) => b[1] - a[1]);
  return entries[0]?.[0] ?? "animals";
}
