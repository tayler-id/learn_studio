import { nanoid } from "nanoid";
import type { Beat, Concept, Lesson, StudentProfile } from "./types";

export const demoConcepts: Concept[] = [
  {
    id: "c1",
    name: "Halves & Quarters",
    coreIdea: "Half means two equal parts; quarter means four equal parts.",
    examples: ["sandwich", "pizza", "apple"],
    misconceptions: ["any split is a half", "bigger piece can be half"],
  },
  {
    id: "c2",
    name: "Compare Fractions",
    coreIdea: "More equal parts → smaller pieces.",
    examples: ["chocolate bar"],
    misconceptions: ["4 is bigger than 2 so 1/4 > 1/2"],
  },
];

export const demoBeats: Beat[] = [
  {
    id: nanoid(),
    conceptId: "c1",
    title: "What is a half?",
    text: "A half is two equal parts.",
    itemDifficulty: 0.3,
    theme: "sports",
    task: { id: nanoid(), kind: "drag", content: { labels: ["1/2"] } },
  },
  {
    id: nanoid(),
    conceptId: "c1",
    title: "Make halves",
    text: "Split into two same-size pieces.",
    itemDifficulty: 0.4,
    theme: "animals",
    task: { id: nanoid(), kind: "guided", content: { steps: 2 } },
  },
  {
    id: nanoid(),
    conceptId: "c1",
    title: "What is a quarter?",
    text: "A quarter is four equal parts.",
    itemDifficulty: 0.5,
    theme: "baking",
    task: { id: nanoid(), kind: "choice", content: { options: ["1/2", "1/4"] } },
  },
];

export const demoLesson: Lesson = {
  id: "l1",
  title: "Fractions: Halves & Quarters",
  gradeBand: "K-2",
  concepts: demoConcepts,
  beats: demoBeats,
};

export const demoStudents: StudentProfile[] = [
  {
    id: "s1",
    name: "Alex",
    gradeBand: "K-2",
    readingLevel: "K-2",
    language: "en",
    preferences: {
      theme: "sports",
      modality: { visual: 0.6, audio: 0.2, steps: 0.2 },
      pace: "normal",
    },
    accommodations: {},
    mastery: { c1: 0.4, c2: 0 },
    difficulty: 0.4,
    scaffolding: "minimal",
    themeWeights: { sports: 0.8, animals: 0.1, baking: 0.05, space: 0.05 },
  },
  {
    id: "s2",
    name: "Bianca",
    gradeBand: "K-2",
    readingLevel: "K-2",
    language: "bilingual",
    preferences: {
      theme: "animals",
      modality: { visual: 0.3, audio: 0.3, steps: 0.4 },
      pace: "slow",
    },
    accommodations: { dyslexia: true },
    mastery: { c1: 0.3, c2: 0 },
    difficulty: 0.35,
    scaffolding: "guided",
    themeWeights: { sports: 0.2, animals: 0.6, baking: 0.1, space: 0.1 },
  },
  {
    id: "s3",
    name: "Carlos",
    gradeBand: "K-2",
    readingLevel: "K-2",
    language: "bilingual",
    preferences: {
      theme: "baking",
      modality: { visual: 0.4, audio: 0.4, steps: 0.2 },
      pace: "normal",
    },
    accommodations: {},
    mastery: { c1: 0.2, c2: 0 },
    difficulty: 0.3,
    scaffolding: "step_by_step",
    themeWeights: { sports: 0.1, animals: 0.2, baking: 0.6, space: 0.1 },
  },
];
