import { setupCategories } from '../categories';
import { Levels } from '../levels';
import { Logger } from '../logger';
import { LoggingEvent } from '../loggingEvent';

describe('logger', () => {
  test('constructor with no parameters', () => {
    expect(() => {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      new Logger();
    }).toThrow('No category provided');
  });

  test('constructor with category', () => {
    const configure = jest.fn();

    setupCategories({
      categories: {
        other: {
          appenders: [
            {
              type: 'other',
              configure,
              level: 'ERROR',
            },
          ],
        },
      },
    });

    const logger = new Logger('other');

    logger.info('info');
    logger.fatal('fatal');

    expect(configure).toBeCalledTimes(1);
  });

  describe('context', () => {
    test('constructor with context', () => {
      setupCategories({
        categories: {
          other: {
            appenders: [
              {
                type: 'other',
                configure: (loggingEvent) => {
                  expect(loggingEvent.context).toEqual({
                    user: 'Bob',
                  });
                },
              },
            ],
          },
        },
      });

      const logger = new Logger('other', { user: 'Bob' });
      logger.info('info');
    });

    test('addContext', () => {
      setupCategories({
        categories: {
          other: {
            appenders: [
              {
                type: 'other1',
                configure: (loggingEvent) => {
                  expect(loggingEvent.context).toEqual({
                    age: 10,
                    user: 'Bob',
                  });
                },
              },
            ],
          },
        },
      });

      const logger = new Logger('other', { user: 'Bob' });
      logger.addContext('age', 10);

      logger.info('info');
    });

    test('removeContext', () => {
      setupCategories({
        categories: {
          other: {
            appenders: [
              {
                type: 'other2',
                configure: (loggingEvent) => {
                  expect(loggingEvent.context).toEqual({});
                },
              },
            ],
          },
        },
      });

      const logger = new Logger('other', { user: 'Bob' });
      logger.removeContext('user');

      logger.info('info');
    });

    test('clearContext', () => {
      setupCategories({
        categories: {
          other: {
            appenders: [
              {
                type: 'other3',
                configure: (loggingEvent) => {
                  expect(loggingEvent.context).toEqual({});
                },
              },
            ],
          },
        },
      });

      const logger = new Logger('other', { user: 'Bob' });
      logger.clearContext();

      logger.info('info');
    });
  });

  describe('log method', () => {
    let loggingEvents: LoggingEvent[] = [];

    setupCategories({
      categories: {
        other: {
          appenders: [
            {
              type: 'logMethod',
              configure: (loggingEvent) => {
                loggingEvents.push(loggingEvent);
              },
            },
          ],
        },
      },
    });

    const logger = new Logger('other');

    beforeEach(() => {
      loggingEvents = [];
    });

    test('trace', () => {
      logger.trace('trace');

      expect(loggingEvents[0].level).toEqual(Levels.TRACE);
    });

    test('debug', () => {
      logger.debug('debug');

      expect(loggingEvents[0].level).toEqual(Levels.DEBUG);
    });

    test('info', () => {
      logger.info('info');

      expect(loggingEvents[0].level).toEqual(Levels.INFO);
    });

    test('warn', () => {
      logger.warn('warn');

      expect(loggingEvents[0].level).toEqual(Levels.WARN);
    });

    test('error', () => {
      logger.error('error');

      expect(loggingEvents[0].level).toEqual(Levels.ERROR);
    });

    test('fatal', () => {
      logger.fatal('fatal');

      expect(loggingEvents[0].level).toEqual(Levels.FATAL);
    });

    test('log', () => {
      logger.trace('fatal', 1, { user: 'Bob' });

      expect(loggingEvents[0].data).toEqual(['fatal', 1, { user: 'Bob' }]);
    });
  });
});
