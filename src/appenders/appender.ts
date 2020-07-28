import { colouredLayout, LayoutHandle } from '../layouts';
import { Level, LevelType } from '../levels';
import { LoggingEvent } from '../loggingEvent';

/**
 * Appender output log function
 */
export type AppenderOut = (loggingEvent: LoggingEvent, layout?: LayoutHandle) => void;

export class Appender {
  public readonly level: Level;
  public readonly layout: LayoutHandle;
  private readonly _appenderOut: AppenderOut;

  constructor(appenderOut: AppenderOut, layout = colouredLayout, level: LevelType = 'ALL') {
    if (!appenderOut || typeof appenderOut !== 'function') {
      throw new Error('Appender out must be function');
    }

    this._appenderOut = appenderOut;
    this.level = Level.getLevel(level);
    this.layout = layout;
  }

  public appenderOut(loggingEvent: LoggingEvent): void {
    if (loggingEvent.level.isGreaterThanOrEqualTo(this.level)) {
      this._appenderOut(loggingEvent, this.layout);
    }
  }
}
