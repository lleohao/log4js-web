/* eslint-disable @typescript-eslint/no-explicit-any,@typescript-eslint/ban-ts-comment */
import { getLevelForCategory, setLevelForCategory } from './categories';
import { send } from './clustering';
import { Level, Levels, SimilarLevel } from './levels';
import { LoggingEvent } from './loggingEvent';

/**
 * Logger to log messages.
 *
 * @name Logger
 * @param name name of category to log to
 * @param level - the loglevel for the category
 * @param dispatch - the function which will receive the logevents
 */
class Logger {
  public category: string;
  private context: Record<string, any>;

  constructor(name: string) {
    if (!name) {
      throw new Error('No category provided.');
    }

    this.category = name;
    this.context = {};
  }

  get level(): SimilarLevel {
    return Level.getLevel(getLevelForCategory(this.category), Levels.TRACE);
  }

  set level(level: SimilarLevel) {
    setLevelForCategory(this.category, Level.getLevel(level));
  }

  public isLevelEnable(otherLevel: Level): boolean {
    return (this.level as Level).isLessThanOrEqualTo(otherLevel);
  }

  public addContext(key: string, value: any): void {
    this.context[key] = value;
  }

  public removeContext(key: string): void {
    delete this.context[key];
  }

  public clearContext(): void {
    this.context = {};
  }

  public isTraceEnabled() {
    return this.isLevelEnable(Levels.TRACE);
  }

  public isDebugEnabled() {
    return this.isLevelEnable(Levels.DEBUG);
  }

  public isInfoEnabled() {
    return this.isLevelEnable(Levels.INFO);
  }

  public isWarnEnabled() {
    return this.isLevelEnable(Levels.WARN);
  }

  public isErrorEnabled() {
    return this.isLevelEnable(Levels.ERROR);
  }

  public isFatalEnabled() {
    return this.isLevelEnable(Levels.FATAL);
  }

  public trace(...args: any[]) {
    this.log(Levels.TRACE, ...args);
  }

  public debug(...args: any[]) {
    this.log(Levels.DEBUG, ...args);
  }

  public info(...args: any[]) {
    this.log(Levels.INFO, ...args);
  }

  public warn(...args: any[]) {
    this.log(Levels.WARN, ...args);
  }

  public error(...args: any[]) {
    this.log(Levels.ERROR, ...args);
  }

  public fatal(...args: any[]) {
    this.log(Levels.FATAL, ...args);
  }

  private log(level: SimilarLevel, ...args: any[]): void {
    const logLevel = Level.getLevel(level, Levels.INFO);

    if (this.isLevelEnable(logLevel)) {
      this._log(logLevel, args);
    }
  }

  private _log(level: Level, data: any[]): void {
    const loggingEvent = new LoggingEvent(this.category, level, data, this.context);
    send(loggingEvent);
  }
}

export { Logger };
