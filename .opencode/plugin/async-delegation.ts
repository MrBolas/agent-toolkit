import type { Plugin } from "@opencode-ai/plugin"
import { createOpencodeClient } from "@opencode-ai/sdk"
import { tool } from "@opencode-ai/plugin"

/**
 * Background session tracking information
 */
interface BackgroundSession {
  id: string
  agent: string
  task: string
  startTime: number
  parentSessionId: string
}

/**
 * Async Delegation Plugin
 *
 * Enables fire-and-forget parallel execution of tasks across multiple agents.
 * Background sessions are created and tracked, with notifications sent on completion.
 *
 * Phase 1: Core functionality
 * - async_delegate tool
 * - Session tracking
 * - Completion notifications
 */
export const asyncDelegationPlugin: Plugin = async ({ client, directory, project }) => {
  // Create SDK client for background session management
  const sdkClient = createOpencodeClient({ baseUrl: "http://localhost:4096" })

  // Track active background sessions
  const activeSessions = new Map<string, BackgroundSession>()

  // Setup logging to file
  const logDir = `${directory}/.opencode/plugin/logs`
  const logFile = `${logDir}/async-delegation.log`

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

      const fs = await import("fs")
      fs.appendFileSync(logFile, logMessage, { encoding: "utf8" })
    } catch (error) {
      console.error("Failed to log to file:", error)
    }
  }

  await logToFile("🚀 Async Delegation Plugin initialized")

  /**
   * Send notification by importing and calling notifications plugin function
   * This is a simplified version - in production you might want a more robust inter-plugin communication
   */
  const sendNotification = async (title: string, message: string, voice: string) => {
    try {
      // Import notifications plugin
      const notificationsModule = await import("./notifications.ts")
      // @ts-ignore - Access internal function (would need proper export in notifications.ts)
      const sendNotif = notificationsModule.notificationsPlugin

      // For now, use direct shell commands as fallback
      const isMac = process.platform === "darwin"
      const isLinux = process.platform === "linux"

      if (isMac) {
        // Visual notification with Glass sound
        const escapedTitle = title.replace(/"/g, '\\"')
        const escapedMessage = message.replace(/"/g, '\\"')

        Bun.spawnSync([
          "osascript",
          "-e",
          `display notification "${escapedMessage}" with title "${escapedTitle}" sound name "Glass"`
        ])

        // Voice announcement
        const cleanVoice = voice.replace(/[^\w\s]/g, "")
        Bun.spawnSync(["say", cleanVoice])
      } else if (isLinux) {
        // Visual notification
        const escapedTitle = title.replace(/"/g, '\\"')
        const escapedMessage = message.replace(/"/g, '\\"')

        Bun.spawnSync([
          "notify-send",
          escapedTitle,
          escapedMessage,
          "-u",
          "normal"
        ])

        // Voice announcement (espeak)
        const cleanVoice = voice.replace(/[^\w\s]/g, "")
        const voiceResult = Bun.spawnSync(["espeak", cleanVoice])

        if (!voiceResult.success) {
          console.error("⚠️ espeak not found - install with: sudo apt-get install espeak")
        }
      }

      await logToFile(`📢 Notification sent: ${title} - ${message}`)
    } catch (error) {
      await logToFile(`❌ Failed to send notification: ${error}`)
    }
  }

  return {
    tool: {
      /**
       * Delegate task to agent in background (fire-and-forget)
       *
       * Creates a new background session, sends the task prompt, and returns immediately.
       * The session continues running independently and will send a notification when complete.
       */
      async_delegate: tool({
        description: "Delegate task to agent in background (fire-and-forget). The task runs independently and you'll be notified when it completes.",
        args: {
          agent: tool.schema.string().describe("Agent name (e.g., @developer, @tester, @code_reviewer)"),
          task: tool.schema.string().describe("Task description - be specific about what needs to be done"),
          context: tool.schema.string().optional().describe("Additional context or setup information for the agent"),
        },
        async execute(args, ctx) {
          await logToFile(`📥 async_delegate called: agent=${args.agent}, task=${args.task.slice(0, 50)}...`)

          try {
            // Create background session
            const session = await sdkClient.session.create({
              body: {
                title: `${args.agent}: ${args.task.slice(0, 50)}`,
              },
            })

            await logToFile(`✅ Background session created: ${session.data.id}`)

            // Build prompt parts
            const parts: Array<{ type: string; text: string }> = []
            if (args.context) {
              parts.push({ type: "text", text: `# Context\n${args.context}\n\n` })
            }
            parts.push({ type: "text", text: `# Task\n${args.task}` })

            // Send prompt to background session
            await sdkClient.session.prompt({
              path: { id: session.data.id },
              body: {
                parts,
              },
            })

            await logToFile(`📤 Prompt sent to background session: ${session.data.id}`)

            // Track session
            activeSessions.set(session.data.id, {
              id: session.data.id,
              agent: args.agent,
              task: args.task,
              startTime: Date.now(),
              parentSessionId: ctx.sessionId || "unknown",
            })

            await logToFile(`📍 Session tracked: ${activeSessions.size} active sessions`)

            return {
              success: true,
              sessionId: session.data.id,
              message: `✅ Delegated to ${args.agent} in background (session: ${session.data.id})`,
            }
          } catch (error) {
            await logToFile(`❌ Failed to create background session: ${error}`)
            throw error
          }
        },
      }),
    },

    event: async ({ event }) => {
      // Handle session completion (idle event)
      if (event.type === "session.idle") {
        const sessionInfo = activeSessions.get(event.properties.id)

        if (sessionInfo) {
          await logToFile(`✅ Background session completed: ${sessionInfo.id}`)

          // Calculate duration
          const duration = Math.floor((Date.now() - sessionInfo.startTime) / 1000)
          await logToFile(`⏱️  Duration: ${duration}s`)

          // Send completion notification
          const agentName = sessionInfo.agent.replace("@", "")
          const taskPreview = sessionInfo.task.slice(0, 100)
          const voiceMessage = `${agentName} finished ${sessionInfo.task.slice(0, 50)}`

          await sendNotification(
            `${agentName} finished`,
            taskPreview,
            voiceMessage
          )

          // Clean up tracking
          activeSessions.delete(event.properties.id)
          await logToFile(`🧹 Session removed from tracking: ${activeSessions.size} remaining`)
        }
      }

      // Log other session events for debugging
      if (event.type === "session.created" || event.type === "session.error") {
        await logToFile(`📋 Session event: ${event.type} - id=${event.properties.id}`)
      }
    },
  }
}
