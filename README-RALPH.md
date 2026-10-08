# 🔄 Ralph Loop Setup

This directory is configured with the **Ralph Loop** autonomous AI development workflow.

## What is in this directory?

- [ralph.sh](file:///Users/renoroy/Desktop/luma/ralph.sh): The execution loop script.
- [prd.json](file:///Users/renoroy/Desktop/luma/prd.json): The Product Requirements Document tracking tasks and completion status.
- [prompt.md](file:///Users/renoroy/Desktop/luma/prompt.md): The agent instructions passed on each iteration.
- [progress.txt](file:///Users/renoroy/Desktop/luma/progress.txt): The persistent memory log capturing learnings and patterns across fresh context windows.

---

## Quick Start

### 1. Configure Your Tasks
Edit [prd.json](file:///Users/renoroy/Desktop/luma/prd.json) to define what you want the agent to build:
```json
{
  "project": "LUMA E-Commerce Application",
  "branchName": "ralph/improvements",
  "userStories": [
    {
      "id": "US-001",
      "title": "Your feature title",
      "description": "User story details",
      "acceptanceCriteria": ["Criteria 1", "Criteria 2"],
      "priority": 1,
      "passes": false
    }
  ]
}
```

### 2. Run the Loop

By default, `ralph.sh` auto-detects installed AI CLIs (Claude Code or Aider):

```bash
# Auto-detect tool and run up to 10 iterations:
./ralph.sh

# Specify Claude Code CLI:
./ralph.sh --tool claude --max 15

# Specify Aider:
./ralph.sh --tool aider --max 10
```

### 3. How each iteration works
1. Spawns the AI agent with a **fresh context window**.
2. Reads `prd.json` and `progress.txt`.
3. Checks out the git branch `branchName`.
4. Executes the highest priority task where `"passes": false`.
5. Runs verification (`npm run build`).
6. Commits cleanly to Git (`feat: [US-XXX] ...`).
7. Updates `prd.json` to `"passes": true` and writes learnings to `progress.txt`.
8. Automatically repeats until all tasks pass or max iterations are reached!
