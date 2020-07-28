import { basicLayout, colouredLayout } from '../layouts';
import { Levels } from '../levels';

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
});
