/* eslint-disable @typescript-eslint/no-explicit-any */
import { LayoutType } from './layouts';
import { CustomLevel, LevelType } from './levels';
import { anObject, not, throwExceptionIf } from './utils';

export type ListenerHandle = (config: Configuration) => void;

export interface AppendersConfig {
  type: string;
  layout?: {
    type: LayoutType;
    [key: string]: any;
  };
  [key: string]: any;
}

export interface Configuration {
  categories?: {
    [key: string]: {
      appenders: string[];
      level: LevelType;
    };
  };
  levels?: { [key: string]: CustomLevel };
  appenders: Record<string, AppendersConfig>;
}

const preProcessingListeners: ListenerHandle[] = [];
const listeners: ListenerHandle[] = [];

const addListener = (fn: ListenerHandle) => {
  listeners.push(fn);
};

const addPreProcessingListener = (fn: ListenerHandle) => {
  preProcessingListeners.push(fn);
};

const configure = (configuration: Configuration) => {
  throwExceptionIf(configuration, not(anObject(configuration)), 'must be an object');

  preProcessingListeners.forEach((l) => l(configuration));

  listeners.forEach((l) => l(configuration));
};

export { addListener, addPreProcessingListener, configure };
