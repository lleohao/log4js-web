import { parse } from 'flatted';
import { Levels } from '../levels';
import { LoggingEvent } from '../loggingEvent';

describe('LoggingEvent test', () => {
  test('LoggingEvent should be define', () => {
    expect(LoggingEvent).toBeDefined();
  });

  test('should serialise to flatted', () => {
    const event = new LoggingEvent('cheese', Levels.DEBUG, ['log message', new Error('test')], {
      user: 'bob',
    });
    event.startTime = new Date(Date.UTC(1994, 8, 10, 1, 3, 10));

    const loggingEvent = parse(event.serialise()) as LoggingEvent;

    expect(loggingEvent.startTime).toEqual('1994-09-10T01:03:10.000Z');
    expect(loggingEvent.categoryName).toEqual('cheese');
    expect(loggingEvent.level.levelStr).toEqual('DEBUG');
    expect(loggingEvent.data.length).toEqual(2);
    expect(loggingEvent.data[0]).toEqual('log message');
    expect(loggingEvent.data[1]).toMatchObject({
      message: 'test',
    });
    expect(loggingEvent.context.user).toEqual('bob');
  });
});
