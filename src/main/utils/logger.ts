import { app } from 'electron';
import * as fs from 'fs';
import * as path from 'path';

/**
 * 日志级别
 */
export enum LogLevel {
  DEBUG = 0,
  INFO = 1,
  WARN = 2,
  ERROR = 3,
}

/**
 * 日志条目接口
 */
export interface LogEntry {
  timestamp: string;
  level: string;
  category: string;
  message: string;
  data?: any;
}

/**
 * 日志管理器
 * 支持控制台输出和文件输出
 */
export class Logger {
  private static instance: Logger;
  private logLevel: LogLevel = LogLevel.INFO;
  private logDir: string;
  private logFile: string;
  private maxLogSize = 10 * 1024 * 1024; // 10MB
  private maxLogFiles = 5;

  private constructor() {
    // 获取日志目录
    this.logDir = path.join(app.getPath('userData'), 'logs');
    this.logFile = path.join(this.logDir, `app-${this.getDateString()}.log`);

    // 确保日志目录存在
    this.ensureLogDir();

    // 清理旧日志文件
    this.cleanOldLogs();
  }

  /**
   * 获取 Logger 单例
   */
  public static getInstance(): Logger {
    if (!Logger.instance) {
      Logger.instance = new Logger();
    }
    return Logger.instance;
  }

  /**
   * 设置日志级别
   */
  public setLogLevel(level: LogLevel) {
    this.logLevel = level;
  }

  /**
   * 获取日志级别
   */
  public getLogLevel(): LogLevel {
    return this.logLevel;
  }

  /**
   * 调试日志
   */
  public debug(category: string, message: string, data?: any) {
    this.log(LogLevel.DEBUG, category, message, data);
  }

  /**
   * 信息日志
   */
  public info(category: string, message: string, data?: any) {
    this.log(LogLevel.INFO, category, message, data);
  }

  /**
   * 警告日志
   */
  public warn(category: string, message: string, data?: any) {
    this.log(LogLevel.WARN, category, message, data);
  }

  /**
   * 错误日志
   */
  public error(category: string, message: string, error?: any) {
    const errorData = error instanceof Error
      ? { message: error.message, stack: error.stack }
      : error;
    this.log(LogLevel.ERROR, category, message, errorData);
  }

  /**
   * 记录日志
   */
  private log(level: LogLevel, category: string, message: string, data?: any) {
    // 检查日志级别
    if (level < this.logLevel) {
      return;
    }

    const entry: LogEntry = {
      timestamp: new Date().toISOString(),
      level: LogLevel[level],
      category,
      message,
      data,
    };

    // 控制台输出
    this.logToConsole(entry);

    // 文件输出
    this.logToFile(entry);
  }

  /**
   * 输出到控制台
   */
  private logToConsole(entry: LogEntry) {
    const { timestamp, level, category, message, data } = entry;
    const prefix = `[${timestamp}] [${level}] [${category}]`;

    switch (entry.level) {
      case 'DEBUG':
        console.debug(prefix, message, data || '');
        break;
      case 'INFO':
        console.info(prefix, message, data || '');
        break;
      case 'WARN':
        console.warn(prefix, message, data || '');
        break;
      case 'ERROR':
        console.error(prefix, message, data || '');
        break;
    }
  }

  /**
   * 输出到文件
   */
  private logToFile(entry: LogEntry) {
    try {
      // 检查文件大小，超过限制则轮转
      this.rotateLogIfNeeded();

      // 格式化日志条目
      const logLine = this.formatLogEntry(entry);

      // 追加到文件
      fs.appendFileSync(this.logFile, logLine + '\n', 'utf8');
    } catch (error) {
      console.error('Failed to write log to file:', error);
    }
  }

  /**
   * 格式化日志条目
   */
  private formatLogEntry(entry: LogEntry): string {
    const { timestamp, level, category, message, data } = entry;
    let logLine = `[${timestamp}] [${level}] [${category}] ${message}`;

    if (data) {
      try {
        logLine += ` | ${JSON.stringify(data)}`;
      } catch (error) {
        logLine += ` | [Unserializable data]`;
      }
    }

    return logLine;
  }

  /**
   * 日志文件轮转
   */
  private rotateLogIfNeeded() {
    try {
      if (!fs.existsSync(this.logFile)) {
        return;
      }

      const stats = fs.statSync(this.logFile);
      if (stats.size < this.maxLogSize) {
        return;
      }

      // 重命名当前文件
      const timestamp = Date.now();
      const rotatedFile = path.join(
        this.logDir,
        `app-${this.getDateString()}-${timestamp}.log`
      );
      fs.renameSync(this.logFile, rotatedFile);

      // 创建新文件
      fs.writeFileSync(this.logFile, '', 'utf8');

      // 清理旧日志
      this.cleanOldLogs();
    } catch (error) {
      console.error('Failed to rotate log file:', error);
    }
  }

  /**
   * 清理旧日志文件
   */
  private cleanOldLogs() {
    try {
      const files = fs.readdirSync(this.logDir);
      const logFiles = files
        .filter(file => file.endsWith('.log'))
        .map(file => ({
          name: file,
          path: path.join(this.logDir, file),
          mtime: fs.statSync(path.join(this.logDir, file)).mtime.getTime(),
        }))
        .sort((a, b) => b.mtime - a.mtime); // 按时间降序

      // 删除超出数量的旧文件
      if (logFiles.length > this.maxLogFiles) {
        logFiles.slice(this.maxLogFiles).forEach(file => {
          try {
            fs.unlinkSync(file.path);
            console.log(`Deleted old log file: ${file.name}`);
          } catch (error) {
            console.error(`Failed to delete log file ${file.name}:`, error);
          }
        });
      }
    } catch (error) {
      console.error('Failed to clean old logs:', error);
    }
  }

  /**
   * 确保日志目录存在
   */
  private ensureLogDir() {
    try {
      if (!fs.existsSync(this.logDir)) {
        fs.mkdirSync(this.logDir, { recursive: true });
      }
    } catch (error) {
      console.error('Failed to create log directory:', error);
    }
  }

  /**
   * 获取日期字符串（YYYY-MM-DD）
   */
  private getDateString(): string {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  /**
   * 获取日志目录路径
   */
  public getLogDir(): string {
    return this.logDir;
  }

  /**
   * 获取当前日志文件路径
   */
  public getLogFile(): string {
    return this.logFile;
  }

  /**
   * 读取日志文件内容
   */
  public readLogs(lines = 100): string[] {
    try {
      if (!fs.existsSync(this.logFile)) {
        return [];
      }

      const content = fs.readFileSync(this.logFile, 'utf8');
      const allLines = content.split('\n').filter(line => line.trim());

      // 返回最后 N 行
      return allLines.slice(-lines);
    } catch (error) {
      console.error('Failed to read logs:', error);
      return [];
    }
  }

  /**
   * 清空日志
   */
  public clearLogs() {
    try {
      fs.writeFileSync(this.logFile, '', 'utf8');
      this.info('Logger', 'Logs cleared');
    } catch (error) {
      console.error('Failed to clear logs:', error);
    }
  }
}

// 导出单例实例
export const logger = Logger.getInstance();
