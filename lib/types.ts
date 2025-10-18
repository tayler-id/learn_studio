export type GradeBand = "K-2" | "3-5";
export type Modality = { visual: number; audio: number; steps: number };
export type ThemeKey = "sports" | "animals" | "baking" | "space";
export type ThemeWeights = Record<ThemeKey, number>;

export type Concept = {
  id: string;
  name: string;
  coreIdea: string;
  examples: string[];
  misconceptions: string[];
};

export type MediaAsset = {
  id: string;
  type: "image" | "video";
  src: string;
  alt?: string;
  provider?: "nanobanana" | "veo";
  synthID?: boolean;
  placeholder?: boolean;
};

export type Activity = {
  id: string;
  kind: "drag" | "choice" | "guided" | "challenge";
  content: any;
};

export type Beat = {
  id: string;
  conceptId: string;
  title: string;
  text: string;
  image?: MediaAsset;
  video?: MediaAsset;
  task: Activity;
  itemDifficulty: number;
  theme: ThemeKey;
};

export type Lesson = {
  id: string;
  title: string;
  gradeBand: GradeBand;
  concepts: Concept[];
  beats: Beat[];
};

export type StudentProfile = {
  id: string;
  name: string;
  gradeBand: GradeBand;
  readingLevel: GradeBand;
  language: "en" | "es" | "bilingual";
  preferences: { theme: ThemeKey; modality: Modality; pace: "slow" | "normal" | "fast" };
  accommodations: { dyslexia?: boolean };
  mastery: Record<string, number>;
  difficulty: number;
  scaffolding: "minimal" | "guided" | "step_by_step";
  themeWeights: ThemeWeights;
};

export type Feedback = {
  correct: boolean;
  hintUsed?: boolean;
  dwellMs?: number;
  emoji?: "sad" | "ok" | "wow";
  taps?: { pictures?: boolean; steps?: boolean; audio?: boolean };
  translate?: boolean;
  captions?: boolean;
};
