/**
 * Centralized logging utility for renderer process
 * Provides consistent logging format and supports different log levels
 */

interface LogMeta {
  [key: string]: unknown;
}

class Logger {
  private isDevelopment = process.env.NODE_ENV === 'development';

  /**
   * Format log message with context
   */
  private formatMessage(context: string, message: string): string {
    return `[${context}] ${message}`;
  }

  /**
   * Log debug messages (only in development)
   */
  debug(context: string, message: string, meta?: LogMeta): void {
    if (this.isDevelopment) {
      const formattedMessage = this.formatMessage(context, message);
      if (meta) {
        console.debug(formattedMessage, meta);
      } else {
        console.debug(formattedMessage);
      }
    }
  }

  /**
   * Log info messages
   */
  info(context: string, message: string, meta?: LogMeta): void {
    const formattedMessage = this.formatMessage(context, message);
    if (meta) {
      console.info(formattedMessage, meta);
    } else {
      console.info(formattedMessage);
    }
  }

  /**
   * Log warning messages
   */
  warn(context: string, message: string, meta?: LogMeta): void {
    const formattedMessage = this.formatMessage(context, message);
    if (meta) {
      console.warn(formattedMessage, meta);
    } else {
      console.warn(formattedMessage);
    }
  }

  /**
   * Log error messages
   */
  error(context: string, message: string, meta?: LogMeta): void {
    const formattedMessage = this.formatMessage(context, message);
    if (meta) {
      console.error(formattedMessage, meta);
    } else {
      console.error(formattedMessage);
    }
  }

  /**
   * Log error objects
   */
  errorFromCatch(context: string, message: string, error: unknown): void {
    const formattedMessage = this.formatMessage(context, message);

    if (error instanceof Error) {
      console.error(formattedMessage, {
        message: error.message,
        stack: error.stack,
        name: error.name,
      });
    } else {
      console.error(formattedMessage, { error });
    }
  }
}

// Export singleton instance
export const logger = new Logger();
