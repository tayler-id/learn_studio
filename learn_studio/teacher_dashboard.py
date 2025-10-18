"""Teacher dashboard utilities for monitoring and reflection."""
from __future__ import annotations

from collections import defaultdict
from typing import Dict, Iterable, List

from .data_models import LessonInsight, StudentInteraction


class TeacherDashboard:
    """Aggregates signals to provide actionable insights."""

    def __init__(self) -> None:
        self._interaction_log: Dict[str, List[StudentInteraction]] = defaultdict(list)

    def ingest_interaction(self, interaction: StudentInteraction) -> None:
        self._interaction_log[interaction.student_id].append(interaction)

    def class_heatmap(self) -> Dict[str, float]:
        """Returns average confidence by student for quick pulse."""

        heatmap: Dict[str, float] = {}
        for student_id, interactions in self._interaction_log.items():
            if interactions:
                avg_confidence = sum(inter.self_reported_confidence for inter in interactions) / (
                    5 * len(interactions)
                )
                heatmap[student_id] = round(avg_confidence, 2)
        return heatmap

    def generate_insights(self) -> LessonInsight:
        """Produces a simple post-lesson summary."""

        highlights: List[str] = []
        recommended_actions: List[str] = []
        for student_id, interactions in self._interaction_log.items():
            struggles = [inter for inter in interactions if not inter.correct]
            if not struggles:
                highlights.append(f"{student_id} showed strong mastery with consistent success.")
                continue
            if len(struggles) >= 3:
                recommended_actions.append(f"Schedule reteach moment with {student_id}.")
            if any(inter.self_reported_confidence <= 2 for inter in struggles):
                recommended_actions.append(f"Check-in on confidence boosters for {student_id}.")
        if not highlights:
            highlights.append("Class engaged deeply with productive struggle.")
        if not recommended_actions:
            recommended_actions.append("Celebrate wins and plan extension challenges.")
        return LessonInsight(
            headline="Lesson Reflection Summary",
            highlights=highlights,
            recommended_actions=recommended_actions,
        )


__all__ = ["TeacherDashboard"]
