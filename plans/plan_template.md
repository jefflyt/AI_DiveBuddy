# Plan Template

Use this template when creating `plans/{feature-name}/plan.md`.

```markdown
# PR 1.0: {Feature Name}

**Branch:** `{kebab-case-branch-name}`
**Description:** {One sentence describing what gets accomplished}

## Goal
{1-2 sentences describing the feature and why it matters}

## Why This Approach
{Why this implementation strategy; 1-2 sentences}

## Implementation Steps

### Step 1: {Step Name}
**Folder:** `1-{step-name}/`
**Files:** {List affected files}
**What:** {1-2 sentences describing the change}
**Testing:** {How to verify this step works}

### Step 2: {Step Name}
**Folder:** `2-{step-name}/`
**Files:** {affected files}
**What:** {description}
**Testing:** {verification method}

## Success Criteria
- {Criterion 1: Specific, testable}
- {Criterion 2}

## Build & Test
- Build command: `{ADD BUILD COMMAND HERE}`
- Test command: `{ADD TEST COMMAND HERE}`

## Known Constraints & Considerations
- {Constraint 1}
- {Constraint 2}

---

Fill the placeholders above and save as `plans/{feature-name}/plan.md`.
```
