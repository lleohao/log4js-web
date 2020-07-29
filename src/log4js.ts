import { configure } from './configure';
import { Logger } from './logger';

/**
 * Get a logger instance.
 * @static
 * @param loggerCategoryName
 * @return {Logger} instance of logger for the category
 */
function getLogger(loggerCategoryName = 'default'): Logger {
  return new Logger(loggerCategoryName);
}

const logger = getLogger();

export { getLogger, configure, logger };
