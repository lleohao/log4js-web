import * as path from 'path';
import { addLayout, basicLayout, colouredLayout, dummyLayout, layout, patternLayout } from '../layouts';
import { Levels } from '../levels';
import { LoggingEvent } from '../loggingEvent';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function testPattern(event: Partial<LoggingEvent>, tokens: Record<string, any>, pattern: string, value: string) {
  expect(patternLayout(pattern, tokens)(event)).toEqual(value);
}

describe('layouts test', () => {
  describe('colouredLayout', () => {
    test('should apply level colour codes to output', () => {
      const output = colouredLayout({
        data: ['nonsense'],
        startTime: new Date(1994, 9, 10, 10, 46, 45),
        categoryName: 'cheese',
        level: Levels.ERROR,
      });

      expect(output).toEqual('\x1B[91m[1994-10-10T10:46:45.000] [ERROR] cheese - \x1B[39mnonsense');
    });

    test('should support the console.log format for the message', () => {
      const output = colouredLayout({
        data: ['thing %d', 2],
        startTime: new Date(2010, 11, 5, 14, 18, 30, 45),
        categoryName: 'cheese',
        level: Levels.ERROR,
      });

      expect(output).toEqual('\x1B[91m[2010-12-05T14:18:30.045] [ERROR] cheese - \x1B[39mthing 2');
    });
  });

  describe('basicLayout', () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const event: any = {
      data: ['this is a test'],
      startTime: new Date(2010, 11, 5, 14, 18, 30, 45),
      categoryName: 'tests',
      level: Levels.DEBUG,
    };

    expect(basicLayout(event)).toEqual('[2010-12-05T14:18:30.045] [DEBUG] tests - this is a test');

    test('should output a stacktrace, message if the event has an error attached', () => {
      const error = new Error('Some made-up error');
      const stack = error.stack.split(/\n/);

      event.data = ['this is a test', error];
      const output = basicLayout(event);
      const lines = output.split(/\n/);

      expect(lines.length).toEqual(stack.length);
      expect(lines[0]).toEqual('[2010-12-05T14:18:30.045] [DEBUG] tests - this is a test Error: Some made-up error');

      for (let i = 1; i < stack.length; i++) {
        expect(lines[i]).toEqual(stack[i]);
      }
    });

    test('should output any extra data in the log event as util.inspect strings', () => {
      event.data = [
        'this is a test',
        {
          name: 'Cheese',
          message: 'Gorgonzola smells.',
        },
      ];

      expect(basicLayout(event)).toEqual(
        '[2010-12-05T14:18:30.045] [DEBUG] tests - this is a test ' +
          "{ name: 'Cheese', message: 'Gorgonzola smells.' }"
      );
    });
  });

  describe('dummyLayout', () => {
    test('should output just the first element of the log data', () => {
      const event = {
        data: ['this is the first value', 'this is not'],
        startTime: new Date('2010-12-05 14:18:30.045'),
        categoryName: 'multiple.levels.of.tests',
        level: Levels.DEBUG,
      };

      expect(dummyLayout(event)).toEqual('this is the first value');
    });
  });

  describe('patternLayout', () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let tokens: Record<string, any>,
      callStack: string,
      fileName: string,
      lineNumber: number,
      columnNumber: number,
      event: Partial<LoggingEvent>;

    beforeEach(() => {
      tokens = {
        testString: 'testStringToken',
        testFunction() {
          return 'testFunctionToken';
        },
        fnThatUsesLogEvent(loggingEvent: LoggingEvent) {
          return loggingEvent.level.toString();
        },
      };

      // console.log([Error('123').stack.split('\n').slice(1).join('\n')])
      callStack =
        '    at repl:1:14\n    at ContextifyScript.Script.runInThisContext (vm.js:50:33)\n    at REPLServer.defaultEval (repl.js:240:29)\n    at bound (domain.js:301:14)\n    at REPLServer.runBound [as eval] (domain.js:314:12)\n    at REPLServer.onLine (repl.js:468:10)\n    at emitOne (events.js:121:20)\n    at REPLServer.emit (events.js:211:7)\n    at REPLServer.Interface._onLine (readline.js:280:10)\n    at REPLServer.Interface._line (readline.js:629:8)'; // eslint-disable-line
      fileName = path.normalize('/log4js-node/test/tap/layouts-test.js');
      lineNumber = 1;
      columnNumber = 14;
      event = {
        data: ['this is a test'],
        startTime: new Date('1994-09-10 14:18:30.045'),
        categoryName: 'multiple.levels.of.tests',
        level: Levels.DEBUG,
        context: tokens,
        callStack,
        fileName,
        lineNumber,
        columnNumber,
      };
    });

    test('should default to "time logLevel loggerName - message"', () => {
      testPattern(event, tokens, null, '14:18:30 DEBUG multiple.levels.of.tests - this is a test\n');
    });

    test('%r should output time only', () => {
      testPattern(event, tokens, '%r', '14:18:30');
    });

    test('%p should output the log level', () => {
      testPattern(event, tokens, '%p', 'DEBUG');
    });

    test('%c should output the category', () => {
      testPattern(event, tokens, '%c', 'multiple.levels.of.tests');
    });

    test('%m should output the log data', () => {
      testPattern(event, tokens, '%m', 'this is a test');
    });

    test('%n should output a new line', () => {
      testPattern(event, tokens, '%n', '\n');
    });

    test('%h should output a new line', () => {
      testPattern(event, tokens, '%h', location.hostname);
    });

    test('%c should handle category names like java-style package names', () => {
      testPattern(event, tokens, '%c{1}', 'tests');
      testPattern(event, tokens, '%c{2}', 'of.tests');
      testPattern(event, tokens, '%c{3}', 'levels.of.tests');
      testPattern(event, tokens, '%c{4}', 'multiple.levels.of.tests');
      testPattern(event, tokens, '%c{5}', 'multiple.levels.of.tests');
      testPattern(event, tokens, '%c{99}', 'multiple.levels.of.tests');
    });

    test('%d should output the date in ISO8601 format', () => {
      testPattern(event, tokens, '%d', '1994-09-10T14:18:30.045');
    });

    test('%d should allow for format specification', () => {
      testPattern(event, tokens, '%d{ISO8601}', '1994-09-10T14:18:30.045');

      testPattern(event, tokens, '%d{ABSOLUTE}', '14:18:30.045');
      testPattern(event, tokens, '%d{DATE}', '10 09 1994 14:18:30.045');
      testPattern(event, tokens, '%d{yy MM dd hh mm ss}', '94 09 10 14 18 30');
      testPattern(event, tokens, '%d{yyyy MM dd}', '1994 09 10');
      testPattern(event, tokens, '%d{yyyy MM dd hh mm ss SSS}', '1994 09 10 14 18 30 045');
    });

    test('%% should output %', () => {
      testPattern(event, tokens, '%%', '%');
    });

    test('%f should output filename', () => {
      testPattern(event, tokens, '%f', fileName);
    });

    test('%l should output line number', () => {
      testPattern(event, tokens, '%l', lineNumber.toString());
    });

    test('%l should accept truncation and padding', () => {
      testPattern(event, tokens, '%5.10l', '    1');
      testPattern(event, tokens, '%.5l', '1');
      testPattern(event, tokens, '%.-5l', '1');
      testPattern(event, tokens, '%-5l', '1    ');
    });

    test('%o should output column postion', () => {
      testPattern(event, tokens, '%o', columnNumber.toString());
    });

    test('%o should accept truncation and padding', () => {
      testPattern(event, tokens, '%5.10o', '   14');
      testPattern(event, tokens, '%.5o', '14');
      testPattern(event, tokens, '%.1o', '1');
      testPattern(event, tokens, '%.-1o', '4');
      testPattern(event, tokens, '%-5o', '14   ');
    });

    test('%s should output stack', () => {
      testPattern(event, tokens, '%s', callStack);
    });

    test('%f should output empty string when fileName not exist', () => {
      delete event.fileName;
      testPattern(event, tokens, '%f', '');
    });

    test('%l should output empty string when lineNumber not exist', () => {
      delete event.lineNumber;
      testPattern(event, tokens, '%l', '');
    });

    test('%o should output empty string when columnNumber not exist', () => {
      delete event.columnNumber;
      testPattern(event, tokens, '%o', '');
    });

    test('%s should output empty string when callStack not exist', () => {
      delete event.callStack;
      testPattern(event, tokens, '%s', '');
    });

    test('should output anything not preceded by % as literal', () => {
      testPattern(event, tokens, 'blah blah blah', 'blah blah blah');
    });

    test('should output the original string if no replacer matches the token', () => {
      testPattern(event, tokens, '%a{3}', 'a{3}');
    });

    test('should handle complicated patterns', () => {
      testPattern(
        event,
        tokens,
        '%m%n %c{2} at %d{ABSOLUTE} cheese %p%n',
        'this is a test\n of.tests at 14:18:30.045 cheese DEBUG\n'
      );
    });

    test('should truncate fields if specified', () => {
      testPattern(event, tokens, '%.4m', 'this');
      testPattern(event, tokens, '%.7m', 'this is');
      testPattern(event, tokens, '%.9m', 'this is a');
      testPattern(event, tokens, '%.14m', 'this is a test');
      testPattern(event, tokens, '%.2919102m', 'this is a test');
      testPattern(event, tokens, '%.-4m', 'test');
    });

    test('should pad fields if specified', () => {
      testPattern(event, tokens, '%10p', '     DEBUG');
      testPattern(event, tokens, '%8p', '   DEBUG');
      testPattern(event, tokens, '%6p', ' DEBUG');
      testPattern(event, tokens, '%4p', 'DEBUG');
      testPattern(event, tokens, '%-4p', 'DEBUG');
      testPattern(event, tokens, '%-6p', 'DEBUG ');
      testPattern(event, tokens, '%-8p', 'DEBUG   ');
      testPattern(event, tokens, '%-10p', 'DEBUG     ');
    });

    test('%[%r%] should output colored time', () => {
      testPattern(event, tokens, '%[%r%]', '\x1B[36m14:18:30\x1B[39m');
    });

    test('%x{testString} should output the string stored in tokens', () => {
      testPattern(event, tokens, '%x{testString}', 'testStringToken');
    });

    test('%x{testFunction} should output the result of the function stored in tokens', () => {
      testPattern(event, tokens, '%x{testFunction}', 'testFunctionToken');
    });

    test('%x{doesNotExist} should output the string stored in tokens', () => {
      testPattern(event, tokens, '%x{doesNotExist}', 'null');
    });

    test('%x{fnThatUsesLogEvent} should be able to use the logEvent', () => {
      testPattern(event, tokens, '%x{fnThatUsesLogEvent}', 'DEBUG');
    });

    test('%x should output the string stored in tokens', () => {
      testPattern(event, tokens, '%x', 'null');
    });

    test('%X{testString} should output the string stored in tokens', () => {
      testPattern(event, {}, '%X{testString}', 'testStringToken');
    });

    test('%X{testFunction} should output the result of the function stored in tokens', () => {
      testPattern(event, {}, '%X{testFunction}', 'testFunctionToken');
    });

    test('%X{doesNotExist} should output the string stored in tokens', () => {
      testPattern(event, {}, '%X{doesNotExist}', 'null');
    });

    test('%X{fnThatUsesLogEvent} should be able to use the logEvent', () => {
      testPattern(event, {}, '%X{fnThatUsesLogEvent}', 'DEBUG');
    });

    test('%X should output the string stored in tokens', () => {
      testPattern(event, {}, '%X', 'null');
    });
  });

  describe('layout makers', () => {
    test('should have a marker for each layout', () => {
      expect(layout('basic')).toBeDefined();
      expect(layout('colored')).toBeDefined();
      expect(layout('coloured')).toBeDefined();
      expect(layout('dummy')).toBeDefined();
      expect(layout('pattern')).toBeDefined();
    });

    test('layout pattern maker should pass pattern and tokens to layout from config', () => {
      let patternLayout = layout('pattern', { pattern: '%%' });

      expect(patternLayout({})).toEqual('%');

      patternLayout = layout('pattern', {
        pattern: '%x{testStringToken}',
        tokens: { testStringToken: 'cheese' },
      });

      expect(patternLayout({})).toEqual('cheese');
    });
  });

  describe('add layout', () => {
    test('should be able to add layout', () => {
      addLayout('test_layout', (config) => {
        expect(config).toEqual('test_config');

        return function (loggingEvent: LoggingEvent) {
          return `TEST LAYOUT >${loggingEvent.data}`;
        };
      });
    });
  });
});
