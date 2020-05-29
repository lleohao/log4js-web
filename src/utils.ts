import * as util from 'util';

type Checker = (thing: unknown) => boolean;

const not: Checker = (thing: unknown) => !thing;

const anObject: Checker = (thing: unknown) => thing && typeof thing === 'object' && !Array.isArray(thing);

const validIdentifier: Checker = (thing: string) => /^[A-Za-z][A-Za-z0-9_]*$/g.test(thing);

const anInteger: Checker = (thing: unknown) => thing && typeof thing === 'number' && Number.isInteger(thing);

const throwExceptionIf = (
  config: unknown,
  checks: boolean | boolean[],

  message: string
) => {
  const tests = Array.isArray(checks) ? checks : [checks];
  tests.forEach((test) => {
    if (test) {
      throw new Error(
        `Problem with log4js configuration: (${util.inspect(config, {
          depth: 5,
        })})` + ` - ${message}`
      );
    }
  });
};

export { not, anObject, validIdentifier, anInteger, throwExceptionIf };
