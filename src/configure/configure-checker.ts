import { inspect } from 'util';
import { Configuration } from './configure';

const not = (thing: unknown) => !thing;

const anObject = (thing: unknown) => thing && typeof thing === 'object' && !Array.isArray(thing);

const throwExceptionIf = (config: unknown, checks: boolean | boolean[], message: string) => {
  const tests = Array.isArray(checks) ? checks : [checks];
  tests.forEach((test) => {
    if (test) {
      throw new Error(
        `Problem with log4js configuration: (${inspect(config, {
          depth: 5,
        })})` + ` - ${message}`
      );
    }
  });
};

/**
 * check log4js-web configure
 * @param configure
 */
export const configureChecker = (configure: Configuration): void => {
  /**
   * configuration must be na object
   */
  throwExceptionIf(configure, not(anObject(configure)), 'must be an object.');

  /**
   * configuration.categories must be na object
   */
  throwExceptionIf(configure, not(anObject(configure.categories)), 'categories must be an object.');

  /**
   * configuration.categories must define at least one categories
   */
  const categoryNames = Object.keys(configure.categories);
  throwExceptionIf(configure, not(categoryNames.length), 'must define at least one categories.');

  categoryNames.forEach((category) => {
    const categoryConfigure = configure.categories[category];

    throwExceptionIf(configure, not(categoryConfigure.appenders.length), 'must define at least one appender.');

    categoryConfigure.appenders.forEach((appender) => {
      throwExceptionIf(
        configure,
        not(appender.type),
        `appender "${inspect(appender)}" is not valid (must be an object with property "type")`
      );
    });
  });
};
