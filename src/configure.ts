/* eslint-disable @typescript-eslint/no-explicit-any */
import { Category } from './categories';
import { LayoutType } from './layouts';
import { CustomLevel } from './levels';
import { anObject, not, throwExceptionIf } from './utils';

export type ListenerHandle = (config: Configuration) => void;

export interface Appender {
  type: string;
  layout?: {
    type: LayoutType;
    [key: string]: any;
  };

  [key: string]: any;
}

export interface Configuration {
  categories?: Record<string, Category>;
  levels?: Record<string, CustomLevel>;
  appenders?: Record<string, Appender>;
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
