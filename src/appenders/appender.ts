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
