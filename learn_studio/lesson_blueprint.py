"""Lesson blueprint wizard utilities."""
from __future__ import annotations

from dataclasses import dataclass
from typing import Iterable, List, Sequence

from .data_models import ActivityCard, AgentPersona, LessonOutcome, LessonPlan


@dataclass
class BlueprintSuggestion:
    """A single suggestion made during lesson authoring."""

    step: str
    suggestion: str


class LessonBlueprintWizard:
    """Guides a teacher through crafting a lesson plan."""

    def __init__(self, *, default_duration: int = 10) -> None:
        self.default_duration = default_duration

    def suggest_outcomes(self, recent_gaps: Sequence[str]) -> List[LessonOutcome]:
        return [
            LessonOutcome(
                standard_id=f"MATH-{idx+1}",
                description=f"Address skill gap: {gap}",
                mastery_target="Students can demonstrate proficiency on exit ticket",
            )
            for idx, gap in enumerate(recent_gaps)
        ]

    def suggest_storyline(self, timebox_minutes: int) -> List[ActivityCard]:
        phases = [
            ("Launch", "mini-lesson", "Set context with quick story"),
            ("Explore", "investigation", "Students solve progressively harder problems"),
            ("Synthesize", "discussion", "Facilitate share-out and connection making"),
            ("Reflect", "exit-ticket", "Students explain strategy in own words"),
        ]
        duration = max(self.default_duration, timebox_minutes // len(phases))
        return [
            ActivityCard(
                title=phase,
                activity_type=activity_type,
                duration_minutes=duration,
                instructions=summary,
                ai_support_notes=self._ai_support(activity_type),
            )
            for phase, activity_type, summary in phases
        ]

    def configure_agents(self, clusters: Iterable[str]) -> List[AgentPersona]:
        personas: List[AgentPersona] = []
        for cluster in clusters:
            tone = "encouraging" if "struggling" in cluster else "energetic"
            strengths = ["translating visuals", "metacognitive prompts"]
            guardrails = ["never provide final answer outright", "escalate after 3 failed attempts"]
            personas.append(
                AgentPersona(
                    name=f"Guide-{cluster.title()}",
                    tone=tone,
                    strengths=strengths,
                    guardrails=guardrails,
                )
            )
        return personas

    def finalize_plan(
        self, title: str, outcomes: Sequence[LessonOutcome], activities: Sequence[ActivityCard], personas: Sequence[AgentPersona]
    ) -> LessonPlan:
        persona_mapping = {persona.name: persona for persona in personas}
        return LessonPlan(title=title, outcomes=list(outcomes), activities=list(activities), agent_personas=persona_mapping)

    def _ai_support(self, activity_type: str) -> str:
        if activity_type == "mini-lesson":
            return "Agent provides quick analogies tailored to student modality"
        if activity_type == "investigation":
            return "Agent monitors hesitation and offers scaffolded hints"
        if activity_type == "discussion":
            return "Agent nudges quieter students with sentence starters"
        if activity_type == "exit-ticket":
            return "Agent captures reflection and explains mastery judgement"
        return "Agent remains on standby"


__all__ = ["BlueprintSuggestion", "LessonBlueprintWizard"]
