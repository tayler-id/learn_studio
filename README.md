# Learn Studio Concept

This repository outlines an adaptive lesson studio prototype that combines teacher-facing planning tools with student-facing AI agents. You can read the full product vision in [docs/personalized_lesson_flow.md](docs/personalized_lesson_flow.md) and explore a working Python simulation that demonstrates the adaptive loop.

## Getting Started

1. Create a virtual environment and install the local package in editable mode:

   ```bash
   python -m venv .venv
   source .venv/bin/activate
   pip install -e .
   ```

2. Run the demonstration CLI to generate a sample lesson plan, simulate a learning cycle, and view teacher insights:

   ```bash
   python -m learn_studio.cli
   ```

3. Execute the test suite to verify the adaptation logic:

   ```bash
   pytest
   ```

The code is intentionally lightweight and self-contained so it can be extended into a fuller experience or integrated with real classroom data sources.
