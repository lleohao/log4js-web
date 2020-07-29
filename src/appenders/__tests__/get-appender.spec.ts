import { basicLayout } from '../../layouts';
import { Levels } from '../../levels';
import { LoggingEvent } from '../../loggingEvent';
import { consoleAppender } from '../console.appender';
import { getAppender } from '../get-appendet';

describe('getAppender', () => {
  test('get consoleAppender', () => {
    expect(getAppender({ type: 'console' })).toEqual(consoleAppender);
  });

  test('get exits appender with configure', () => {
    const configure = jest.fn();

    const appender = getAppender({ type: 'other', level: 'DEBUG', layout: basicLayout, configure });
    appender.appenderOut(new LoggingEvent('default', Levels.INFO, []));

    expect(appender.level).toEqual(Levels.DEBUG);
    expect(appender.layout).toEqual(basicLayout);
    expect(configure).toBeCalled();
  });
});
