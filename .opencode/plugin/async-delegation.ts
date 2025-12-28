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
 * Extracted summary from background session
 */
interface SessionSummary {
  agent: string
  task: string
  duration: number
  status: 'success' | 'error' | 'cancelled'
  filesModified?: string[]
  summary: string
  error?: string
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
 *
 * Phase 2: Context injection
 * - Result extraction from background sessions
 * - Automatic injection into orchestrator session
 * - Error handling and injection
 */

/**
 * Extract summary from session messages
 * Gets the last assistant message and parses for key information
 */
const extractSummary = (messages: any): SessionSummary => {
  try {
    // Find the last assistant message
    const assistantMessages = messages.data.filter((m: any) => m.info.role === 'assistant')
    const lastMessage = assistantMessages[assistantMessages.length - 1]

    if (!lastMessage) {
      return {
        status: 'success',
        summary: 'Task completed (no message content)',
      } as any
    }

    // Extract text from parts
    const textParts = lastMessage.parts
      ?.filter((p: any) => p.type === 'text')
      ?.map((p: any) => p.text)
      ?.join('\n') || ''

    // Extract files modified/changed
    const filesModified: string[] = []
    const fileMatches = textParts.matchAll(/(?:Modified|Changed|Added|Created|Deleted):\n([\s\S]+?)(?:\n\n|\n[A-Z]|\n#|$)/g)
    for (const match of fileMatches) {
      const files = match[1]
        .split('\n')
        .filter(f => f.trim().startsWith('- ') || f.trim().startsWith('+ '))
        .map(f => f.trim().replace(/^[-+]\s*/, ''))
        .filter(f => f.length > 0)
      filesModified.push(...files)
    }

    // Extract errors
    const errorMatch = textParts.match(/Error:\n([\s\S]+?)(?:\n\n|\n[A-Z]|\n#|$)/)
    const error = errorMatch ? errorMatch[1].trim() : undefined

    // Determine status
    const status = error ? 'error' : 'success'

    // Create summary (truncate to 500 chars)
    const summary = textParts.slice(0, 500) + (textParts.length > 500 ? '...' : '')

    return {
      status,
      summary,
      filesModified: filesModified.length > 0 ? filesModified : undefined,
      error,
    } as any
  } catch (error) {
    return {
      status: 'error',
      summary: `Failed to extract summary: ${error}`,
      error: String(error),
    } as any
  }
}

/**
 * Inject session result into orchestrator session
 * Uses SDK to send noReply message to parent session
 */
const injectContext = async (
  sdkClient: any,
  parentSessionId: string,
  sessionInfo: BackgroundSession,
  summary: SessionSummary,
  logToFile: (msg: string) => Promise<void>
): Promise<void> => {
  try {
    await logToFile(`💉 Injecting context into session: ${parentSessionId}`)

    // Check if parent session still exists
    try {
      await sdkClient.session.get({ path: { id: parentSessionId } })
    } catch (error: any) {
      await logToFile(`⚠️ Parent session ${parentSessionId} no longer exists`)
      return // Parent session gone, don't inject
    }

    // Build injection message
    const duration = Math.floor((Date.now() - sessionInfo.startTime) / 1000)

    let message: string
    if (summary.status === 'error') {
      message = `## Background Task Failed\n\n**Agent:** ${sessionInfo.agent}\n**Task:** ${sessionInfo.task}\n**Duration:** ${duration}s\n\n**Error:**\n\`\`\`\n${summary.error}\n\`\`\`\n\n**Action Required:** Review error and decide to retry, fix, or abandon.\n\n**Full Summary:**\n${summary.summary}`
    } else {
      message = `## Background Task Completed\n\n**Agent:** ${sessionInfo.agent}\n**Task:** ${sessionInfo.task}\n**Duration:** ${duration}s\n**Status:** ✅ Success\n`

      if (summary.filesModified && summary.filesModified.length > 0) {
        message += `\n\n**Files Modified (${summary.filesModified.length}):**\n${summary.filesModified.map(f => `- ${f}`).join('\n')}`
      }

      message += `\n\n**Summary:**\n${summary.summary}`
    }

    // Inject into parent session (noReply to avoid triggering AI)
    await sdkClient.session.prompt({
      path: { id: parentSessionId },
      body: {
        noReply: true,
        parts: [{ type: 'text', text: message }],
      },
    })

    await logToFile(`✅ Context injected successfully`)
  } catch (error: any) {
    await logToFile(`❌ Failed to inject context: ${error}`)
  }
}

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

      /**
       * Check status of all active background tasks
       *
       * Lists all currently running sessions with their details.
       */
      async_status: tool({
        description: "List all active background tasks with their current status and duration",
        args: {},
        async execute(args, ctx) {
          await logToFile(`📋 async_status called: checking ${activeSessions.size} sessions`)

          const sessions = Array.from(activeSessions.values())

          if (sessions.length === 0) {
            return {
              count: 0,
              sessions: [],
              message: "No active background tasks",
            }
          }

          const now = Date.now()
          const sessionList = sessions.map((s: any) => {
            const duration = Math.floor((now - s.startTime) / 1000)
            return {
              sessionId: s.id,
              agent: s.agent,
              task: s.task,
              duration: `${duration}s`,
              status: "running",
            }
          })

          await logToFile(`📊 Status check: ${sessions.length} active sessions`)

          return {
            count: sessions.length,
            sessions: sessionList,
            message: `Found ${sessions.length} active background task${sessions.length !== 1 ? 's' : ''}`,
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

          try {
            // Fetch session messages to extract results
            const messages = await sdkClient.session.messages({
              path: { id: sessionInfo.id },
            })

            await logToFile(`📄 Fetched ${messages.data.length} messages from session`)

            // Extract summary
            const summary = extractSummary(messages)
            await logToFile(`📝 Extracted summary: status=${summary.status}, ${summary.filesModified?.length || 0} files`)

            // Inject context into orchestrator session
            await injectContext(
              sdkClient,
              sessionInfo.parentSessionId,
              sessionInfo,
              summary,
              logToFile
            )

            // Send completion notification
            const agentName = sessionInfo.agent.replace("@", "")
            const taskPreview = sessionInfo.task.slice(0, 100)
            const voiceMessage = `${agentName} finished ${sessionInfo.task.slice(0, 50)}`

            await sendNotification(
              `${agentName} finished`,
              taskPreview,
              voiceMessage
            )

          } catch (error: any) {
            await logToFile(`❌ Failed to process session completion: ${error}`)

            // Still send notification even if extraction fails
            const agentName = sessionInfo.agent.replace("@", "")
            const taskPreview = sessionInfo.task.slice(0, 100)
            const voiceMessage = `${agentName} finished ${sessionInfo.task.slice(0, 50)}`

            await sendNotification(
              `${agentName} finished`,
              `${taskPreview} (some errors occurred)`,
              voiceMessage
            )
          }

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
