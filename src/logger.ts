import { Category, getCategoryByCategoryName } from './categories';
import { Level, Levels } from './levels';
import { LoggingEvent } from './loggingEvent';

/**
 * Logger to log messages.
 *
 * @name Logger
 * @param name name of category to log to
 * @param level - the loglevel for the category
 * @param dispatch - the function which will receive the logevents
 */
export class Logger {
  private category: Category;
  private context: Record<string, any>;

  constructor(name: string, context: Record<string, unknown> = {}) {
    if (!name) {
      throw new Error('No category provided.');
    }

    this.category = getCategoryByCategoryName(name);
    this.context = context;
  }

  public addContext(key: string, value: unknown): void {
    this.context[key] = value;
  }

  public removeContext(key: string): void {
    delete this.context[key];
  }

  public clearContext(): void {
    this.context = {};
  }

  public trace(...args: any[]): void {
    this.log(Levels.TRACE, ...args);
  }

  public debug(...args: any[]): void {
    this.log(Levels.DEBUG, ...args);
  }

  public info(...args: any[]): void {
    this.log(Levels.INFO, ...args);
  }

  public warn(...args: any[]): void {
    this.log(Levels.WARN, ...args);
  }

  public error(...args: any[]): void {
    this.log(Levels.ERROR, ...args);
  }

  public fatal(...args: any[]): void {
    this.log(Levels.FATAL, ...args);
  }

  private log(level: Level, ...args: any[]): void {
    const loggingEvent = new LoggingEvent(this.category.name, level, args, this.context);

    this.category.appenders.forEach((appender) => {
      appender.appenderOut(loggingEvent);
    });
  }
}
