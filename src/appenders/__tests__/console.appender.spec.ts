import { Levels } from '../../levels';
import { LoggingEvent } from '../../loggingEvent';

test('consoleAppender', async () => {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  global.console = {
    log: (log: string) => {
      expect(log.endsWith('[INFO] default - [39mconsoleAppender test')).toBeTruthy();
    },
  };

  const { consoleAppender } = await import('../console.appender');
  consoleAppender.appenderOut(new LoggingEvent('default', Levels.INFO, ['consoleAppender test']));
});
