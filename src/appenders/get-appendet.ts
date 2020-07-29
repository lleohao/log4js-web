import { LayoutHandle } from '../layouts';
import { LevelType } from '../levels';
import { LoggingEvent } from '../loggingEvent';
import { Appender } from './appender';
import { consoleAppender } from './console.appender';

/**
 * Custom Appender config
 */
export interface AppenderConfig {
  /**
   * appender type, build-in: console
   */
  type: string;
  /**
   * filter level, less the level log will ignore
   */
  level?: LevelType;
  /**
   * log layout function
   */
  layout?: LayoutHandle;
  /**
   * custom appender
   */
  configure?: (loggingEvent: LoggingEvent, layout?: LayoutHandle) => void;
}

/**
 * build-in appender
 */
const APPENDERS: Map<string, Appender> = new Map<string, Appender>();
APPENDERS.set('console', consoleAppender);

/**
 * get appender
 * @param appenderConfig
 */
export const getAppender = (appenderConfig?: AppenderConfig): Appender => {
  const { type } = appenderConfig;

  if (!APPENDERS.has(type)) {
    APPENDERS.set(type, new Appender(appenderConfig.configure, appenderConfig.layout, appenderConfig.level));
  }

  return APPENDERS.get(type);
};
