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

  test('should correct construct with/without location info', () => {
    const callStack =
      '    at repl:1:14\n    at ContextifyScript.Script.runInThisContext (vm.js:50:33)\n    at REPLServer.defaultEval (repl.js:240:29)\n    at bound (domain.js:301:14)\n    at REPLServer.runBound [as eval] (domain.js:314:12)\n    at REPLServer.onLine (repl.js:468:10)\n    at emitOne (events.js:121:20)\n    at REPLServer.emit (events.js:211:7)\n    at REPLServer.Interface._onLine (readline.js:280:10)\n    at REPLServer.Interface._line (readline.js:629:8)'; // eslint-disable-line
    const fileName = '/log4js-node/test/tap/layouts-test.js';
    const lineNumber = 1;
    const columnNumber = 14;
    const location = {
      fileName,
      lineNumber,
      columnNumber,
      callStack,
    };

    const event = new LoggingEvent('cheese', Levels.DEBUG, ['log message'], { user: 'bob' }, location);

    expect(event.fileName).toEqual(fileName);
    expect(event.lineNumber).toEqual(lineNumber);
    expect(event.columnNumber).toEqual(columnNumber);
    expect(event.callStack).toEqual(callStack);

    const event2 = new LoggingEvent('cheese', Levels.DEBUG, ['log message'], {
      user: 'bob',
    });

    expect(event2.fileName).toBeUndefined();
    expect(event2.lineNumber).toBeUndefined();
    expect(event2.columnNumber).toBeUndefined();
    expect(event2.callStack).toBeUndefined();
  });
});