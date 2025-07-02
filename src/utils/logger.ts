/**
 * 日志级别类型
 * 'debug' | 'info' | 'warn' | 'error'
 */
type Level = 'debug' | 'info' | 'warn' | 'error'
const logLevel: Level = import.meta.env.VITE_LOG_LEVEL || 'error'

class Logger {
  /**
   * 日志级别严重等级，数字越大越严重
   */
  private levels: Record<Level, number> = { debug: 0, info: 1, warn: 2, error: 3 }

  /**
   * 是否需要打印日志
   * @param level 日志级别：'debug' | 'info' | 'warn' | 'error'
   * @returns 返回 - 是(true) ; - 否(false)
   */
  private shouldLog(level: Level) {
    return this.levels[level] >= this.levels[logLevel]
  }

  /**
   * 普通级别日志打印
   * @param args
   *
   * @example
   * ```ts
   * logger.log('测试数字', 123)
   * 控制台输出: [LOG]: 测试数字 123
   * ```
   */
  log(...args: unknown[]) {
    if (this.shouldLog('debug')) {
      console.log('[LOG]:', ...args)
    }
  }

  /**
   * DEBUG级别日志打印
   * @param args
   *
   * @example
   * ```ts
   * logger.debug('测试数字', 123)
   * 控制台输出: [DEBUG]: 测试数字 123
   * ```
   */
  debug(...args: unknown[]) {
    if (this.shouldLog('debug')) {
      console.debug('[DEBUG]:', ...args)
    }
  }

  /**
   * INFO级别日志打印
   * @param args
   *
   * @example
   * ```ts
   * logger.info('测试数字', 123)
   * 控制台输出: [INFO]: 测试数字 123
   * ```
   */
  info(...args: unknown[]) {
    if (this.shouldLog('info')) {
      console.info('[INFO]:', ...args)
    }
  }

  /**
   * WARN级别日志打印
   * @param args
   *
   * @example
   * ```ts
   * logger.warn('测试数字', 123)
   * 控制台输出: [WARN]: 测试数字 123
   * ```
   */
  warn(...args: unknown[]) {
    if (this.shouldLog('warn')) {
      console.warn('[WARN]:', ...args)
    }
  }

  /**
   * ERROR级别日志打印
   * @param args
   *
   * @example
   * ```ts
   * logger.error('测试数字', 123)
   * 控制台输出: [ERROR]: 测试数字 123
   * ```
   */
  error(...args: unknown[]) {
    if (this.shouldLog('error')) {
      console.error('[ERROR]:', ...args)
    }
  }
}

const logger = new Logger()
export default logger
