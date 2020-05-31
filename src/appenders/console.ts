import { AppendersConfig } from '../configure';
import { colouredLayout, layout as getLayout, LayoutHandle } from '../layouts';
import { LoggingEvent } from '../loggingEvent';
import { AppenderConfigure } from './appenders';

const consoleLog = console.log.bind(console);

function consoleAppender(layout: LayoutHandle) {
  return (loggingEvent: Partial<LoggingEvent>) => {
    consoleLog(layout(loggingEvent));
  };
}

const configure: AppenderConfigure = (config: AppendersConfig) => {
  let layout = colouredLayout;

  if (config.layout) {
    layout = getLayout(config.layout.type, config.layout);
  }

  return consoleAppender(layout);
};

export { configure };
