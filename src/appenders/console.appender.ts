import { Appender } from './appender';

const consoleLog = console.log.bind(this);

/**
 * console appender
 */
export const consoleAppender = new Appender((loggingEvent, layout) => {
  consoleLog(layout(loggingEvent));
});
