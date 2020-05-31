import { LoggingEvent } from '../loggingEvent';

const recordedEvents: LoggingEvent[] = [];

function configure() {
  return function (logEvent: LoggingEvent) {
    recordedEvents.push(logEvent);
  };
}

function replay() {
  return recordedEvents.slice();
}

function reset() {
  recordedEvents.length = 0;
}

export { configure, replay, reset };
