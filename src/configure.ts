import { CustomLevel } from './levels';
import { anObject, not, throwExceptionIf } from './utils';

export type ListenerHandle = (config: Configuration) => void;

export interface Configuration {
  categories?: any;
  levels?: { [key: string]: CustomLevel };
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
