/**
 * Logging Utility
 * Structured logging for better debugging and monitoring
 */

type LogLevel = 'debug' | 'info' | 'warn' | 'error';

interface LogContext {
  [key: string]: any;
}

class Logger {
  private serviceName: string;

  constructor(serviceName: string = 'backup-dashboard') {
    this.serviceName = serviceName;
  }

  private log(level: LogLevel, message: string, context?: LogContext) {
    const timestamp = new Date().toISOString();
    const logEntry = {
      timestamp,
      level,
      service: this.serviceName,
      message,
      ...context,
    };

    // In production, you might want to send to a logging service
    // For now, we'll use console with colors
    const colors = {
      debug: '\x1b[36m', // Cyan
      info: '\x1b[32m',  // Green
      warn: '\x1b[33m',  // Yellow
      error: '\x1b[31m', // Red
    };

    const reset = '\x1b[0m';
    const color = colors[level];

    console[level === 'debug' ? 'log' : level](
      `${color}[${level.toUpperCase()}]${reset} ${timestamp} - ${message}`,
      context ? JSON.stringify(context, null, 2) : ''
    );

    // In production, send to logging service
    if (process.env.NODE_ENV === 'production') {
      // TODO: Send to Datadog, LogRocket, Sentry, etc.
      // Example: sendToLoggingService(logEntry);
    }
  }

  debug(message: string, context?: LogContext) {
    if (process.env.NODE_ENV === 'development') {
      this.log('debug', message, context);
    }
  }

  info(message: string, context?: LogContext) {
    this.log('info', message, context);
  }

  warn(message: string, context?: LogContext) {
    this.log('warn', message, context);
  }

  error(message: string, error?: Error | LogContext) {
    const context = error instanceof Error
      ? { error: error.message, stack: error.stack }
      : error;
    this.log('error', message, context);
  }

  // Specialized loggers
  api(method: string, path: string, status: number, duration: number) {
    this.info('API Request', {
      method,
      path,
      status,
      duration: `${duration}ms`,
    });
  }

  backup(action: string, backupName: string, details?: LogContext) {
    this.info(`Backup ${action}`, {
      backupName,
      ...details,
    });
  }

  restore(backupName: string, status: 'started' | 'completed' | 'failed', details?: LogContext) {
    const level = status === 'failed' ? 'error' : 'info';
    this.log(level, `Restore ${status}`, {
      backupName,
      ...details,
    });
  }
}

// Export singleton instance
export const logger = new Logger();

// Export Logger class for creating specialized loggers
export { Logger };
