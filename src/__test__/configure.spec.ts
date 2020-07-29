/* eslint-disable @typescript-eslint/ban-ts-comment */
import { configure } from '../configure';

describe('configure', () => {
  test('check configuration is an object', () => {
    expect(() => {
      // @ts-ignore
      configure(1);
    }).toThrowError('Problem with log4js configuration: (1) - must be an object');

    expect(() => {
      // @ts-ignore
      configure();
    }).toThrowError('Problem with log4js configuration: (undefined) - must be an object.');
  });

  test('check categories is an object', () => {
    expect(() => {
      // @ts-ignore
      configure({});
    }).toThrowError('Problem with log4js configuration: ({}) - categories must be an object.');
  });

  test('check must define at least one category', () => {
    expect(() => {
      configure({
        categories: {},
      });
    }).toThrowError('Problem with log4js configuration: ({ categories: {} }) - must define at least one category.');
  });

  test('check category must define at least one appender', () => {
    expect(() => {
      configure({
        categories: {
          // @ts-ignore
          test: {},
        },
      });
    }).toThrowError(
      'Problem with log4js configuration: ({ categories: { test: {} } }) - category {} is not valid (must be an object with property "appenders").'
    );

    expect(() => {
      configure({
        categories: {
          test: {
            appenders: [],
          },
        },
      });
    }).toThrowError(
      'Problem with log4js configuration: ({ categories: { test: { appenders: [] } } }) - category { appenders: [] } is not valid (must define at least one appender).'
    );
  });

  test('check appender must define type', () => {
    expect(() => {
      configure({
        categories: {
          test: {
            // @ts-ignore
            appenders: [{}],
          },
        },
      });
    }).toThrowError(
      `Problem with log4js configuration: ({
  categories: { test: { appenders: [ {} ] } }
}) - appender {} is not valid (must be an object with property "type").`.trim()
    );
  });

  test('check custom appender must define configure', () => {
    expect(() => {
      configure({
        categories: {
          test: {
            // @ts-ignore
            appenders: [{ type: 'other' }],
          },
        },
      });
    }).toThrowError(
      `Problem with log4js configuration: ({
  categories: {
    test: { appenders: [ { type: 'other' } ] }
  }
}) - appender "{ type: 'other' }" is not valid (must be an object with function property "configure").`.trim()
    );

    expect(() => {
      configure({
        categories: {
          test: {
            // @ts-ignore
            appenders: [{ type: 'console' }],
          },
        },
      });
    }).not.toThrowError();
  });
});
