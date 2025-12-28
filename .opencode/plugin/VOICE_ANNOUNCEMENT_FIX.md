# Voice Announcement Fix - Agent Name Parsing

## What Was Fixed

The voice announcements were saying "Agent started task" instead of identifying the specific agent (e.g., "Developer started list files").

### Root Cause

The `parseAgentDelegation` function was only checking the `title` property, but the actual agent type is stored in the `subagent_type` field of the task tool arguments.

### Solution

1. ✅ Added `subagent_type` field checking in `parseAgentDelegation`
2. ✅ Created agent name mapping for all subagent types
3. ✅ Pass `subagent_type` from task tool args to parser
4. ✅ Added debug logging to trace parsing logic
5. ✅ Fallback to title pattern matching if subagent_type not found

---

## Testing

### Step 1: Enable Debug Logging (Optional)

To see detailed parsing information:

```bash
export OPENCODE_LOG_LEVEL=DEBUG
```

Then restart OpenCode.

### Step 2: Test Voice Announcements

Try these delegations:

```
@developer list files in src/
@code_reviewer check README.md
@tester verify docker is running
@explore analyze plugin architecture
```

### Expected Results

**Before Fix:**
- 🔊 Voice: "Agent started task"
- ❌ Generic fallback message

**After Fix:**
- 🔊 Voice: "Developer started list files in src/"
- 🔊 Voice: "Code reviewer started check README.md"
- 🔊 Voice: "Tester started verify docker is running"
- 🔊 Voice: "Explore started analyze plugin architecture"
- ✅ Specific agent names identified

### Step 3: Check Debug Logs (If Enabled)

```bash
tail -f .opencode/plugin/logs/session-*.log
```

Look for:
```
[DEBUG] 🔍 Task args: {"description":"...", "subagent_type":"developer", ...}
[DEBUG] 🔍 Subagent type from args: developer
[DEBUG] ✅ Agent identified from subagent_type: Developer
[DEBUG] 📋 Final result: agent="Developer", task="list files in src/"
[INFO] 🔊 Voice message: Developer started list files in src/
```

### Step 4: Disable Debug Logging (Return to Default)

```bash
unset OPENCODE_LOG_LEVEL
```

Or set to ERROR for minimal logging:

```bash
export OPENCODE_LOG_LEVEL=ERROR
```

Then restart OpenCode.

---

## How It Works

### Agent Name Detection (Priority Order)

1. **First Priority: `subagent_type` field**
   - Most reliable for task tool events
   - Direct mapping: `developer` → `"Developer"`
   - Example: `args.subagent_type = "developer"`

2. **Second Priority: Title pattern matching**
   - Fallback for session.created events
   - Regex patterns: `/@developer|developer/i`
   - Example: `title = "@developer list files"`

3. **Fallback: Generic "Agent"**
   - Used when no match found
   - Prevents voice announcement failure

### Supported Agent Types

| subagent_type | Voice Name |
|---------------|------------|
| developer | Developer |
| code_reviewer | Code reviewer |
| tester | Tester |
| jira-mcp | Jira agent |
| github-mcp | GitHub agent |
| context7-mcp | Context7 agent |
| oracle | Oracle |
| librarian | Librarian |
| explore | Explore |
| general | General |

---

## Troubleshooting

### Issue: Still hearing "Agent started task"

**Possible Causes:**
1. OpenCode not restarted after fix
2. `subagent_type` field not present in args
3. Agent type not in mapping table

**Solution:**
1. Restart OpenCode to reload plugin
2. Enable debug logging to see actual event structure
3. Check logs for `🔍 Subagent type from args:` line
4. If empty, the event structure may be different than expected

### Issue: Voice announcement not working at all

**Possible Causes:**
1. macOS `say` command not available
2. Notification permissions not granted
3. Plugin not loaded

**Solution:**
1. Test `say` command: `say "test"`
2. Check System Preferences → Notifications → OpenCode
3. Check OpenCode logs for plugin load errors

---

## Performance

**Default Configuration (ERROR level):**
- Minimal logging overhead
- Only errors logged
- Voice announcements work normally
- ~1KB log files

**Debug Configuration (DEBUG level):**
- Full event logging
- Detailed parsing traces
- Useful for troubleshooting
- Larger log files (rotates at 1MB)

---

## Summary

✅ **Agent names now correctly identified** from `subagent_type` field
✅ **Voice announcements specific** - "Developer started..." not "Agent started..."
✅ **Debug logging available** - Enable with `OPENCODE_LOG_LEVEL=DEBUG`
✅ **Fallback still works** - Generic message if parsing fails
✅ **Performance optimized** - Minimal logging by default

**The fix is complete and ready to test!**
