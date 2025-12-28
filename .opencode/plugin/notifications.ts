import type { Plugin } from "@opencode-ai/plugin"

// Cross-platform notification plugin for OpenCode
// Supports macOS (via osascript + say) and Linux (via notify-send + espeak)
// Focused notifications for key workflow events

export const notificationsPlugin: Plugin = async ({ project, client, $, directory }) => {
  // Get project name safely
  const projectName = (project as any)?.name || directory || "unknown"

  // Setup logging to file
  const logDir = `${directory}/.opencode/plugin/logs`
  const sessionId = Date.now().toString()
  const logFile = `${logDir}/session-${sessionId}.log`
  
  // Ensure logs directory exists
  try {
    Bun.spawnSync(["mkdir", "-p", logDir])
  } catch (error) {
    console.error("Failed to create logs directory:", error)
  }

  // Log to file function
  const logToFile = async (message: string) => {
    try {
      const timestamp = new Date().toISOString()
      const logMessage = `[${timestamp}] ${message}\n`
      
      // Append to log file using fs module
      const fs = await import("fs")
      fs.appendFileSync(logFile, logMessage, { encoding: "utf8" })
    } catch (error) {
      console.error("Failed to log to file:", error)
    }
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
    console.log("⚠️  Notifications: Unsupported platform")
    console.log("Only macOS and Linux are currently supported")
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
          console.error("❌ Notification failed:", result.stderr?.toString())
        }

        // Voice announcement if requested
        if (useVoice && voiceMessage) {
          const cleanMessage = voiceMessage.replace(/[^\w\s]/g, "") // Remove emojis
          const voiceResult = Bun.spawnSync(["say", cleanMessage])
          
          if (!voiceResult.success) {
            console.error("❌ Voice announcement failed")
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
          console.error("❌ Notification failed:", result.stderr?.toString())
        }

        // Voice announcement if requested (espeak)
        if (useVoice && voiceMessage) {
          const cleanMessage = voiceMessage.replace(/[^\w\s]/g, "")
          const voiceResult = Bun.spawnSync(["espeak", cleanMessage])
          
          if (!voiceResult.success) {
            console.error("⚠️ espeak not found - install with: sudo apt-get install espeak")
          }
        }
      }
    } catch (error) {
      console.error("❌ Failed to send notification:", error)
    }
  }

  // Extract agent name and task from session title or event properties
  const parseAgentDelegation = (event: any): { agent: string; task: string } | null => {
    logToFile(`🔍 parseAgentDelegation called with event: ${JSON.stringify(event, null, 2)}`)
    try {
      // Try to get session title from properties
      const sessionTitle = event.properties?.title || event.properties?.session?.title || ""
      
      // Common agent patterns
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

      // Find matching agent
      let agentName = "Agent"
      for (const { pattern, name } of agentPatterns) {
        if (pattern.test(sessionTitle)) {
          agentName = name
          break
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

      return { agent: agentName, task: taskDescription }
    } catch (error) {
      console.error("❌ Failed to parse agent delegation:", error)
      return null
    }
  }

  logToFile("🔧 Notifications Plugin Loaded!")
  logToFile(`📱 Platform: macOS = ${isMac()}, Linux = ${isLinux()}`)
  logToFile(`📁 Project: ${projectName}`)
  logToFile(`📝 Log file: ${logFile}`)

  return {
    event: async ({ event }) => {
      const eventType = event.type as string
      
      // DEBUG: Log ALL events to see what's firing
      logToFile(`🔍 Event received: ${eventType}`)
      logToFile(`🔍 Event properties: ${JSON.stringify(event.properties, null, 2)}`)

      switch (eventType) {
        // Session created for new subagent
        case "session.created": {
          logToFile("✅ Session created event detected")
          const sessionInfo = event.properties as any
          logToFile(`🔍 Session info: ${JSON.stringify(sessionInfo, null, 2)}`)
          
          // Check if this is a child session (subagent delegation)
          // The parentID is nested in sessionInfo.info.parentID
          const isChildSession = sessionInfo?.info?.parentID || sessionInfo?.parentId || sessionInfo?.parent
          logToFile(`🔍 Is child session? ${isChildSession}`)
          logToFile(`🔍 Parent ID: ${sessionInfo?.info?.parentID}`)
          
          if (isChildSession) {
            logToFile("✅ Child session detected - sending notification")
            const delegation = parseAgentDelegation(event)
            logToFile(`🔍 Parsed delegation: ${JSON.stringify(delegation)}`)
            
            if (delegation) {
              const { agent, task } = delegation
              const voiceMessage = `${agent} started ${task}`
              logToFile(`🔊 Voice message: ${voiceMessage}`)
              
              await sendNotification(
                "OpenCode",
                `🤖 ${agent} started`,
                true, // Use voice
                voiceMessage
              )
            } else {
              // Fallback if parsing fails
              logToFile("⚠️ Delegation parsing failed - using fallback")
              await sendNotification(
                "OpenCode",
                "🤖 Agent delegation started",
                true,
                "Agent started task"
              )
            }
          } else {
            logToFile("⚠️ Not a child session - skipping notification")
          }
          break
        }

        // Session idle - agent finished work
        case "session.idle":
          logToFile("✅ Session idle detected - sending notification")
          await sendNotification(
            "OpenCode",
            "💤 Session completed"
          )
          break

        // Tool execution events
        case "tool.execute.after": {
          const toolEvent = event as { properties: { tool: string; args?: any } }
          const { tool, args } = toolEvent.properties

          switch (tool) {
            // Tasks updated
            case "todowrite":
              logToFile("✅ Tasks updated detected - sending notification")
              await sendNotification(
                "OpenCode",
                "✅ Tasks updated"
              )
              break

            // Git commands
            case "bash": {
              const command = args?.command || ""
              logToFile(`🔍 Bash command: ${command}`)
              
              if (command.includes("git commit")) {
                logToFile("✅ Git commit detected - sending notification")
                await sendNotification(
                  "OpenCode",
                  "🔒 Changes committed"
                )
              } else if (command.includes("git push")) {
                logToFile("✅ Git push detected - sending notification")
                await sendNotification(
                  "OpenCode",
                  "📤 Changes pushed"
                )
              }
              break
            }

            // Agent delegation via task tool
            case "task": {
              logToFile("✅ Task tool detected")
              logToFile(`🔍 Task args: ${JSON.stringify(args, null, 2)}`)
              
              const taskDescription = args?.description || args?.prompt || "task"
              logToFile(`🔍 Task description: ${taskDescription}`)
              
              const delegation = parseAgentDelegation({ properties: { title: taskDescription } })
              logToFile(`🔍 Parsed delegation: ${JSON.stringify(delegation)}`)
              
              if (delegation) {
                const { agent, task } = delegation
                const voiceMessage = `${agent} started ${task}`
                logToFile(`🔊 Voice message: ${voiceMessage}`)
                
                await sendNotification(
                  "OpenCode",
                  `🤖 ${agent} started`,
                  true, // Use voice
                  voiceMessage
                )
              } else {
                logToFile("⚠️ Delegation parsing failed - using fallback")
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
          const cmdEvent = event as { properties: { command?: string } }
          const command = cmdEvent.properties.command || ""
          logToFile(`🔍 Command executed: ${command}`)

          if (command === "openspec-proposal") {
            logToFile("✅ OpenSpec proposal detected - sending notification")
            await sendNotification(
              "OpenCode",
              "📋 Creating proposal"
            )
          } else if (command === "openspec-apply") {
            logToFile("✅ OpenSpec apply detected - sending notification")
            await sendNotification(
              "OpenCode",
              "⚙️ Applying changes"
            )
          } else if (command === "openspec-validate") {
            logToFile("✅ OpenSpec validate detected - sending notification")
            await sendNotification(
              "OpenCode",
              "✅ Validating specs"
            )
          } else if (command === "openspec-archive") {
            logToFile("✅ OpenSpec archive detected - sending notification")
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
