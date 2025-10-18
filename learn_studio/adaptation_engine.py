"""Adaptation engine that reacts to student interactions."""
from __future__ import annotations

from dataclasses import dataclass, field
from statistics import mean
from typing import Dict, Iterable, List

from .data_models import (
    AdaptationDecision,
    ChallengeLevel,
    StudentInteraction,
    StudentProfile,
    SupportModality,
)


@dataclass
class StudentState:
    """Tracks rolling metrics for a learner."""

    recent_accuracy: List[bool] = field(default_factory=list)
    recent_confidence: List[int] = field(default_factory=list)
    preferred_modality: SupportModality = SupportModality.VISUAL
    struggling_hints: int = 0

    def record(self, interaction: StudentInteraction) -> None:
        self.recent_accuracy.append(interaction.correct)
        self.recent_confidence.append(interaction.self_reported_confidence)
        self.preferred_modality = interaction.preferred_modality
        if not interaction.correct and interaction.hints_used >= 2:
            self.struggling_hints += 1
        # Keep only last five entries to avoid runaway growth.
        self.recent_accuracy = self.recent_accuracy[-5:]
        self.recent_confidence = self.recent_confidence[-5:]

    @property
    def accuracy_rate(self) -> float:
        return mean(self.recent_accuracy) if self.recent_accuracy else 1.0

    @property
    def confidence_rate(self) -> float:
        return mean(self.recent_confidence) / 5 if self.recent_confidence else 1.0


class AdaptationEngine:
    """Simple rule-based engine that recommends next steps."""

    def __init__(self, students: Iterable[StudentProfile]):
        self._student_state: Dict[str, StudentState] = {
            profile.student_id: StudentState(preferred_modality=profile.preferred_modality)
            for profile in students
        }

    def process_interaction(self, interaction: StudentInteraction) -> AdaptationDecision:
        state = self._student_state.setdefault(
            interaction.student_id, StudentState(preferred_modality=interaction.preferred_modality)
        )
        state.record(interaction)

        decision = AdaptationDecision(next_challenge_level=self._infer_challenge_level(state))
        decision.scaffolding_actions = self._scaffolding_actions(state)
        decision.teacher_alert = self._teacher_alert(state)
        decision.rationale = self._rationale(state, interaction.activity_title)
        return decision

    def _infer_challenge_level(self, state: StudentState) -> ChallengeLevel:
        accuracy = state.accuracy_rate
        if accuracy > 0.85 and state.confidence_rate >= 0.8:
            return ChallengeLevel.EXTENSION
        if accuracy < 0.55 or state.confidence_rate < 0.5:
            return ChallengeLevel.REMEDIAL
        return ChallengeLevel.CORE

    def _scaffolding_actions(self, state: StudentState) -> List[str]:
        actions: List[str] = []
        if state.accuracy_rate < 0.6:
            actions.append("Break problem into smaller steps")
        if state.struggling_hints >= 2:
            actions.append("Provide worked example using {} supports".format(state.preferred_modality.value))
        if state.confidence_rate < 0.5:
            actions.append("Celebrate small wins and restate goal")
        return actions

    def _teacher_alert(self, state: StudentState) -> str | None:
        if state.struggling_hints >= 3 or (state.accuracy_rate < 0.4 and state.confidence_rate < 0.5):
            return "Student needs live check-in"
        return None

    def _rationale(self, state: StudentState, activity_title: str) -> str:
        return (
            f"Based on recent accuracy {state.accuracy_rate:.0%} and confidence {state.confidence_rate:.0%}, "
            f"next task for '{activity_title}' should be {state.preferred_modality.value}-forward with {state.struggling_hints} hint struggles logged."
        )

    def snapshot(self) -> Dict[str, StudentState]:
        """Returns internal state for analytics."""

        return self._student_state


__all__ = ["AdaptationEngine", "StudentState"]
