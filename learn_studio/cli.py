"""Command line interface to demonstrate the adaptive loop."""
from __future__ import annotations

import argparse
from textwrap import indent

from .data_models import ActivityCard, LessonOutcome, StudentProfile, SupportModality
from .lesson_blueprint import LessonBlueprintWizard
from .student_agent import StudentAgentSimulator


def build_demo_plan() -> None:
    wizard = LessonBlueprintWizard()
    outcomes = wizard.suggest_outcomes(["multi-digit subtraction with regrouping", "interpreting remainders"])
    activities = wizard.suggest_storyline(timebox_minutes=40)
    personas = wizard.configure_agents(["core", "struggling"])
    plan = wizard.finalize_plan("Adaptive Math Lesson", outcomes, activities, personas)

    students = [
        StudentProfile(
            student_id="maya",
            name="Maya",
            grade_level=4,
            preferred_modality=SupportModality.VISUAL,
            current_skill_level="approaching",
            focus_areas=["place value"],
        ),
        StudentProfile(
            student_id="liam",
            name="Liam",
            grade_level=4,
            preferred_modality=SupportModality.KINESTHETIC,
            current_skill_level="on-track",
            focus_areas=["problem decomposition"],
        ),
    ]

    simulator = StudentAgentSimulator(plan, students)

    print("=== Lesson Blueprint ===")
    print(f"Title: {plan.title}")
    print("Outcomes:")
    for outcome in plan.outcomes:
        print(f" - {outcome.description} ({outcome.mastery_target})")
    print("Activities:")
    for activity in plan.activities:
        print(f" - {activity.title} ({activity.activity_type}) -> {activity.ai_support_notes}")

    print("\n=== Simulated Activity Cycle ===")
    activity = plan.activities[1]
    for student in students:
        response = simulator.run_activity_cycle(
            activity.title,
            student,
            correct_probability=0.6 if student.student_id == "maya" else 0.85,
            hints_likelihood=0.7,
        )
        print(f"\nStudent: {student.name}")
        print(f"Prompt: {response.prompt}")
        if response.follow_up_question:
            print(f"Follow-up: {response.follow_up_question}")
        print("Actions:")
        for action in response.decision.scaffolding_actions or ["Continue current path"]:
            print(f" * {action}")
        if response.decision.teacher_alert:
            print(f"Teacher Alert: {response.decision.teacher_alert}")

    insights = simulator.dashboard.generate_insights()
    print("\n=== Post-Lesson Insights ===")
    print(insights.headline)
    print("Highlights:")
    print(indent("\n".join(insights.highlights), prefix=" - "))
    print("Next Actions:")
    print(indent("\n".join(insights.recommended_actions), prefix=" - "))


def main() -> None:
    parser = argparse.ArgumentParser(description="Run the adaptive lesson studio demo")
    parser.parse_args()
    build_demo_plan()


if __name__ == "__main__":
    main()
