# Status Report Skill

## Purpose

Generate a clear and concise status report for the Forge2 Kanban project.

---

## When to Use

Use this skill:

- after completing a feature
- after fixing a bug
- before deployment
- before creating a final report

---

## Inputs

The skill receives:

- Original task
- Work completed
- Files modified
- Commands executed
- Test results
- Errors encountered
- Next recommended step

---

## Output Format

```markdown
## Status

One sentence summary.

## Completed

- Item 1
- Item 2

## Files Changed

- file/path
- file/path

## Verification

- Test performed
- Result observed

## Blockers

- None

## Next Step

One recommended next action.
```

---

## Rules

1. Report only completed work.
2. Include failures and recovery steps.
3. Never include passwords or API keys.
4. Keep the report concise.
5. Mention files that were modified.