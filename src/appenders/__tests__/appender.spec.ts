import { basicLayout, colouredLayout } from '../../layouts';
import { Levels } from '../../levels';
import { LoggingEvent } from '../../loggingEvent';
import { Appender } from '../appender';

describe('Appender', () => {
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  const defaultAppenderOut = () => {};

  test('must set appenderOut', () => {
    expect(() => {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      new Appender();
    }).toThrowError('Appender out must be function');
  });

  test('default property', () => {
    const appender = new Appender(defaultAppenderOut);

    expect(appender.level).toEqual(Levels.ALL);
    expect(appender.layout).toEqual(colouredLayout);
  });

  test('custom layout', () => {
    const appender = new Appender(defaultAppenderOut, basicLayout);

    expect(appender.layout).toEqual(basicLayout);
  });

  test('custom level', () => {
    const appender = new Appender(defaultAppenderOut, colouredLayout, 'ERROR');

    expect(appender.level).toEqual(Levels.ERROR);
  });

  test('appenderOut', () => {
    const appenderOutMock = jest.fn((_, layout) => {
      layout();
    });
    const layoutMock = jest.fn();
    const appender = new Appender(appenderOutMock, layoutMock, 'DEBUG');

    appender.appenderOut(new LoggingEvent('default', Levels.ALL, []));
    expect(appenderOutMock).toBeCalledTimes(0);
    expect(layoutMock).toBeCalledTimes(0);

    appender.appenderOut(new LoggingEvent('default', Levels.ERROR, []));
    expect(appenderOutMock).toBeCalledTimes(1);
    expect(layoutMock).toBeCalledTimes(1);
  });
});
