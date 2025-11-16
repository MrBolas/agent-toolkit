import { appendFileSync, existsSync, mkdirSync } from "fs";
import { homedir } from "os";
import { join } from "path";

const LOG_DIR = join(homedir(), '.config', 'opencode', 'logs');
const LOG_FILE = join(LOG_DIR, 'chromadb.log');

// Ensure log directory exists
if (!existsSync(LOG_DIR)) {
  mkdirSync(LOG_DIR, { recursive: true });
}

export function log(level, message, data = null) {
  const timestamp = new Date().toISOString();
  const logLine = `${timestamp} [${level}] ${message}${data ? ' | ' + JSON.stringify(data) : ''}\n`;

  try {
    appendFileSync(LOG_FILE, logLine);
  } catch (err) {
    console.error(`Failed to write log: ${err.message}`);
  }

  // Also log to stderr for immediate visibility
  if (level === 'ERROR') {
    console.error(`[${level}] ${message}`, data || '');
  }
}

export function logSuccess(operation, data) {
  log('SUCCESS', operation, data);
}

export function logError(operation, error, context = {}) {
  log('ERROR', `${operation} failed: ${error.message}`, { error: error.message, stack: error.stack, ...context });
}

export function logInfo(message, data) {
  log('INFO', message, data);
}
