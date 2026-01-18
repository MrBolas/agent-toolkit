import type { Plugin } from "@opencode-ai/plugin"

/**
 * Watchdog Plugin for Local Models
 * 
 * Monitors session activity and logs warnings when sessions appear hung.
 * Useful for debugging local model issues.
 */

const TIMEOUT_MS = parseInt(process.env.WATCHDOG_TIMEOUT_MS || "60000", 10)
const ENABLED = process.env.WATCHDOG_ENABLED !== "false"

export const Watchdog: Plugin = async ({ client }) => {
  if (!ENABLED) {
    return {}
  }

  let timeoutId: ReturnType<typeof setTimeout> | null = null
  let isActive = false

  const resetTimer = () => {
    if (timeoutId) {
      clearTimeout(timeoutId)
      timeoutId = null
    }
  }

  const startTimer = () => {
    resetTimer()
    isActive = true
    
    timeoutId = setTimeout(async () => {
      if (isActive) {
        await client.app.log({
          service: "watchdog",
          level: "warn",
          message: `No activity for ${TIMEOUT_MS}ms - session may be hung`,
        })
      }
    }, TIMEOUT_MS)
  }

  return {
    event: async ({ event }) => {
      // Start watching when session becomes active
      if (event.type === "session.status") {
        const status = event.properties.status
        if (status === "running") {
          startTimer()
        } else if (status === "idle") {
          isActive = false
          resetTimer()
        }
      }

      // Reset timer on any message activity
      if (event.type === "message.updated" || event.type === "message.part.updated") {
        if (isActive) {
          startTimer()
        }
      }

      // Stop watching on idle or error
      if (event.type === "session.idle" || event.type === "session.error") {
        isActive = false
        resetTimer()
      }
    },
  }
}
