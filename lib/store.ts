import { create } from "zustand";
import type { Beat, Feedback, Lesson, StudentProfile } from "./types";
import { demoLesson, demoStudents } from "./seeds";
import { decidePlan, updateFromFeedback } from "./adaptation";
import { safeImagePrompt, safeVideoScript } from "./safety";
import { generateImage, generateVideo } from "./media";

// Teacher store
interface TeacherState {
  lesson: Lesson;
  setLesson: (lesson: Lesson) => void;
  approve: (beatId: string, part: "image" | "video") => void;
}

export const useTeacher = create<TeacherState>((set, get) => ({
  lesson: demoLesson,
  setLesson: (lesson) => set({ lesson }),
  approve: (_beatId, _part) => {
    // TODO: track approvals with timestamps and status badges
    void get;
  },
}));

// Class runtime store
interface ClassState {
  students: StudentProfile[];
  currentBeatIndex: Record<string, number>;
  onFeedback: (studentId: string, feedback: Feedback) => Promise<void>;
}

export const useClass = create<ClassState>((set, get) => ({
  students: demoStudents,
  currentBeatIndex: Object.fromEntries(demoStudents.map((student) => [student.id, 0])),
  onFeedback: async (studentId, feedback) => {
    const teacher = useTeacher.getState();
    const lesson = teacher.lesson;
    const state = get();
    const currentStudent = state.students.find((s) => s.id === studentId);
    if (!currentStudent) return;

    const index = state.currentBeatIndex[studentId];
    const lastBeat = lesson.beats[index];

    const updatedStudent = updateFromFeedback(currentStudent, lastBeat.conceptId, feedback, lastBeat);
    const plan = decidePlan(updatedStudent, lastBeat.conceptId, lastBeat);

    let nextBeat: Beat = {
      ...lastBeat,
      theme: plan.theme,
      task: { ...lastBeat.task, kind: plan.nextTaskKind } as Beat["task"],
    };

    if (plan.imageDelta) {
      try {
        const image = await generateImage(safeImagePrompt(`${lastBeat.title}. ${plan.imageDelta}`));
        nextBeat = { ...nextBeat, image };
      } catch (error) {
        console.error("Failed to generate adapted image", error);
      }
    }

    if (plan.videoScript) {
      try {
        const video = await generateVideo(safeVideoScript(plan.videoScript));
        nextBeat = { ...nextBeat, video };
      } catch (error) {
        console.error("Failed to generate adapted video", error);
      }
    }

    const nextIndex = Math.min(index + 1, lesson.beats.length - 1);

    const updatedStudents = state.students.map((student) =>
      student.id === studentId ? updatedStudent : student
    );
    const updatedIndices = { ...state.currentBeatIndex, [studentId]: nextIndex };
    const updatedBeats = lesson.beats.map((beat, beatIndex) =>
      beatIndex === nextIndex ? nextBeat : beat
    );

    useTeacher.getState().setLesson({ ...lesson, beats: updatedBeats });
    set({ students: updatedStudents, currentBeatIndex: updatedIndices });
  },
}));
