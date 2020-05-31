/* eslint-disable @typescript-eslint/no-explicit-any */
import { addPreProcessingListener, AppendersConfig, Configuration } from '../configure';
import { LoggingEvent } from '../loggingEvent';
import { anObject, not, throwExceptionIf } from '../utils';
import * as consoleAppender from './console';

type AppenderConfigure = (config: AppendersConfig) => (loggingEvent: LoggingEvent) => void;

// pre-load the core appenders so that webpack can find them
const coreAppenders: Map<string, any> = new Map();
coreAppenders.set('console', consoleAppender);

const appenders = new Map();
const appendersLoading = new Set();

const loadAppenderModule = (name: string) => {
  return coreAppenders.get(name);
};

const createAppender = (name: string, config: Configuration) => {
  const appenderConfig = config.appenders[name];
  const appenderModule: { configure: AppenderConfigure } = loadAppenderModule(appenderConfig.type);

  throwExceptionIf(
    config,
    not(appenderModule),
    `appender "${name}" is not valid (type "${appenderConfig.type}" could not be found)`
  );

  return appenderModule.configure(appenderConfig);
};

const getAppender = (name: string, config: Configuration) => {
  if (appenders.has(name)) return appenders.get(name);
  if (!config.appenders[name]) return false;
  if (appendersLoading.has(name)) throw new Error(`Dependency loop detected for appender ${name}.`);

  appendersLoading.add(name);
  const appender = createAppender(name, config);
  appendersLoading.delete(name);
  appenders.set(name, appender);
  return appender;
};

const setup = (config: Configuration) => {
  appenders.clear();
  const usedAppenders: string[] = [];

  Object.values(config.categories).forEach((category) => {
    usedAppenders.push(...category.appenders);
  });

  Object.keys(config.appenders).forEach((name) => {
    if (usedAppenders.includes(name)) {
      getAppender(name, config);
    }
  });
};

setup({
  appenders: {
    out: { type: 'console' },
  },
  categories: {
    default: {
      appenders: ['out'],
      level: 'trace',
    },
  },
});

addPreProcessingListener((config) => {
  throwExceptionIf(config, not(anObject(config.appenders)), 'must have a property "appenders" of type object.');

  const appenderNames = Object.keys(config.appenders);
  throwExceptionIf(config, not(appenderNames.length), 'must define at least one appender.');

  appenderNames.forEach((name) => {
    throwExceptionIf(
      config,
      not(config.appenders[name].type),
      `appender "${name}" is not valid (must be an object with property "type")`
    );
  });
});

addPreProcessingListener(setup);

export { appenders, AppenderConfigure };
