# Example: Using Agents in Claude Code

This is a practical example of how to use your ported agents in Claude Code.

## The Scenario

You want to implement a new feature: "Add user authentication with JWT tokens"

## Step-by-Step Workflow

### Step 1: Start as Orchestrator

When you start Claude Code in this directory, it auto-loads `CLAUDE.md` which sets you as the Orchestrator.

**You type:**
```
I need to implement user authentication with JWT tokens. Please coordinate this implementation using our agent system.
```

**Claude (as Orchestrator) responds:**
```
I'll coordinate this implementation using our multi-agent workflow.

Let me break this down into phases:
1. Development - Implement the authentication service
2. Review - Code review for quality and security  
3. Testing - Verify the implementation works

Let me start with Phase 1.
```

### Step 2: Load Developer Agent

**Claude (as Orchestrator) says:**
```
## Phase 1: Development

Now loading Developer Agent...

---

You are a Developer Agent specialized in implementing features and editing code...
[pastes content from ~/.claude/agents/developer.md]

---

**Task**: Implement JWT-based user authentication with:
- User login endpoint (POST /auth/login)
- JWT token generation
- Password hashing with bcrypt
- Token validation middleware
- Protected route example

**Context**: This is a Node.js/Express application using TypeScript.

Search the codebase for existing patterns before implementing.
```

**Developer Agent works:**
- Searches codebase for patterns
- Implements the authentication service
- Creates the login endpoint
- Adds middleware
- Reports: "READY FOR REVIEW"

### Step 3: Load Reviewer Agent

**Claude (as Orchestrator) says:**
```
## Phase 2: Code Review

Implementation complete. Now loading Reviewer Agent...

---

You are a Code Reviewer Agent specialized in reviewing code for quality, security, and correctness...
[pastes content from ~/.claude/agents/reviewer.md]

---

**Review Request**: Review the JWT authentication implementation

**Files Changed**:
- src/auth/controller.ts
- src/auth/service.ts
- src/middleware/auth.ts
- src/routes/auth.ts

**Changes Made**:
- Implemented login endpoint with JWT generation
- Added bcrypt password hashing
- Created auth middleware for protected routes

Please review for:
1. Security vulnerabilities
2. Code readability
3. Logic correctness
4. Error handling
```

**Reviewer Agent works:**
- Reviews each file
- Classifies issues by severity
- Reports findings

### Step 4: Address Review Feedback

**Claude (as Orchestrator) says:**
```
## Review Results

### Security Issues (HIGH)
- [ ] JWT secret is hardcoded - should use environment variable
- [ ] No rate limiting on login endpoint

### Readability Issues (MEDIUM)
- [ ] Auth middleware could use clearer variable names

### Overall Assessment: NEEDS CHANGES

Let me fix these issues...
```

**Claude (as Developer) fixes the issues**

### Step 5: Load Tester Agent

**Claude (as Orchestrator) says:**
```
## Phase 3: Testing

Issues fixed. Now loading Tester Agent...

---

You are a Tester Agent specialized in running tests and analyzing results...
[pastes content from ~/.claude/agents/tester.md]

---

**Test Request**: Run tests for the authentication implementation

**What was implemented**:
- JWT login endpoint
- Password hashing
- Auth middleware
- Protected routes

**Files Changed**:
- src/auth/controller.ts
- src/auth/service.ts
- src/middleware/auth.ts

Run the test suite and report results.
```

**Tester Agent works:**
- Runs `npm test`
- Analyzes results
- Reports: "TESTS PASS" or suggests fixes

### Step 6: Final Summary

**Claude (as Orchestrator) says:**
```
## Implementation Complete ✅

**Summary**:
- ✅ Authentication service implemented
- ✅ Code reviewed and issues fixed
- ✅ All tests passing

**Files Created/Modified**:
- src/auth/controller.ts (new)
- src/auth/service.ts (new)
- src/middleware/auth.ts (new)
- src/routes/auth.ts (new)
- .env.example (updated with JWT_SECRET)

**Next Steps**:
1. Add the JWT_SECRET to your .env file
2. Test the login endpoint manually
3. Consider adding refresh token functionality
```

## Key Points

1. **You don't "see" agents** - You tell Claude to act as an agent
2. **Context switching** - Use `/compact` when switching between agents
3. **Manual coordination** - You (as orchestrator) decide when to switch agents
4. **Copy-paste or reference** - Either paste agent content or say "Act as [Agent]"

## Shortcuts

### Quick Agent Switch
```
/compact

Now act as Reviewer Agent and review src/auth/
```

### Parallel Agents (Advanced)
```
/spawn 3

Agent 1: Review for security issues
Agent 2: Review for readability
Agent 3: Review for logic errors
```

### Agent Reference Without Pasting
```
Using Developer Agent patterns from ~/.claude/agents/developer.md, implement the feature
```

## Troubleshooting

**"The agent isn't working differently"**
- Make sure you cleared context with `/compact`
- Verify the agent content was actually pasted/loaded

**"How do I know which agent is active?"**
- Claude doesn't show this - you track it manually
- Or ask: "Confirm you're acting as Developer Agent"

**"Can I create custom agents?"**
- Yes! Just create new .md files in `~/.claude/agents/`
- Follow the same format as existing agents
