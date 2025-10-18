"""Core data models for the adaptive lesson studio prototype."""
from __future__ import annotations

from dataclasses import dataclass, field
from datetime import datetime
from enum import Enum
from typing import Dict, List, Optional


class SupportModality(str, Enum):
    """Possible support modalities a student may prefer."""

    VISUAL = "visual"
    AUDITORY = "auditory"
    KINESTHETIC = "kinesthetic"
    TEXTUAL = "textual"


class ChallengeLevel(str, Enum):
    """Difficulty settings that drive task adjustments."""

    REMEDIAL = "remedial"
    CORE = "core"
    EXTENSION = "extension"


@dataclass
class LessonOutcome:
    """Represents a targeted skill or standard for a lesson."""

    standard_id: str
    description: str
    mastery_target: str


@dataclass
class ActivityCard:
    """A building block in the lesson storyboard."""

    title: str
    activity_type: str
    duration_minutes: int
    instructions: str
    ai_support_notes: str


@dataclass
class AgentPersona:
    """Configuration for a student-facing micro agent."""

    name: str
    tone: str
    strengths: List[str]
    guardrails: List[str]


@dataclass
class StudentProfile:
    """Baseline student information used to seed personalization."""

    student_id: str
    name: str
    grade_level: int
    preferred_modality: SupportModality
    current_skill_level: str
    focus_areas: List[str]
    support_notes: str = ""


@dataclass
class StudentInteraction:
    """Captures a single interaction between a student and their agent."""

    student_id: str
    activity_title: str
    timestamp: datetime
    correct: bool
    response_time_seconds: float
    hints_used: int
    self_reported_confidence: int
    preferred_modality: SupportModality


@dataclass
class AdaptationDecision:
    """Outcome of running the adaptation engine."""

    next_challenge_level: ChallengeLevel
    scaffolding_actions: List[str] = field(default_factory=list)
    teacher_alert: Optional[str] = None
    rationale: str = ""


@dataclass
class LessonPlan:
    """Aggregates all information required to deliver a lesson."""

    title: str
    outcomes: List[LessonOutcome]
    activities: List[ActivityCard]
    agent_personas: Dict[str, AgentPersona]

    def activity_titles(self) -> List[str]:
        return [activity.title for activity in self.activities]


@dataclass
class LessonInsight:
    """Summarizes post-lesson insights for teacher reflection."""

    headline: str
    highlights: List[str]
    recommended_actions: List[str]


__all__ = [
    "SupportModality",
    "ChallengeLevel",
    "LessonOutcome",
    "ActivityCard",
    "AgentPersona",
    "StudentProfile",
    "StudentInteraction",
    "AdaptationDecision",
    "LessonPlan",
    "LessonInsight",
]
