from learn_studio.lesson_blueprint import LessonBlueprintWizard


def test_wizard_creates_balanced_storyline():
    wizard = LessonBlueprintWizard(default_duration=12)
    activities = wizard.suggest_storyline(timebox_minutes=48)
    assert len(activities) == 4
    assert all(activity.duration_minutes >= 12 for activity in activities)
    assert any("hints" in activity.ai_support_notes for activity in activities)


def test_configure_agents_creates_named_personas():
    wizard = LessonBlueprintWizard()
    personas = wizard.configure_agents(["core", "struggling"])
    assert {persona.name for persona in personas} == {"Guide-Core", "Guide-Struggling"}
    assert all(persona.guardrails for persona in personas)
