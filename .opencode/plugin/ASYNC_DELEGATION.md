# Async Delegation Plugin

**Status:** Phase 2.1 (Context Injection + Status Check) - Complete ✅
**Version:** 1.1.1
**Author:** Agent Toolkit

## Overview

The Async Delegation Plugin enables **fire-and-forget parallel execution** of tasks across multiple agents. You can delegate tasks to run in the background and receive notifications when they complete.

### Key Features

- **Fire-and-forget delegation** - Tasks run in background, you can continue working immediately
- **Automatic notifications** - Get notified (visual + sound + voice) when tasks complete
- **Context injection** - Results automatically flow back to orchestrator without asking
- **Status checking** - View all active background tasks and their duration
- **Session tracking** - Monitor all background tasks from a central place
- **Cross-platform support** - Works on macOS and Linux

### Current Phase (Phase 2.1)

**Implemented:**
- ✅ `async_delegate` tool - Delegate tasks to agents in background
- ✅ `async_status` tool - Check status of all active background tasks
- ✅ Session tracking with Map
- ✅ Completion notifications (visual, sound, voice)
- ✅ SDK integration for background session management
- ✅ File logging for debugging
- ✅ **Result extraction** - Parse session messages for summary and files modified
- ✅ **Context injection** - Automatically inject results into orchestrator session
- ✅ **Error handling** - Errors flow back to orchestrator for decision-making

**Coming Soon (Phases 3-4):**
- 🔲 `async_cancel` tool - Cancel running background tasks
- 🔲 `async_cleanup` tool - Clean up orphaned sessions
- 🔲 Timeout handling - Auto-cancel long-running sessions
- 🔲 Dynamic resource limits - Adjusts based on CPU/memory
- 🔲 Orchestrator integration - Auto-detection of independent tasks

---

## Tools

### `async_delegate`

Delegates a task to an agent in the background. The task runs independently and you'll be notified when it completes.

#### Arguments

| Parameter | Type | Required | Description |
|-----------|------|-----------|-------------|
| `agent` | string | Yes | Agent name (e.g., `@developer`, `@tester`, `@code_reviewer`) |
| `task` | string | Yes | Task description - be specific about what needs to be done |
| `context` | string | No | Additional context or setup information for the agent |

#### Returns

```typescript
{
  success: boolean
  sessionId: string
  message: string
}
```

#### Examples

**Basic delegation:**
```
@async_delegate agent="@developer" task="Create a new user authentication system with JWT"
```

**With additional context:**
```
@async_delegate
  agent="@tester"
  task="Run the complete test suite"
  context="We just added authentication, so make sure to test login and logout flows"
```

**Parallel execution:**
```
# Delegate 3 independent tasks
@async_delegate agent="@developer" task="Create user model"
@async_delegate agent="@developer" task="Create auth service"
@async_delegate agent="@developer" task="Create settings page"

# All 3 run in parallel, you'll get 3 notifications when each completes
```

#### Behavior

1. Creates a new background session via OpenCode SDK
2. Sends the task prompt to the session
3. Returns immediately with session ID
4. Session continues running independently
5. When session completes (idle event):
    - Visual notification appears
    - Sound plays (Glass on macOS)
    - Voice announcement: "Developer finished..."
    - Session is removed from tracking
6. Status can be checked with `@async_status`

---

### `async_status`

Check status of all active background tasks.

#### Arguments

| Parameter | Type | Required | Description |
|-----------|------|-----------|-------------|
| None | - | - |

#### Returns

**String:** Formatted message showing all active background tasks

Format:
- If no active tasks: "No active background tasks"
- If active tasks:
  ```
  Found 3 active background tasks:
  - **@developer** (245s): Create user model
  - **@developer** (98s): Create auth service
  - **@tester** (76s): Run test suite
  ```

#### Examples

**Check all active tasks:**
```bash
@async_status

# Returns:
{
  count: 3,
  sessions: [
    {
      sessionId: "ses_abc123",
      agent: "@developer",
      task: "Create user model",
      duration: "245s",
      status: "running"
    },
    {
      sessionId: "ses_def456",
      agent: "@tester",
      task: "Run test suite",
      duration: "98s",
      status: "running"
    },
    {
      sessionId: "ses_ghi789",
      agent: "@developer",
      task: "Create auth service",
      duration: "76s",
      status: "running"
    }
  ],
  message: "Found 3 active background tasks"
}
```

#### Behavior

1. Lists all sessions in activeSessions Map
2. Calculates duration for each session
3. Returns detailed information for each session
4. Shows count and message summary


---

## How It Works

### Architecture

```
Orchestrator Session
  ↓
async_delegate tool called
  ↓
Plugin creates background session
  ↓
SDK sends prompt to session
  ↓
Returns immediately with session ID
  ↓
Orchestrator continues working
  ↓
Background session completes
  ↓
Plugin receives session.idle event
  ↓
Fetch session messages from SDK
  ↓
Extract summary (files changed, errors, findings)
  ↓
Inject context into orchestrator (noReply)
  ↓
Send notification (visual + sound + voice)
  ↓
Clean up tracking
```

### Session Tracking

The plugin tracks active sessions in-memory using a Map:

```typescript
Map<sessionId, BackgroundSession>
where BackgroundSession = {
  id: string
  agent: string
  task: string
  startTime: number
  parentSessionId: string
}
```

**Tracking Lifecycle:**
1. Session created → Added to Map
2. Session running → Tracked in Map
3. Session idle → Fetch messages, extract summary, inject context, notification, removed from Map

### Context Injection (New in Phase 2)

When a background session completes, the plugin:

1. **Fetches messages** via SDK `session.messages()`
2. **Extracts summary** from last assistant message:
   - Files modified/changed/added
   - Errors encountered
   - Key findings
3. **Injects into orchestrator** via `session.prompt({ noReply: true })`
4. **Formats as markdown** for easy reading

**Example injection (success):**
```markdown
## Background Task Completed

**Agent:** @developer
**Task:** Create user authentication system with JWT
**Duration:** 245s
**Status:** ✅ Success

**Files Modified (3):**
- src/auth/index.ts (added login function)
- src/auth/types.ts (added Auth interface)
- src/middleware/auth.ts (added JWT middleware)

**Summary:**
Implemented JWT-based authentication with token refresh. Added login endpoint that validates credentials and returns JWT tokens. Ready for testing.
```

**Example injection (error):**
```markdown
## Background Task Failed

**Agent:** @tester
**Task:** Run complete test suite
**Duration:** 30s
**Status:** ❌ Error

**Error:**
```
AssertionError: Expected 200 but got 500 in src/api/user.test.ts:45
```

**Action Required:** Review error and decide to retry, fix, or abandon.
```

### Notifications

Notifications are sent when a background session completes:

**macOS:**
- Visual: `osascript` with Glass sound
- Voice: `say` command

**Linux:**
- Visual: `notify-send`
- Voice: `espeak` (install with `sudo apt-get install espeak`)

**Notification Format:**
```
Title: "Developer finished"
Message: "Create user authentication system with JWT" (truncated to 100 chars)
Voice: "Developer finished Create user authentication system" (truncated to 50 chars)
```

---

## Logging

All plugin activity is logged to:
```
.opencode/plugin/logs/async-delegation.log
```

### Log Format

```bash
[2025-12-28T10:30:45.123Z] 🚀 Async Delegation Plugin initialized
[2025-12-28T10:30:50.456Z] 📥 async_delegate called: agent=@developer, task=Create user model...
[2025-12-28T10:30:51.789Z] ✅ Background session created: ses_abc123
[2025-12-28T10:30:52.345Z] 📤 Prompt sent to background session: ses_abc123
[2025-12-28T10:30:52.346Z] 📍 Session tracked: 1 active sessions
[2025-12-28T10:35:30.789Z] ✅ Background session completed: ses_abc123
[2025-12-28T10:35:30.790Z] ⏱️  Duration: 278s
[2025-12-28T10:35:31.123Z] 📢 Notification sent: Developer finished - Create user model
[2025-12-28T10:35:31.456Z] 🧹 Session removed from tracking: 0 remaining
```

### View Logs

```bash
# View latest log
cat .opencode/plugin/logs/async-delegation.log

# Tail live logs
tail -f .opencode/plugin/logs/async-delegation.log

# Search for specific session
grep "ses_abc123" .opencode/plugin/logs/async-delegation.log
```

---

## Use Cases

### 1. Parallel Feature Implementation

Delegating independent features to speed up development:

```
User: "Implement user auth, settings, and profile features in parallel"

→ Orchestrator:
  - Detects 3 independent tasks
  - Delegates all 3 via async_delegate
  - All run in background
  - Gets notifications as each completes
```

### 2. Background Testing

Run tests while continuing development:

```
@async_delegate agent="@tester" task="Run complete test suite"

→ You can continue working while tests run
→ Get notification when tests pass/fail
```

### 3. Code Review in Background

Review code while you keep working:

```
@async_delegate agent="@code_reviewer" task="Review the authentication implementation"

→ Code review happens in background
→ Get notification when review is complete
```

### 4. Independent Refactoring

Refactor multiple modules simultaneously:

```
@async_delegate agent="@developer" task="Refactor user service"
@async_delegate agent="@developer" task="Refactor auth service"
@async_delegate agent="@developer" task="Refactor notification service"

→ All 3 refactorings run in parallel
→ Each completes independently with notification
```

---

## Configuration

### Installation

The plugin is registered in:
- `.opencode/opencode.macos.jsonc` (macOS)
- `.opencode/opencode.linux.jsonc` (Linux)

### Dependencies

Required packages (installed in `.opencode/plugin/package.json`):
```json
{
  "dependencies": {
    "@opencode-ai/plugin": "latest",
    "@opencode-ai/sdk": "latest"
  }
}
```

### Environment Variables

None required.

### Settings

**Hardcoded in Phase 1:**
- SDK base URL: `http://localhost:4096`
- Log directory: `.opencode/plugin/logs/`
- Timeout: None (Phase 1)

**Future (Phase 3):**
- Configurable session timeout
- Configurable max parallel sessions
- Resource monitoring settings

---

## Troubleshooting

### Issue: Notifications not appearing

**Symptoms:**
- Tasks complete but no notification
- No sound plays

**Solutions:**

1. **Check logs:**
   ```bash
   cat .opencode/plugin/logs/async-delegation.log
   ```

2. **Verify notification command works:**
   ```bash
   # macOS
   osascript -e 'display notification "Test" with title "Test" sound name "Glass"'
   say "Test voice"

   # Linux
   notify-send "Test" "Notification"
   espeak "Test voice"
   ```

3. **Install espeak on Linux:**
   ```bash
   sudo apt-get install espeak
   ```

4. **Check permissions:**
   - macOS: Grant notification permissions to Terminal
   - Linux: Verify `notify-send` is installed

---

### Issue: Session doesn't complete

**Symptoms:**
- Session created but never gets notification
- Session stuck in logs

**Solutions:**

1. **Check session status manually:**
   ```bash
   # Use OpenCode TUI to check session list
   # Or use SDK (Phase 2+)
   ```

2. **Check for errors in logs:**
   ```bash
   cat .opencode/plugin/logs/async-delegation.log | grep ERROR
   ```

3. **Verify agent exists:**
   - Make sure you're using valid agent names: `@developer`, `@tester`, `@code_reviewer`
   - Check agent configuration in `.opencode/agent/`

---

### Issue: SDK connection error

**Symptoms:**
- Error creating background session
- Log shows connection refused

**Solutions:**

1. **Verify OpenCode server is running:**
   ```bash
   curl http://localhost:4096/health
   ```

2. **Check OpenCode is listening on port 4096:**
   ```bash
   lsof -i :4096
   ```

3. **Restart OpenCode:**
   ```bash
   opencode
   ```

---

## Limitations (Phase 2)

### Current Limitations

1. **No status checking** - Can't see active session status (Phase 3)
2. **No cancellation** - Can't cancel running tasks (Phase 3)
3. **No queuing** - Exceeds resource limits silently (Phase 3)
4. **No cleanup tool** - Orphaned sessions accumulate (Phase 3)
5. **No resource limits** - Unlimited parallel sessions (Phase 3)

### Completed Enhancements

- ✅ **Phase 2:** Context injection - Results automatically injected into orchestrator
- ✅ **Phase 2:** Error handling - Errors flow back to orchestrator

### Future Enhancements (Phases 3-4)

- 🔲 **Phase 3:** `async_status` tool - Check status of all background tasks
- 🔲 **Phase 3:** `async_cancel` tool - Cancel background tasks
- 🔲 **Phase 3:** `async_cleanup` tool - Clean up orphaned sessions
- 🔲 **Phase 3:** Dynamic resource limits - Adjust based on CPU/memory
- 🔲 **Phase 3:** Session queuing - Queue tasks when at max limit
- 🔲 **Phase 4:** Auto-detection - Orchestrator detects independent tasks
- 🔲 **Phase 4:** Manual parallel control - User says "run in parallel"

---

## Development

### Code Structure

```
.opencode/plugin/
├── async-delegation.ts     # Main plugin code (~300 lines)
├── ASYNC_DELEGATION.md     # This file
└── logs/
    └── async-delegation.log  # Runtime log (gitignored)
```

### Key Components

1. **Plugin Function** - `asyncDelegationPlugin` exported from async-delegation.ts
2. **SDK Client** - `createOpencodeClient()` for session management
3. **Session Tracking** - Map<sessionId, BackgroundSession>
4. **Tool Registration** - `async_delegate` tool
5. **Event Handlers** - `session.idle` event listener
6. **Notification System** - Cross-platform notifications
7. **Logging** - File-based logging

### Testing Phase 1

```bash
# Test 1: Single task delegation
@async_delegate agent="@developer" task="Read package.json"

# Expected: Immediate return, notification after ~5-10s

# Test 2: Invalid agent
@async_delegate agent="@nonexistent" task="Test"

# Expected: Error message

# Test 3: Three parallel tasks
@async_delegate agent="@developer" task="Task 1"
@async_delegate agent="@developer" task="Task 2"
@async_delegate agent="@developer" task="Task 3"

# Expected: All return immediately, 3 notifications

# Verify logs
cat .opencode/plugin/logs/async-delegation.log
```

---

## API Reference

### Plugin Interface

```typescript
export const asyncDelegationPlugin: Plugin = async ({ client, directory, project }) => {
  return {
    tool: {
      async_delegate: tool({ ... }),
    },
    event: async ({ event }) => {
      // Handle session.idle
    },
  }
}
```

### SDK Usage

```typescript
// Create background session
const session = await sdkClient.session.create({
  body: { title: "Task description" }
})

// Send prompt
await sdkClient.session.prompt({
  path: { id: session.data.id },
  body: {
    parts: [
      { type: "text", text: context },
      { type: "text", text: task },
    ],
  },
})
```

---

## See Also

- **Notifications Plugin:** `./plugin/notifications.ts`
- **Notifications Documentation:** `./plugin/LOGGING.md`
- **OpenCode SDK Docs:** https://opencode.ai/docs/sdk
- **OpenCode Plugin Docs:** https://opencode.ai/docs/plugins
- **Architecture:** `../ARCHITECTURE.md`
- **Agents:** `../AGENTS.md`

---

## Changelog

### Version 1.1.0 (Phase 2 - Current)

**Added:**
- ✅ Result extraction from session messages
- ✅ Automatic context injection into orchestrator
- ✅ Error handling for background tasks
- ✅ File modification tracking
- ✅ `extractSummary()` function
- ✅ `injectContext()` function

**Behavior Changes:**
- Background task results now automatically appear in orchestrator session
- Errors are injected and formatted for review
- File modifications are listed in context injection
- No AI response is triggered (noReply: true)

**From Version 1.0.0:**
- ✅ `async_delegate` tool
- ✅ Background session creation via SDK
- ✅ Session tracking with Map
- ✅ Completion notifications (visual, sound, voice)
- ✅ File-based logging
- ✅ Cross-platform support (macOS, Linux)

**Planned:**
- 🔲 Multi-session management (Phase 3)
- 🔲 Orchestrator integration (Phase 4)

---

## Questions?

For issues or questions:
1. Check logs: `.opencode/plugin/logs/async-delegation.log`
2. Review this documentation
3. See OpenCode documentation: https://opencode.ai/docs
4. Check architecture decisions: `ARCHITECTURE.md`

---

**Status:** Phase 2 complete ✅
**Next:** Phase 3 - Multi-Session Management
**Timeline:** Phase 2 implementation (Days 4-5)
