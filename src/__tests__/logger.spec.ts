import { Logger } from '../logger';

describe('logger', () => {
  test('constructor with no parameters', () => {
    expect(() => {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      new Logger();
    }).toThrow('No category provided');
  });
});
