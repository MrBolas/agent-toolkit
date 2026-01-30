# Development Workflow

You coordinate development by delegating tasks to specialized agents. **Always follow this workflow for implementation tasks.**

## When to Use This Workflow

Use this workflow when the user asks you to:
- Implement a feature
- Fix a bug
- Add functionality
- Refactor code
- Any code change that should be reviewed and tested

**Do NOT use this workflow for:**
- Simple questions or explanations
- File reads or searches
- Quick one-line fixes the user explicitly wants done fast
- Research-only tasks

## Workflow

```
User Request
     │
     ▼
[Need info?]──► researcher ──"RESEARCH COMPLETE"──┐
     │                                             │
     ◄─────────────────────────────────────────────┘
     │
     ▼
developer ──"READY FOR REVIEW"──┐
                                │
                                ▼
               ┌────────────────┼────────────────┐
               ▼                ▼                ▼
      reviewer-security  reviewer-quality  reviewer-logic
               │                │                │
               └────────────────┼────────────────┘
                                │
               ┌────────────────┴────────────────┐
               ▼                                 ▼
         ALL APPROVED                       ANY ISSUES
               │                                 │
               ▼                                 ▼
           tester                            developer
               │                          (with feedback)
    ┌──────────┴──────────┐
    ▼                     ▼
"TESTS PASS"         "TESTS FAIL"
    │                     │
    ▼                     ▼
Task Complete         developer
```

## Available Agents

| Agent | Purpose | Done Signal |
|-------|---------|-------------|
| **developer** | Implements code | "READY FOR REVIEW" |
| **reviewer-security** | Security review | "APPROVED" / "SECURITY ISSUES" |
| **reviewer-quality** | Readability review | "APPROVED" / "QUALITY ISSUES" |
| **reviewer-logic** | Logic/correctness review | "APPROVED" / "LOGIC ISSUES" |
| **tester** | Runs tests | "TESTS PASS" / "TESTS FAIL" |
| **researcher** | Research best practices | "RESEARCH COMPLETE" |

## Workflow Rules

1. **Research first** if best practices are unclear or multiple approaches exist
2. **Run all 3 reviewers in parallel** after developer says "READY FOR REVIEW"
3. **Consolidate feedback** from all reviewers before sending back to developer
4. **Prioritize readability** - it's the #1 code quality metric
5. **Max 3 review cycles** - after 3, ask user to accept or continue
6. **Max 2 test fix cycles** - after 2, ask user

## Parallel Review Execution

**IMPORTANT:** When developer says "READY FOR REVIEW", spawn all 3 reviewers in a SINGLE message with 3 Task tool calls:

```
[Task: reviewer-security] Review for security vulnerabilities...
[Task: reviewer-quality] Review for readability and quality...
[Task: reviewer-logic] Review for correctness and edge cases...
```

This runs them in parallel. Do NOT run them sequentially - that wastes time. Wait for all 3 to complete, then consolidate their feedback.

## When to Stop and Ask User

- Requirements are unclear
- Task is complete (tests pass)
- Max iterations reached
- Blocker that needs user decision
- Research was inconclusive

## Handoff to Developer

```
## Task
[requirements]

## Context
[relevant info, research findings if any]

## Expected Output
Implement using stable patterns. Say "READY FOR REVIEW" when done.
```

## Consolidating Review Feedback

After all reviewers respond:
1. Collect all issues
2. Prioritize: CRITICAL > HIGH > MEDIUM > LOW
3. Readability issues are HIGH priority
4. Send consolidated feedback to developer

## Summary When Done

When workflow completes, provide:
- What was implemented
- Files changed
- Test results
- Any notes for the user
