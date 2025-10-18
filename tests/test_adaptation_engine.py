from datetime import datetime

from learn_studio.adaptation_engine import AdaptationEngine
from learn_studio.data_models import (
    ChallengeLevel,
    StudentInteraction,
    StudentProfile,
    SupportModality,
)


def build_profile(student_id: str) -> StudentProfile:
    return StudentProfile(
        student_id=student_id,
        name=student_id.title(),
        grade_level=4,
        preferred_modality=SupportModality.VISUAL,
        current_skill_level="approaching",
        focus_areas=["fractions"],
    )


def build_interaction(student_id: str, *, correct: bool, confidence: int, hints: int = 0) -> StudentInteraction:
    return StudentInteraction(
        student_id=student_id,
        activity_title="Explore",
        timestamp=datetime.utcnow(),
        correct=correct,
        response_time_seconds=10,
        hints_used=hints,
        self_reported_confidence=confidence,
        preferred_modality=SupportModality.VISUAL,
    )


def test_engine_promotes_extension_for_success():
    engine = AdaptationEngine([build_profile("maya")])
    for _ in range(4):
        engine.process_interaction(build_interaction("maya", correct=True, confidence=5))
    decision = engine.process_interaction(build_interaction("maya", correct=True, confidence=5))
    assert decision.next_challenge_level == ChallengeLevel.EXTENSION
    assert not decision.teacher_alert


def test_engine_recommends_remedial_when_confidence_low():
    engine = AdaptationEngine([build_profile("liam")])
    for _ in range(3):
        engine.process_interaction(build_interaction("liam", correct=False, confidence=2, hints=2))
    decision = engine.process_interaction(build_interaction("liam", correct=False, confidence=1, hints=2))
    assert decision.next_challenge_level == ChallengeLevel.REMEDIAL
    assert "Student needs" in (decision.teacher_alert or "")
    assert any("Break" in action for action in decision.scaffolding_actions)
