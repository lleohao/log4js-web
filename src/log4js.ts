import { appendersForCategory } from './categories';
import { onMessage } from './clustering';
import { Configuration, configure as _configure } from './configure';
import { addLayout } from './layouts';
import { Logger } from './logger';
import { LoggingEvent } from './loggingEvent';

let enable = false;

function sendLogEventToAppender(logEvent: LoggingEvent) {
  if (!enable) return;

  const categoryAppenders = appendersForCategory(logEvent.categoryName);

  categoryAppenders.forEach((appender) => {
    appender(logEvent);
  });
}

function configure(configuration: Configuration) {
  _configure(configuration);
  onMessage(sendLogEventToAppender);

  enable = true;
}

/**
 * Get a logger instance.
 * @static
 * @param loggerCategoryName
 * @return {Logger} instance of logger for the category
 */
function getLogger(loggerCategoryName = 'default'): Logger {
  if (!enable) {
    configure({
      appenders: { out: { type: 'console' } },
      categories: { default: { appenders: ['out'], level: 'OFF' } },
    });
  }

  return new Logger(loggerCategoryName);
}

export { getLogger, configure, addLayout };
