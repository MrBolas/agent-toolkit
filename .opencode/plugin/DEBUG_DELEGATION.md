# Debug: Agent Delegation Not Working

## Issue

When delegating to an agent (e.g., `@developer implement feature`):
- ❌ No notification appears
- ❌ No sound plays
- ❌ No voice announcement

When session goes idle:
- ✅ Glass sound plays correctly

## Debug Steps Added

I've added extensive logging to the plugin to see what's actually happening:

### 1. All Events Logged
```typescript
console.log("🔍 Event received:", eventType)
console.log("🔍 Event properties:", JSON.stringify(event.properties, null, 2))
```

### 2. Session Created Detection
```typescript
console.log("✅ Session created event detected")
console.log("🔍 Session info:", JSON.stringify(sessionInfo, null, 2))
console.log("🔍 Is child session?", isChildSession)
```

### 3. Task Tool Detection
```typescript
console.log("✅ Task tool detected")
console.log("🔍 Task args:", JSON.stringify(args, null, 2))
console.log("🔍 Task description:", taskDescription)
```

### 4. Agent Parsing
```typescript
console.log("🔍 Parsed delegation:", delegation)
console.log("🔊 Voice message:", voiceMessage)
```

## How to Debug

### 1. Restart OpenCode

```bash
opencode
```

### 2. Delegate to an Agent

Try delegating work:
```
@developer implement user authentication
```

### 3. Watch Console Output

Look for these log messages in the terminal:

**Expected logs when delegating:**
```
🔍 Event received: tool.execute.after
🔍 Event properties: { "tool": "task", "args": { ... } }
✅ Task tool detected
🔍 Task args: { ... }
🔍 Task description: ...
🔍 Parsed delegation: { agent: "Developer", task: "..." }
🔊 Voice message: Developer started ...
```

**OR:**
```
🔍 Event received: session.created
🔍 Event properties: { ... }
✅ Session created event detected
🔍 Session info: { ... }
🔍 Is child session? true
✅ Child session detected - sending notification
🔍 Parsed delegation: { agent: "Developer", task: "..." }
🔊 Voice message: Developer started ...
```

### 4. Report Back

Please share:

1. **What events you see** when delegating to an agent
2. **Event properties** (the JSON output)
3. **Which detection path** is triggered (session.created or task tool)
4. **Any error messages**

## Possible Issues

### Issue 1: Events Not Firing

If you don't see ANY of these logs:
- `🔍 Event received: tool.execute.after`
- `🔍 Event received: session.created`

**Cause:** OpenCode might not be firing these events when delegating

**Solution:** We need to find the actual event that fires

### Issue 2: Wrong Event Detection

If you see events but not the ones we're listening for:
- Check what `eventType` is logged
- We may need to listen to different events

### Issue 3: Child Session Not Detected

If `session.created` fires but `isChildSession` is `false`:
- The session properties don't have `parentId` or `parent`
- We need to find the correct property name

### Issue 4: Task Tool Not Detected

If `tool.execute.after` fires but tool is not `"task"`:
- OpenCode might use a different tool name
- We need to check what the actual tool name is

### Issue 5: Agent Parsing Fails

If delegation is detected but `parseAgentDelegation()` returns `null`:
- The session title or task description format is different
- We need to see the actual format and adjust parsing

## Next Steps

1. **Restart OpenCode** with debug logging
2. **Delegate to an agent** and watch console
3. **Copy the log output** and share it with me
4. **I'll adjust the plugin** based on what events actually fire

## Quick Test Commands

```bash
# Restart OpenCode
opencode

# In OpenCode, try:
@developer implement feature X

# Watch terminal for logs starting with:
# 🔍 Event received:
# ✅ Session created
# ✅ Task tool detected
```

---

**Please run this and share the console output!** That will tell us exactly what's happening (or not happening) when you delegate to an agent.
