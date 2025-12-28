import type { Plugin } from "@opencode-ai/plugin"

// Cross-platform notification plugin for OpenCode
// Supports macOS (via osascript + say) and Linux (via notify-send + espeak)
// Focused notifications for key workflow events

export const notificationsPlugin: Plugin = async ({ project, client, $, directory }) => {
  // Get project name safely
  const projectName = (project as any)?.name || directory || "unknown"

  // Log levels for configurable verbosity
  enum LogLevel {
    ERROR = 0,    // Always log errors (bypasses debug flag)
    WARN = 1,     // Warnings only
    INFO = 2,      // Information only
    DEBUG = 3,     // Full debugging
    OFF = 4         // No logging except critical errors
  }

  // Get log level from environment variable
  const getLogLevel = (): LogLevel => {
    const envLevel = process.env.OPENCODE_LOG_LEVEL?.toUpperCase()
    
    switch (envLevel) {
      case "ERROR": return LogLevel.ERROR
      case "WARN": return LogLevel.WARN
      case "INFO": return LogLevel.INFO
      case "DEBUG": return LogLevel.DEBUG
      case "OFF": return LogLevel.OFF
      default: return LogLevel.ERROR  // Default to errors only (minimal logging)
    }
  }

  const logLevel = getLogLevel()
  const isDebug = logLevel >= LogLevel.DEBUG
  
  // Setup logging to file
  const logDir = `${directory}/.opencode/plugin/logs`
  const sessionId = Date.now().toString()
  const MAX_LOG_SIZE = 1024 * 1024  // 1MB max per file

  // Get log file path (synchronous to use in async contexts)
  const getLogFile = (): string => {
    return `${logDir}/session-${sessionId}.log`
  }

  // Determine if message should be logged based on level
  const shouldLog = (level: LogLevel): boolean => {
    if (logLevel === LogLevel.OFF) return false
    if (level === LogLevel.ERROR) return true  // Always log errors
    if (level >= logLevel) return true
    return false
  }

  // Log file rotation to prevent massive files
  const checkAndRotateLog = async (): Promise<void> => {
    if (!shouldLog(LogLevel.INFO)) return  // Skip rotation if logging is OFF

    try {
      const fs = await import("fs")
      const logFile = getLogFile()
      const stats = await fs.promises.stat(logFile)
      
      if (stats.size > MAX_LOG_SIZE) {
        // Archive old log
        const archiveFile = `${logFile}.old`
        await fs.promises.rename(logFile, archiveFile)
        
        // Start fresh log
        await fs.promises.writeFile(logFile, "")
      }
    } catch (error) {
      // Ignore if file doesn't exist yet
    }
  }

  // Enhanced logging function with level control
  const log = async (message: string, level: LogLevel = LogLevel.INFO): Promise<void> => {
    if (!shouldLog(level)) return
    
    try {
      await checkAndRotateLog()
      
      const timestamp = new Date().toISOString()
      const levelLabel = LogLevel[level]
      const logMessage = `[${timestamp}] [${levelLabel}] ${message}\n`
      
      const fs = await import("fs")
      fs.appendFileSync(getLogFile(), logMessage, { encoding: "utf8" })
    } catch (error) {
      // Only critical errors escape to console (recursion prevention)
      console.error(`Failed to write log: ${error}`)
    }
  }

  // Ensure logs directory exists
  try {
    Bun.spawnSync(["mkdir", "-p", logDir])
  } catch (error) {
    console.error("Failed to create logs directory: " + error)
  }

  // Platform detection helper
  const isMac = () => {
    try {
      const result = Bun.spawnSync(["uname", "-s"])
      return result.success && result.stdout.toString().trim() === "Darwin"
    } catch {
      return false
    }
  }

  const isLinux = () => {
    try {
      const result = Bun.spawnSync(["uname", "-s"])
      return result.success && result.stdout.toString().trim() === "Linux"
    } catch {
      return false
    }
  }

  // Verify platform at startup
  if (!isMac() && !isLinux()) {
    await log("Notifications: Unsupported platform. Only macOS and Linux are currently supported", LogLevel.WARN)
    return {}
  }

  // Send notification with sound (always uses Glass sound)
  const sendNotification = async (
    title: string,
    message: string,
    useVoice: boolean = false,
    voiceMessage?: string
  ): Promise<void> => {
    try {
      if (isMac()) {
        // Visual notification with Glass sound
        const escapedTitle = title.replace(/"/g, '\\"')
        const escapedMessage = message.replace(/"/g, '\\"')
        
         const result = Bun.spawnSync([
           "osascript", 
           "-e", 
           `display notification "${escapedMessage}" with title "${escapedTitle}" sound name "Glass"`
         ])
 
         if (!result.success) {
           await log(`Notification failed: ${result.stderr?.toString()}`, LogLevel.ERROR)
         }

         // Voice announcement if requested
         if (useVoice && voiceMessage) {
           const cleanMessage = voiceMessage.replace(/[^\w\s]/g, "") // Remove emojis
           const voiceResult = Bun.spawnSync(["say", cleanMessage])
           
           if (!voiceResult.success) {
             await log("Voice announcement failed", LogLevel.ERROR)
           }
        }
      } else if (isLinux()) {
        // Visual notification
        const escapedTitle = title.replace(/"/g, '\\"')
        const escapedMessage = message.replace(/"/g, '\\"')
        
        const result = Bun.spawnSync([
          "notify-send", 
          escapedTitle, 
          escapedMessage, 
          "-u", 
          "normal"
        ])

         if (!result.success) {
           await log(`Notification failed: ${result.stderr?.toString()}`, LogLevel.ERROR)
         }

         // Voice announcement if requested (espeak)
         if (useVoice && voiceMessage) {
           const cleanMessage = voiceMessage.replace(/[^\w\s]/g, "")
           const voiceResult = Bun.spawnSync(["espeak", cleanMessage])
           
           if (!voiceResult.success) {
             await log("espeak not found - install with: sudo apt-get install espeak", LogLevel.WARN)
           }
         }
       }
     } catch (error) {
       await log(`Failed to send notification: ${error}`, LogLevel.ERROR)
     }
  }

  // Extract agent name and task from session title or event properties
  const parseAgentDelegation = async (event: any): Promise<{ agent: string; task: string } | null> => {
    await log(`🔍 parseAgentDelegation called with event: ${JSON.stringify(event, null, 2)}`, LogLevel.DEBUG)
    try {
      // Try to get session title from properties
      const sessionTitle = event.properties?.title || event.properties?.session?.title || ""
      
      // Check for subagent_type field (most reliable for task tool events)
      const subagentType = event.properties?.subagent_type || event.subagent_type || ""
      
      await log(`🔍 Session title: "${sessionTitle}"`, LogLevel.DEBUG)
      await log(`🔍 Subagent type: "${subagentType}"`, LogLevel.DEBUG)
      
      // Agent name mapping
      const agentNameMap: { [key: string]: string } = {
        "developer": "Developer",
        "code_reviewer": "Code reviewer",
        "tester": "Tester",
        "jira-mcp": "Jira agent",
        "github-mcp": "GitHub agent",
        "context7-mcp": "Context7 agent",
        "oracle": "Oracle",
        "librarian": "Librarian",
        "explore": "Explore",
        "general": "General"
      }
      
      // First try: Check subagent_type field directly
      let agentName = "Agent"
      if (subagentType && agentNameMap[subagentType]) {
        agentName = agentNameMap[subagentType]
        await log(`✅ Agent identified from subagent_type: ${agentName}`, LogLevel.DEBUG)
      } else {
        // Second try: Parse from session title using patterns
        const agentPatterns = [
          { pattern: /@developer|developer/i, name: "Developer" },
          { pattern: /@code_reviewer|code.reviewer|reviewer/i, name: "Code reviewer" },
          { pattern: /@tester|tester/i, name: "Tester" },
          { pattern: /@jira-mcp|jira/i, name: "Jira agent" },
          { pattern: /@github-mcp|github/i, name: "GitHub agent" },
          { pattern: /@context7-mcp|context7/i, name: "Context7 agent" },
          { pattern: /@oracle|oracle/i, name: "Oracle" },
          { pattern: /@librarian|librarian/i, name: "Librarian" },
          { pattern: /@explore|explore/i, name: "Explore" },
        ]

        for (const { pattern, name } of agentPatterns) {
          if (pattern.test(sessionTitle)) {
            agentName = name
            await log(`✅ Agent identified from title pattern: ${agentName}`, LogLevel.DEBUG)
            break
          }
        }
      }

      // Extract task description (everything after agent name or first few words)
      let taskDescription = sessionTitle
        .replace(/@\w+[-\w]*/g, "") // Remove @mentions
        .replace(/^[:\-\s]+/, "") // Remove leading punctuation
        .trim()

      // If task is too long, truncate
      if (taskDescription.length > 50) {
        taskDescription = taskDescription.slice(0, 50) + "..."
      }

      // If no task description found, use generic
      if (!taskDescription || taskDescription.length < 3) {
        taskDescription = "task"
      }

      await log(`📋 Final result: agent="${agentName}", task="${taskDescription}"`, LogLevel.DEBUG)
      return { agent: agentName, task: taskDescription }
     } catch (error) {
       await log(`Failed to parse agent delegation: ${error}`, LogLevel.ERROR)
       return null
     }
  }
  
   await log("🔧 Notifications Plugin Loaded!", LogLevel.INFO)
  await log(`📱 Platform: macOS = ${isMac()}, Linux = ${isLinux()}`, LogLevel.INFO)
  await log(`📁 Project: ${projectName}`, LogLevel.INFO)
  await log(`📝 Log file: ${getLogFile()}`, LogLevel.INFO)
  await log(`📊 Log level: ${LogLevel[logLevel]} (OPENCODE_LOG_LEVEL=${process.env.OPENCODE_LOG_LEVEL || 'ERROR'})`, LogLevel.INFO)
  
  return {
    event: async ({ event }) => {
      const eventType = event.type as string
      
      // DEBUG: Log ALL events to see what's firing (only at DEBUG level)
      await log(`🔍 Event received: ${eventType}`, LogLevel.DEBUG)
      await log(`🔍 Event properties: ${JSON.stringify(event.properties, null, 2)}`, LogLevel.DEBUG)
      switch (eventType) {
        // Session created for new subagent
        case "session.created": {
          await log("✅ Session created event detected", LogLevel.DEBUG)
          const sessionInfo = event.properties as any
          await log(`🔍 Session info: ${JSON.stringify(sessionInfo, null, 2)}`, LogLevel.DEBUG)
          
          // Check if this is a child session (subagent delegation)
          // The parentID is nested in sessionInfo.info.parentID
          const isChildSession = !!(sessionInfo?.info?.parentID || sessionInfo?.parentId || sessionInfo?.parent)
          await log(`🔍 Is child session? ${isChildSession}`, LogLevel.DEBUG)
          
          if (isChildSession) {
            await log("✅ Child session detected - sending notification", LogLevel.DEBUG)
            const delegation = await parseAgentDelegation(event)
            await log(`🔍 Parsed delegation: ${JSON.stringify(delegation)}`, LogLevel.DEBUG)
            
            if (delegation) {
              const { agent, task } = delegation
                const voiceMessage = `${agent} started ${task}`
                await log(`🔊 Voice message: ${voiceMessage}`, LogLevel.INFO)
                
                await sendNotification(
                  "OpenCode",
                  `🤖 ${agent} started`,
                  true, // Use voice
                  voiceMessage
                )
            } else {
              // Fallback if parsing fails
              await log("⚠️ Delegation parsing failed - using fallback", LogLevel.WARN)
              await sendNotification(
                "OpenCode",
                "🤖 Agent delegation started",
                true,
                "Agent started task"
              )
            }
          }
          break
        }

        // Session idle - agent finished work
        case "session.idle":
          await log("✅ Session idle detected - sending notification", LogLevel.DEBUG)
          await sendNotification(
            "OpenCode",
            "💤 Session completed"
          )
          break

        // Tool execution events
        case "tool.execute.after": {
          const toolEvent = event as any
          const { tool, args } = toolEvent.properties || {}

           switch (tool) {
             // Tasks updated
             case "todowrite":
               await log("✅ Tasks updated detected - sending notification", LogLevel.DEBUG)
               await sendNotification(
                 "OpenCode",
                 "✅ Tasks updated"
               )
               break

             // Git commands
             case "bash": {
               const command = args?.command || ""
               await log(`🔍 Bash command: ${command}`, LogLevel.DEBUG)
               
               if (command.includes("git commit")) {
                 await log("✅ Git commit detected - sending notification", LogLevel.DEBUG)
                 await sendNotification(
                   "OpenCode",
                   "🔒 Changes committed"
                 )
               } else if (command.includes("git push")) {
                 await log("✅ Git push detected - sending notification", LogLevel.DEBUG)
                 await sendNotification(
                   "OpenCode",
                   "📤 Changes pushed"
                 )
               }
               break
             }

             // Agent delegation via task tool
             case "task": {
               await log("✅ Task tool detected", LogLevel.DEBUG)
               await log(`🔍 Task args: ${JSON.stringify(args, null, 2)}`, LogLevel.DEBUG)
               
               const taskDescription = args?.description || args?.prompt || args?.task || "task"
               const subagentType = args?.subagent_type || ""
               await log(`🔍 Task description: ${taskDescription}`, LogLevel.DEBUG)
               await log(`🔍 Subagent type from args: ${subagentType}`, LogLevel.DEBUG)
               
               const delegation = await parseAgentDelegation({ 
                 properties: { 
                   title: taskDescription,
                   subagent_type: subagentType
                 } 
               })
               await log(`🔍 Parsed delegation: ${JSON.stringify(delegation)}`, LogLevel.DEBUG)
               
               if (delegation) {
                 const { agent, task } = delegation
                 const voiceMessage = `${agent} started ${task}`
                 await log(`🔊 Voice message: ${voiceMessage}`, LogLevel.INFO)
                 
                 await sendNotification(
                   "OpenCode",
                   `🤖 ${agent} started`,
                   true, // Use voice
                   voiceMessage
                 )
               } else {
                 await log("⚠️ Delegation parsing failed - using fallback", LogLevel.WARN)
                 await sendNotification(
                   "OpenCode",
                   "🤖 Agent delegation started",
                   true,
                   "Agent started task"
                 )
               }
               break
             }
          }
          break
        }

        // OpenSpec command execution
        case "command.executed": {
          const cmdEvent = event as any
          const command = cmdEvent.properties?.command || ""
          await log(`🔍 Command executed: ${command}`, LogLevel.DEBUG)
  
          if (command === "openspec-proposal") {
            await log("✅ OpenSpec proposal detected - sending notification", LogLevel.DEBUG)
            await sendNotification(
              "OpenCode",
              "📋 Creating proposal"
            )
          } else if (command === "openspec-apply") {
            await log("✅ OpenSpec apply detected - sending notification", LogLevel.DEBUG)
            await sendNotification(
              "OpenCode",
              "⚙️ Applying changes"
            )
          } else if (command === "openspec-validate") {
            await log("✅ OpenSpec validate detected - sending notification", LogLevel.DEBUG)
            await sendNotification(
              "OpenCode",
              "✅ Validating specs"
            )
          } else if (command === "openspec-archive") {
            await log("✅ OpenSpec archive detected - sending notification", LogLevel.DEBUG)
            await sendNotification(
              "OpenCode",
              "📦 Archiving change"
            )
          }
          break
        }
      }
    },
  }
}
