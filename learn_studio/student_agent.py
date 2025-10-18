"""Student agent simulation leveraging the adaptation engine."""
from __future__ import annotations

from dataclasses import dataclass
from datetime import datetime
from random import random
from typing import Iterable, List, Optional

from .adaptation_engine import AdaptationEngine
from .data_models import AdaptationDecision, LessonPlan, StudentInteraction, StudentProfile, SupportModality
from .teacher_dashboard import TeacherDashboard


@dataclass
class AgentResponse:
    """Represents the agent's response to a student submission."""

    prompt: str
    decision: AdaptationDecision
    follow_up_question: Optional[str]


class StudentAgentSimulator:
    """Coordinates the lesson loop across students."""

    def __init__(self, lesson_plan: LessonPlan, students: Iterable[StudentProfile]) -> None:
        self.lesson_plan = lesson_plan
        self.students = list(students)
        self.adaptation_engine = AdaptationEngine(self.students)
        self.dashboard = TeacherDashboard()

    def run_activity_cycle(
        self,
        activity_title: str,
        student: StudentProfile,
        *,
        correct_probability: float,
        hints_likelihood: float,
    ) -> AgentResponse:
        interaction = self._simulate_interaction(
            activity_title,
            student,
            correct_probability=correct_probability,
            hints_likelihood=hints_likelihood,
        )
        decision = self.adaptation_engine.process_interaction(interaction)
        self.dashboard.ingest_interaction(interaction)
        follow_up_question = self._follow_up(decision, student)
        prompt = self._prompt(decision, student, activity_title)
        return AgentResponse(prompt=prompt, decision=decision, follow_up_question=follow_up_question)

    def _simulate_interaction(
        self,
        activity_title: str,
        student: StudentProfile,
        *,
        correct_probability: float,
        hints_likelihood: float,
    ) -> StudentInteraction:
        correct = random() < correct_probability
        hints_used = 0
        if not correct:
            hints_used = 2 if random() < hints_likelihood else 1
        confidence = 4 if correct else 2
        modality = student.preferred_modality
        return StudentInteraction(
            student_id=student.student_id,
            activity_title=activity_title,
            timestamp=datetime.utcnow(),
            correct=correct,
            response_time_seconds=12 if correct else 25,
            hints_used=hints_used,
            self_reported_confidence=confidence,
            preferred_modality=modality,
        )

    def _follow_up(self, decision: AdaptationDecision, student: StudentProfile) -> Optional[str]:
        if decision.next_challenge_level.name == "EXTENSION":
            return "Can you explain how this pattern might extend to larger numbers?"
        if decision.next_challenge_level.name == "REMEDIAL":
            return "Let's tackle a similar example together—what should we try first?"
        if decision.scaffolding_actions:
            return "Which of these supports feels most helpful right now?"
        return None

    def _prompt(self, decision: AdaptationDecision, student: StudentProfile, activity_title: str) -> str:
        modality_note = f"using {student.preferred_modality.value} supports"
        return (
            f"Great effort on {activity_title}! We'll move to a {decision.next_challenge_level.value} challenge "
            f"{modality_note}. {decision.rationale}"
        )


__all__ = ["StudentAgentSimulator", "AgentResponse"]
