/* eslint-disable @typescript-eslint/no-explicit-any */
import { Levels } from '../levels';
import { Logger } from '../logger';

const events: any[] = [];

jest.mock('../clustering', () => {
  return {
    send(ev: any): void {
      events.push(ev);
    },
  };
});

const testConfig = {
  level: Levels.TRACE,
};

describe('logger test', () => {
  beforeEach(() => {
    events.length = 0;
    testConfig.level = Levels.TRACE;
  });

  test('constructor with no parameters', () => {
    expect(() => {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      new Logger();
    }).toThrow('No category provided');
  });

  describe('constructor with category', () => {
    const logger = new Logger('cheese1');

    test('should use category', () => {
      expect(logger.category).toEqual('cheese1');
    });

    test('should use OFF log level', () => {
      expect(logger.level).toEqual(Levels.OFF);
    });
  });

  describe('set level should delegate', () => {
    const logger = new Logger('cheese');
    logger.level = 'debug';

    test('should use category', () => {
      expect(logger.category).toEqual('cheese');
    });

    test('should use level', () => {
      expect(logger.level).toEqual(Levels.DEBUG);
    });
  });

  describe('isLevelEnabled', () => {
    const logger = new Logger('cheese');
    const functions = [
      'isTraceEnabled',
      'isDebugEnabled',
      'isInfoEnabled',
      'isWarnEnabled',
      'isErrorEnabled',
      'isFatalEnabled',
    ];

    test('should provide a level enabled function for all levels', () => {
      expect(typeof logger['isTraceEnabled']).toEqual('function');
      expect(typeof logger['isDebugEnabled']).toEqual('function');
      expect(typeof logger['isInfoEnabled']).toEqual('function');
      expect(typeof logger['isWarnEnabled']).toEqual('function');
      expect(typeof logger['isErrorEnabled']).toEqual('function');
      expect(typeof logger['isFatalEnabled']).toEqual('function');

      logger.level = 'INFO';

      expect(logger.isTraceEnabled()).toBeFalsy();
      expect(logger.isDebugEnabled()).toBeFalsy();
      expect(logger.isInfoEnabled()).toBeTruthy();
      expect(logger.isWarnEnabled()).toBeTruthy();
      expect(logger.isErrorEnabled()).toBeTruthy();
      expect(logger.isFatalEnabled()).toBeTruthy();
    });
  });

  test('should send log events to dispatch function', () => {
    const logger = new Logger('cheese');

    logger.level = 'debug';

    logger.debug('Event 1');
    logger.debug('Event 2');
    logger.debug('Event 3');

    expect(events.length).toEqual(3);
    expect(events[0].data[0]).toEqual('Event 1');
    expect(events[1].data[0]).toEqual('Event 2');
    expect(events[2].data[0]).toEqual('Event 3');
  });

  test('should add context values to every event', () => {
    const logger = new Logger('fromage');
    logger.level = 'debug';
    logger.debug('Event 1');
    logger.addContext('cheese', 'edam');
    logger.debug('Event 2');
    logger.debug('Event 3');
    logger.addContext('biscuits', 'timtam');
    logger.debug('Event 4');
    logger.removeContext('cheese');
    logger.debug('Event 5');
    logger.clearContext();
    logger.debug('Event 6');

    expect(events.length).toEqual(6);

    expect(events[0].context).toMatchObject({});
    expect(events[1].context).toMatchObject({ cheese: 'edam' });
    expect(events[2].context).toMatchObject({ cheese: 'edam' });
    expect(events[3].context).toMatchObject({ cheese: 'edam', biscuits: 'timtam' });
    expect(events[4].context).toMatchObject({ biscuits: 'timtam' });
    expect(events[5].context).toMatchObject({});
  });

  test('should not break when log data has no toString', () => {
    const logger = new Logger('thing');
    logger.level = 'debug';
    logger.info('Just testing ', Object.create(null));

    expect(events.length).toEqual(1);
  });
});
