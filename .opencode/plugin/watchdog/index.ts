import type { Plugin } from "@opencode-ai/plugin"

/**
 * Watchdog Plugin for Local Models
 * 
 * Detects when subagents hang (stop responding) and sends a nudge
 * to help them continue. This is especially useful for local models
 * that sometimes get "stuck" during complex tasks.
 * 
 * Configuration (via environment variables):
 * - WATCHDOG_TIMEOUT_MS: Time before considering a session hung (default: 60000 = 1 minute)
 * - WATCHDOG_NUDGE_MESSAGE: Custom nudge message (default: "Please continue with your task.")
 * - WATCHDOG_ENABLED: Set to "false" to disable (default: "true")
 */

interface WatchdogState {
  lastActivityTime: number
  timeoutId: ReturnType<typeof setTimeout> | null
  sessionId: string | null
  isWaiting: boolean
}

const state: WatchdogState = {
  lastActivityTime: Date.now(),
  timeoutId: null,
  sessionId: null,
  isWaiting: false,
}

// Configuration
const TIMEOUT_MS = parseInt(process.env.WATCHDOG_TIMEOUT_MS || "60000", 10)
const NUDGE_MESSAGE = process.env.WATCHDOG_NUDGE_MESSAGE || "Please continue with your task. If you're done, say 'READY FOR REVIEW' or 'APPROVED'."
const ENABLED = process.env.WATCHDOG_ENABLED !== "false"

export const WatchdogPlugin: Plugin = async ({ client }) => {
  if (!ENABLED) {
    await client.app.log({
      service: "watchdog",
      level: "info",
      message: "Watchdog plugin disabled via WATCHDOG_ENABLED=false",
    })
    return {}
  }

  await client.app.log({
    service: "watchdog",
    level: "info",
    message: `Watchdog plugin initialized (timeout: ${TIMEOUT_MS}ms)`,
  })

  const resetTimer = () => {
    state.lastActivityTime = Date.now()
    
    if (state.timeoutId) {
      clearTimeout(state.timeoutId)
      state.timeoutId = null
    }
  }

  const startTimer = async (sessionId: string) => {
    resetTimer()
    state.sessionId = sessionId
    state.isWaiting = true

    state.timeoutId = setTimeout(async () => {
      if (state.isWaiting && state.sessionId) {
        await client.app.log({
          service: "watchdog",
          level: "warn",
          message: `Session ${state.sessionId} appears hung after ${TIMEOUT_MS}ms, sending nudge`,
        })

        try {
          // Send a nudge message to the session
          await client.session.chat({
            sessionID: state.sessionId,
            message: {
              role: "user",
              parts: [{
                type: "text",
                text: NUDGE_MESSAGE,
              }],
            },
          })

          await client.app.log({
            service: "watchdog",
            level: "info",
            message: "Nudge sent successfully",
          })
        } catch (error) {
          await client.app.log({
            service: "watchdog",
            level: "error",
            message: `Failed to send nudge: ${error}`,
          })
        }
      }
    }, TIMEOUT_MS)
  }

  return {
    event: async ({ event }) => {
      // Track session activity
      if (event.type === "session.created") {
        state.sessionId = event.properties.info.id
        await client.app.log({
          service: "watchdog",
          level: "debug",
          message: `Tracking session: ${state.sessionId}`,
        })
      }

      // Session is actively processing - reset timer
      if (event.type === "session.status") {
        const status = event.properties.status
        
        if (status === "running" || status === "pending") {
          // Model is working, start/reset the watchdog timer
          if (state.sessionId) {
            await startTimer(state.sessionId)
          }
        } else if (status === "idle" || status === "completed") {
          // Session completed normally
          state.isWaiting = false
          resetTimer()
        }
      }

      // Message activity - model is responding
      if (event.type === "message.updated" || event.type === "message.part.updated") {
        resetTimer()
        if (state.sessionId) {
          await startTimer(state.sessionId)
        }
      }

      // Tool execution - model is active
      if (event.type === "tool.execute.before" || event.type === "tool.execute.after") {
        resetTimer()
        if (state.sessionId) {
          await startTimer(state.sessionId)
        }
      }

      // Session became idle - stop watching
      if (event.type === "session.idle") {
        state.isWaiting = false
        resetTimer()
        await client.app.log({
          service: "watchdog",
          level: "debug",
          message: "Session idle, watchdog paused",
        })
      }

      // Session error - stop watching
      if (event.type === "session.error") {
        state.isWaiting = false
        resetTimer()
        await client.app.log({
          service: "watchdog",
          level: "warn",
          message: `Session error: ${event.properties.error}`,
        })
      }
    },
  }
}
