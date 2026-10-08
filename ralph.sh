#!/usr/bin/env bash
# ==============================================================================
# Ralph Loop - Autonomous AI Agent Runner
# Pattern popularized by Geoffrey Huntley & Ryan Carson (snarktank/ralph)
# ==============================================================================
set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PRD_FILE="$SCRIPT_DIR/prd.json"
PROGRESS_FILE="$SCRIPT_DIR/progress.txt"
ARCHIVE_DIR="$SCRIPT_DIR/archive"
LAST_BRANCH_FILE="$SCRIPT_DIR/.last-branch"
PROMPT_FILE="$SCRIPT_DIR/prompt.md"

# Default configuration
TOOL="auto"
MAX_ITERATIONS=10

# Parse arguments
while [[ $# -gt 0 ]]; do
  case $1 in
    --tool)
      TOOL="$2"
      shift 2
      ;;
    --tool=*)
      TOOL="${1#*=}"
      shift
      ;;
    --max)
      MAX_ITERATIONS="$2"
      shift 2
      ;;
    --max=*)
      MAX_ITERATIONS="${1#*=}"
      shift
      ;;
    -h|--help)
      echo "Ralph Loop - Autonomous AI Agent Runner"
      echo ""
      echo "Usage: ./ralph.sh [options] [max_iterations]"
      echo ""
      echo "Options:"
      echo "  --tool <claude|aider|amp>   Specify AI agent CLI (default: auto-detect)"
      echo "  --max <number>              Maximum iterations (default: 10)"
      echo "  -h, --help                  Show this help message"
      exit 0
      ;;
    *)
      if [[ "$1" =~ ^[0-9]+$ ]]; then
        MAX_ITERATIONS="$1"
      else
        echo "Unknown option: $1"
        exit 1
      fi
      shift
      ;;
  esac
done

# Auto-detect tool if not explicitly specified
if [[ "$TOOL" == "auto" ]]; then
  if command -v claude >/dev/null 2>&1; then
    TOOL="claude"
  elif command -v aider >/dev/null 2>&1; then
    TOOL="aider"
  elif [ -x "/Library/Frameworks/Python.framework/Versions/3.12/bin/aider" ]; then
    TOOL="aider"
  elif command -v amp >/dev/null 2>&1; then
    TOOL="amp"
  else
    echo "❌ Error: No AI agent CLI detected (claude, aider, or amp)."
    echo "   Please install Claude Code (npm i -g @anthropic-ai/claude-code) or Aider,"
    echo "   or specify your tool with --tool."
    exit 1
  fi
fi

# Locate binary for aider if in python framework
AIDER_BIN="$(command -v aider 2>/dev/null || echo "/Library/Frameworks/Python.framework/Versions/3.12/bin/aider")"

# Validate requirements
if [ ! -f "$PRD_FILE" ]; then
  echo "❌ Error: prd.json not found at $PRD_FILE"
  exit 1
fi

if [ ! -f "$PROMPT_FILE" ]; then
  echo "❌ Error: prompt.md not found at $PROMPT_FILE"
  exit 1
fi

# Ensure jq is installed
if ! command -v jq >/dev/null 2>&1; then
  echo "❌ Error: 'jq' is required for Ralph Loop. Please install jq (e.g. brew install jq)."
  exit 1
fi

# Initialize git if needed
if ! git rev-parse --is-inside-work-tree >/dev/null 2>&1; then
  echo "⚡ Initializing git repository..."
  git init
fi

# Archive previous run if branch changed
if [ -f "$PRD_FILE" ] && [ -f "$LAST_BRANCH_FILE" ]; then
  CURRENT_BRANCH=$(jq -r '.branchName // empty' "$PRD_FILE" 2>/dev/null || echo "")
  LAST_BRANCH=$(cat "$LAST_BRANCH_FILE" 2>/dev/null || echo "")
  
  if [ -n "$CURRENT_BRANCH" ] && [ -n "$LAST_BRANCH" ] && [ "$CURRENT_BRANCH" != "$LAST_BRANCH" ]; then
    DATE=$(date +%Y-%m-%d)
    FOLDER_NAME=$(echo "$LAST_BRANCH" | sed 's|^ralph/||')
    ARCHIVE_FOLDER="$ARCHIVE_DIR/$DATE-$FOLDER_NAME"
    
    echo "📦 Archiving previous run: $LAST_BRANCH"
    mkdir -p "$ARCHIVE_FOLDER"
    [ -f "$PRD_FILE" ] && cp "$PRD_FILE" "$ARCHIVE_FOLDER/"
    [ -f "$PROGRESS_FILE" ] && cp "$PROGRESS_FILE" "$ARCHIVE_FOLDER/"
    echo "   Archived to: $ARCHIVE_FOLDER"
    
    echo "# Ralph Progress Log" > "$PROGRESS_FILE"
    echo "Started: $(date)" >> "$PROGRESS_FILE"
    echo "---" >> "$PROGRESS_FILE"
  fi
fi

# Track current branch
CURRENT_BRANCH=$(jq -r '.branchName // empty' "$PRD_FILE" 2>/dev/null || echo "")
if [ -n "$CURRENT_BRANCH" ]; then
  echo "$CURRENT_BRANCH" > "$LAST_BRANCH_FILE"
  # Switch to branch if not already on it
  if git show-ref --verify --quiet "refs/heads/$CURRENT_BRANCH"; then
    git checkout "$CURRENT_BRANCH" >/dev/null 2>&1 || true
  else
    git checkout -b "$CURRENT_BRANCH" >/dev/null 2>&1 || true
  fi
fi

# Initialize progress file if missing
if [ ! -f "$PROGRESS_FILE" ]; then
  echo "# Ralph Progress Log" > "$PROGRESS_FILE"
  echo "Started: $(date)" >> "$PROGRESS_FILE"
  echo "---" >> "$PROGRESS_FILE"
fi

echo "==============================================================="
echo "  🚀 Starting Ralph Loop"
echo "  Tool: $TOOL"
echo "  Branch: ${CURRENT_BRANCH:-default}"
echo "  Max iterations: $MAX_ITERATIONS"
echo "==============================================================="

for i in $(seq 1 "$MAX_ITERATIONS"); do
  echo ""
  echo "---------------------------------------------------------------"
  echo "  ▶ Ralph Iteration $i of $MAX_ITERATIONS ($TOOL)"
  echo "---------------------------------------------------------------"

  OUTPUT=""

  case "$TOOL" in
    claude)
      OUTPUT=$(claude --dangerously-skip-permissions --print < "$PROMPT_FILE" 2>&1 | tee /dev/stderr) || true
      ;;
    aider)
      OUTPUT=$("$AIDER_BIN" --message-file "$PROMPT_FILE" --yes-always 2>&1 | tee /dev/stderr) || true
      ;;
    amp)
      OUTPUT=$(cat "$PROMPT_FILE" | amp --dangerously-allow-all 2>&1 | tee /dev/stderr) || true
      ;;
    *)
      echo "Unknown tool: $TOOL"
      exit 1
      ;;
  esac

  # Check if all tasks are done or completion token is found
  if echo "$OUTPUT" | grep -q "<promise>COMPLETE</promise>"; then
    echo ""
    echo "🎉 Ralph successfully completed all tasks in prd.json!"
    echo "Completed at iteration $i of $MAX_ITERATIONS"
    exit 0
  fi

  # Also check prd.json directly with jq: if no tasks have passes == false
  REMAINING=$(jq '[.userStories[] | select(.passes == false)] | length' "$PRD_FILE" 2>/dev/null || echo "1")
  if [[ "$REMAINING" -eq 0 ]]; then
    echo ""
    echo "🎉 All stories in prd.json marked as passed!"
    echo "Completed at iteration $i of $MAX_ITERATIONS"
    exit 0
  fi

  echo "Iteration $i finished. Remaining tasks: $REMAINING. Continuing loop in 3s..."
  sleep 3
done

echo ""
echo "⚠️ Ralph reached max iterations ($MAX_ITERATIONS) without completing all tasks."
echo "Check $PROGRESS_FILE and $PRD_FILE for status."
exit 1
