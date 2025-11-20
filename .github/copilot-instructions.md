# Copilot / AI Agent Instructions (project-specific)

This file gives concise, actionable guidance for AI coding agents working in this repository.

**Purpose:** Help an AI agent be immediately productive by describing project-specific workflows, file conventions, and examples found in the repo.

## Quick Orientation
- **Prompts & agent roles:** See the `Prompt/` folder. Key files:
  - `Prompt/generate.prompt.md` — generator that MUST create files under `plans/{feature}` and not print generated code to chat.
  - `Prompt/implement.prompt.md` — implementer that MUST only make changes explicitly specified in a plan.
  - `Prompt/plan*.prompt.md` — planning agents that research and produce `plans/{feature}/plan.md`.
- **Primary workspace convention:** Features and PR work are organized under a `plans/{feature-name}/` folder with `plan.md`, `README.md`, and numbered step folders (see `Prompt/plan-refactored.prompt.md`).

## What the agent should do first
- Read `Prompt/` files to learn the repo's agent conventions before making changes.
- If any required project-level information is missing (build commands, test commands, target frameworks), ask the user instead of guessing.

## File & naming conventions (explicit examples)
- Plan location: `plans/{feature-name}/plan.md` (master plan). Example: `plans/system-tray-integration/plan.md`.
- Implementation files created by the generator: `plans/{feature}/1-step-name/1.1-substep/implementation.md`.
- Branching & commits: Agents must NOT create branches or commit automatically (the generator and plan prompts explicitly forbid git operations).

## Behavioral rules discovered in repository prompts
- Never output generated implementation code to chat when `generate.prompt.md` instructs to create files — use the filesystem APIs instead.
- Stop immediately on the `stopping_rules` defined in prompt files (e.g., do not implement outside plan scope).
- Generated implementation must contain no placeholders or TODOs — code blocks must be copy-paste ready and complete.

## Research & external lookups
- The planning prompts instruct agents to use autonomous web research (runSubagent / #fetch) to gather docs. If those tools are unavailable, ask the user for guidance.
- When referencing external docs, prefer official documentation and include exact URLs and version numbers in the plan.

## Tests / build / run — repository-specific note
- There are no discoverable top-level build/test scripts or a `README.md` in the repository root. Before making assumptions about build or test commands, ask the user for:
  - Primary language, framework, and build commands (e.g., `npm install && npm test`, `dotnet build`, `python -m pytest`).
  - CI or target environment details, if relevant.

## Code & style expectations (from prompts)
- Completeness: no TODOs, all imports/dependencies included.
- Error handling: prefer explicit handling and cleanup as required by the target language.
- Naming: follow the conventions used in the project (the plan prompts expect PascalCase for types, kebab-case for branches and folders).

## Integration points / cross-component patterns
- Plans often reference creating or modifying files across multiple layers; follow the folder/step naming structure to keep changes minimal and reviewable.
- Use the `plans/` structure to group related changes so reviewers can inspect a single PR folder.

## When information is missing
- Ask the user succinct questions (build/test commands, target runtime versions, whether to run tests), and pause work until clarified.

## Minimal checklist for agents before writing files
- [ ] Read `Prompt/` files and stopping rules
- [ ] Confirm build & test commands with the user (if not present)
- [ ] Confirm branch/commit policy (do not auto-commit unless asked)
- [ ] For generators: create files under `plans/{feature}` and do not print large code blocks to chat

## If you update this file
- Preserve project-specific examples (the `Prompt/` filenames and `plans/` patterns). If you change guidance, merge rather than overwrite.

---
If any section is unclear or you'd like more specific examples (e.g., target language build commands or a recommended `plan.md` template saved into `plans/`), tell me what to add and I'll update this file.
