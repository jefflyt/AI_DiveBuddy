# plans/ directory

This folder contains PR plan templates and example plans used by the repository's agent workflows.

Conventions

- Each feature or PR should live under `plans/{feature-name}/` and include a `plan.md` (master plan).
- The `generate` agent expects the `plan.md` to describe numbered steps; its generator writes implementation files into `plans/{feature-name}/1-step-name/` etc.
- Do not commit implementation files created by the generator automatically — the agent and human reviewer should follow the repo's branch/commit policy.

Files in this folder

- `plan_template.md` — canonical plan template to copy when creating new feature plans.
- `example-feature/plan.md` — a small example showing required fields and format.

When creating a new plan

1. Create a directory `plans/{kebab-case-feature-name}/`.
2. Add `plan.md` following `plan_template.md` structure.
3. If the feature is complex, include `README.md` and subfolders `1-step-name/`, `2-step-name/`, ... (these will be filled by the generator).

If you want me to generate a plan for a specific feature, tell me the feature name and the goal and I'll draft `plans/{feature}/plan.md`.
