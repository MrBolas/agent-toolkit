# Debug Logging to Files

## Changes Made

All console.log statements have been replaced with file logging. Each OpenCode session now creates its own log file.

## Log File Location

```
.opencode/plugin/logs/session-<timestamp>.log
```

**Example:**
```
.opencode/plugin/logs/session-1735363200000.log
```

## How to Use

### 1. Restart OpenCode

```bash
opencode
```

### 2. Delegate to an Agent

```
@developer implement user authentication
```

### 3. Check the Log File

```bash
# Find the latest log file
ls -lt .opencode/plugin/logs/ | head -5

# View the log
cat .opencode/plugin/logs/session-<timestamp>.log

# Or tail it in real-time
tail -f .opencode/plugin/logs/session-<timestamp>.log
```

## What Gets Logged

### Plugin Initialization
```
[2025-12-28T04:20:00.000Z] 🔧 Notifications Plugin Loaded!
[2025-12-28T04:20:00.000Z] 📱 Platform: macOS = true, Linux = false
[2025-12-28T04:20:00.000Z] 📁 Project: agent-toolkit
[2025-12-28T04:20:00.000Z] 📝 Log file: .opencode/plugin/logs/session-1735363200000.log
```

### All Events
```
[2025-12-28T04:20:01.000Z] 🔍 Event received: session.created
[2025-12-28T04:20:01.000Z] 🔍 Event properties: { ... }
```

### Session Created (Subagent Delegation)
```
[2025-12-28T04:20:02.000Z] ✅ Session created event detected
[2025-12-28T04:20:02.000Z] 🔍 Session info: { "id": "...", "title": "...", "parentId": "..." }
[2025-12-28T04:20:02.000Z] 🔍 Is child session? true
[2025-12-28T04:20:02.000Z] ✅ Child session detected - sending notification
[2025-12-28T04:20:02.000Z] 🔍 Parsed delegation: { "agent": "Developer", "task": "implementing feature" }
[2025-12-28T04:20:02.000Z] 🔊 Voice message: Developer started implementing feature
```

### Task Tool (Agent Delegation)
```
[2025-12-28T04:20:03.000Z] ✅ Task tool detected
[2025-12-28T04:20:03.000Z] 🔍 Task args: { "description": "...", "prompt": "..." }
[2025-12-28T04:20:03.000Z] 🔍 Task description: implement user authentication
[2025-12-28T04:20:03.000Z] 🔍 Parsed delegation: { "agent": "Developer", "task": "implement user authentication" }
[2025-12-28T04:20:03.000Z] 🔊 Voice message: Developer started implement user authentication
```

### Session Idle
```
[2025-12-28T04:20:10.000Z] ✅ Session idle detected - sending notification
```

### Git Commands
```
[2025-12-28T04:20:15.000Z] 🔍 Bash command: git commit -m "test"
[2025-12-28T04:20:15.000Z] ✅ Git commit detected - sending notification
```

### OpenSpec Commands
```
[2025-12-28T04:20:20.000Z] 🔍 Command executed: openspec-proposal
[2025-12-28T04:20:20.000Z] ✅ OpenSpec proposal detected - sending notification
```

## Viewing Logs

### View Latest Log

```bash
# Get the most recent log file
LATEST_LOG=$(ls -t .opencode/plugin/logs/*.log | head -1)
cat "$LATEST_LOG"
```

### Watch Logs in Real-Time

```bash
# Tail the latest log file
LATEST_LOG=$(ls -t .opencode/plugin/logs/*.log | head -1)
tail -f "$LATEST_LOG"
```

### Search Logs

```bash
# Find all agent delegation events
grep "🔊 Voice message" .opencode/plugin/logs/*.log

# Find all session created events
grep "Session created" .opencode/plugin/logs/*.log

# Find all notifications sent
grep "sending notification" .opencode/plugin/logs/*.log
```

## Log Cleanup

Logs are stored in `.opencode/plugin/logs/` and are gitignored.

To clean up old logs:

```bash
# Remove logs older than 7 days
find .opencode/plugin/logs -name "*.log" -mtime +7 -delete

# Remove all logs
rm .opencode/plugin/logs/*.log
```

## Troubleshooting

### No Log File Created

If no log file appears:
1. Check plugin loaded: Look for "🔧 Notifications Plugin Loaded!" in terminal
2. Check directory exists: `ls .opencode/plugin/logs/`
3. Check permissions: `ls -la .opencode/plugin/logs/`

### Log File Empty

If log file exists but is empty:
1. Plugin may have failed to initialize
2. Check for errors in terminal output
3. Verify Bun.write permissions

### Can't Find Latest Log

```bash
# List all logs sorted by time
ls -lt .opencode/plugin/logs/

# Show the newest log file name
ls -t .opencode/plugin/logs/*.log | head -1
```

## Next Steps

1. **Restart OpenCode** to create a new log file
2. **Delegate to an agent**: `@developer implement feature X`
3. **Check the log file** to see what events fired
4. **Share the log contents** so I can fix the detection logic

---

**Quick command to view logs:**

```bash
# View latest log
cat $(ls -t .opencode/plugin/logs/*.log | head -1)
```
