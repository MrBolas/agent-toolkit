# Notifications Plugin for OpenCode

Cross-platform notification plugin for OpenCode Agent Toolkit with **visual notifications, sound alerts, and voice announcements for agent delegation**.

## Features

- **Cross-platform support**: macOS (via osascript + say) and Ubuntu/Linux (via notify-send + espeak)
- **Visual notifications**: Banners in notification center
- **Sound alerts**: Glass sound for all notifications
- **Voice announcements**: Spoken agent delegation ("Developer started implementing feature")
- **Focused events**: Only notifies on key workflow events (6 categories)

## Quick Start

### 1. Installation

Plugin already registered in `.opencode/opencode.jsonc`:
```json
{
  "plugin": [
    "@tarquinen/opencode-dcp@0.4.12",
    "opencode-skills",
    "./plugin/notifications.ts"
  ]
}
```

### 2. Prerequisites

**macOS**: No additional installation needed (osascript and say built-in)

**Ubuntu/Linux** (visual only):
```bash
sudo apt-get install libnotify-bin
```

**Ubuntu/Linux** (voice optional):
```bash
sudo apt-get install espeak
```

### Dependencies

Installed in `.opencode/plugin/package.json`:
- `@opencode-ai/plugin`: Plugin SDK for type safety
- `@types/bun`: Bun type definitions for TypeScript

### 3. Restart OpenCode

```bash
opencode
```

## Notification Events (6 Categories)

### 1. Session Created for New Subagent
**When:** Orchestrator delegates to @developer, @code_reviewer, @tester, etc.

**Visual:** 🤖 [Agent name] started

**Sound:** Glass

**Voice:** "[Agent name] started [task description]"

**Examples:**
- "Developer started implementing authentication"
- "Code reviewer started reviewing changes"
- "Tester started running tests"

### 2. Session Idle
**When:** Agent finishes work

**Visual:** 💤 Session completed

**Sound:** Glass

**Voice:** None

### 3. Tasks Updated
**When:** Task list changes (todowrite tool)

**Visual:** ✅ Tasks updated

**Sound:** Glass

**Voice:** None

### 4. Git Commands
**When:** git commit or git push executed

**Visual:** 
- 🔒 Changes committed
- 📤 Changes pushed

**Sound:** Glass

**Voice:** None

### 5. OpenSpec Commands
**When:** /openspec-proposal, /openspec-apply, /openspec-validate, /openspec-archive

**Visual:**
- 📋 Creating proposal
- ⚙️ Applying changes
- ✅ Validating specs
- 📦 Archiving change

**Sound:** Glass

**Voice:** None

### 6. Agent Delegation
**When:** Task tool is used to delegate work

**Visual:** 🤖 [Agent name] started

**Sound:** Glass

**Voice:** "[Agent name] started [task description]"

## Supported Agents

The plugin recognizes these agent names for voice announcements:

- **@developer** → "Developer"
- **@code_reviewer** → "Code reviewer"
- **@tester** → "Tester"
- **@jira-mcp** → "Jira agent"
- **@github-mcp** → "GitHub agent"
- **@context7-mcp** → "Context7 agent"
- **@oracle** → "Oracle"
- **@librarian** → "Librarian"
- **@explore** → "Explore"

If agent name is not recognized, defaults to "Agent".

## Voice Announcement Format

**Format:** "[Agent name] started [task description]"

**Examples:**
```
Developer started implementing authentication feature
Code reviewer started reviewing pull request changes
Tester started running integration tests
Oracle started analyzing architecture
Librarian started searching documentation
```

**Task description:**
- Extracted from session title or task description
- Truncated to 50 characters if too long
- Defaults to "task" if not available

## Configuration

### Disable Voice Announcements

Edit `.opencode/plugin/notifications.ts`:

```typescript
// Find agent delegation cases and change useVoice to false:

// Session created for subagent
await sendNotification(
  "OpenCode",
  `🤖 ${agent} started`,
  false, // Change true to false
  voiceMessage
)

// Task tool delegation
await sendNotification(
  "OpenCode",
  `🤖 ${agent} started`,
  false, // Change true to false
  voiceMessage
)
```

### Change Notification Sound

Edit `.opencode/plugin/notifications.ts` in `sendNotification()` function:

```typescript
// Current (Glass sound):
`display notification "${escapedMessage}" with title "${escapedTitle}" sound name "Glass"`

// Change to different sound:
`display notification "${escapedMessage}" with title "${escapedTitle}" sound name "Submarine"`
```

**Available macOS sounds:**
- `"Glass"` (current default)
- `"Submarine"` (deep, distinctive)
- `"Hero"` (triumphant)
- `"Tink"` (subtle)
- `"Pop"` (quick)
- `"Purr"` (soft)

List all available sounds:
```bash
ls /System/Library/Sounds/
```

### Add/Remove Notification Events

Edit `.opencode/plugin/notifications.ts` and modify the event handlers in the `switch (eventType)` block.

## Testing

### Manual Testing

**Test macOS notification with sound**:
```bash
osascript -e 'display notification "Test" with title "OpenCode" sound name "Glass"'
```

**Test macOS voice**:
```bash
say "Developer started implementing feature"
```

**Test Linux notification** (if available):
```bash
notify-send "Test" "Notification working"
```

**Test Linux voice** (if installed):
```bash
espeak "Developer started implementing feature"
```

### Verification Script

Run to verify setup:
```bash
cd .opencode/plugin
./verify-setup.sh
```

## Troubleshooting

### No notifications appearing

1. **Check macOS notification permissions**
   - System Settings → Notifications → opencode/Terminal
   - Ensure notifications are enabled
   - Enable Banners and Alerts

2. **Test notification system manually**
   ```bash
   osascript -e 'display notification "Manual test" with title "Test" sound name "Glass"'
   ```

3. **Check plugin loaded**
   - Look for "🔧 Notifications Plugin Loaded!" when OpenCode starts
   - No errors should appear

### No voice announcements for agent delegation

1. **Check if voice is enabled**
   - Look for `useVoice: true` in agent delegation cases
   - Should be true for session.created and task tool events

2. **Test voice manually**
   ```bash
   say "Test voice announcement"
   ```

3. **Check agent name detection**
   - Voice only triggers for recognized agents
   - Check console for agent parsing errors

### No sound on notifications

1. **Check macOS sound settings**
   - System Settings → Sound → Sound Effects
   - Ensure "Play sound effects through" is set correctly
   - Volume should be audible

2. **Verify Glass sound exists**
   ```bash
   ls /System/Library/Sounds/ | grep Glass
   ```

3. **Test sound manually**
   ```bash
   afplay /System/Library/Sounds/Glass.aiff
   ```

## What's Different from Previous Version

### Removed Events
- ❌ Session updated (too noisy)
- ❌ File edits (write/edit tools)
- ❌ Message updates
- ❌ Installation updates
- ❌ Test notification on plugin load

### Added Features
- ✅ Voice announcements for agent delegation
- ✅ Sound (Glass) for all notifications
- ✅ Agent name detection and parsing
- ✅ Task description extraction
- ✅ Focused on 6 key event categories

### Kept Events
- ✅ Session created (for subagents only)
- ✅ Session idle
- ✅ Tasks updated (todowrite)
- ✅ Git commands (commit, push)
- ✅ OpenSpec commands
- ✅ Agent delegation (task tool)

## Development

To modify notifications:
1. Edit `.opencode/plugin/notifications.ts`
2. Modify event handlers in `switch (eventType)` block
3. Update `parseAgentDelegation()` to recognize new agents
4. Restart OpenCode

## Credits

Built for OpenCode Agent Toolkit spec-driven development workflow.
