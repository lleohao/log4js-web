import { LoggingEvent } from './loggingEvent';

type ListenerHandle = (loggingEvent: LoggingEvent) => void;

const listeners: ListenerHandle[] = [];

const sendToListeners = (loggingEvent: LoggingEvent) => {
  listeners.forEach((l) => l(loggingEvent));
};

const send = (loggingEvent: LoggingEvent) => {
  sendToListeners(loggingEvent);
};

const onMessage = (listener: ListenerHandle) => {
  listeners.push(listener);
};

export { send, onMessage };
