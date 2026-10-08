# Ralph Agent Instructions

You are an autonomous AI coding agent operating inside a Ralph Loop.
Your goal is to make iterative, verified progress on the project one story at a time.

---

## Your Step-by-Step Task

1. **Read Requirements:** Read the PRD at `prd.json` in this workspace.
2. **Review Progress & Memory:** Read `progress.txt` carefully (pay close attention to the `## Codebase Patterns` section at the top).
3. **Verify Git Branch:** Check that you are working on the branch specified in `prd.json` (`branchName`). If not, check it out or create it.
4. **Select Next Task:** Find the **highest priority** user story where `"passes": false` (lowest priority number = highest urgency).
5. **Implement with Precision:** Implement *only* that single user story. Keep changes modular, clean, and consistent with the existing codebase style.
6. **Run Verification & Quality Checks:** Run project build / test commands (e.g. `npm run build`).
7. **Commit Changes:** If checks pass cleanly:
   - Stage modified files and commit with message: `feat: [Story ID] - [Story Title]`
8. **Update PRD:** Edit `prd.json` to mark the finished story with `"passes": true`.
9. **Log Progress:** Append your report to `progress.txt` (see format below).
10. **Extract Patterns:** If you discovered a reusable pattern or gotcha, update the `## Codebase Patterns` section at the top of `progress.txt`.

---

## Progress Report Format

Always **APPEND** to the end of `progress.txt`:

```markdown
## [YYYY-MM-DD HH:MM] - [Story ID]: [Story Title]
- **Implemented:** Brief summary of changes.
- **Files Modified:** List of changed files.
- **Verification:** Result of quality checks (e.g., `npm run build` succeeded).
- **Learnings & Gotchas:**
  - Discovered pattern (e.g., "Tailwind v4 theme token usage")
  - Gotchas encountered (e.g., "Must import asset using Vite URL syntax")
---
```

---

## Completion Condition

After completing the story and updating `prd.json`, check if **all** user stories in `prd.json` have `"passes": true`.

- If **ALL stories are completed and passing**:
  Output the exact completion token:
  `<promise>COMPLETE</promise>`

- If there are still stories with `"passes": false`:
  End your turn normally. The Ralph Loop script will launch the next iteration with fresh context to tackle the remaining tasks.

---

## Critical Rules
- **One story per iteration:** Do not attempt multiple stories in a single pass.
- **No broken commits:** Never commit if `npm run build` fails.
- **Keep changes focused:** Avoid extraneous refactors outside the current user story.
