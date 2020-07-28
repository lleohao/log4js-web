/* eslint-disable @typescript-eslint/no-explicit-any,@typescript-eslint/ban-ts-comment */
import * as dateFormat from 'date-format';
import * as util from 'util';
import { LoggingEvent } from './loggingEvent';

/**
 * custom layout function
 */
type LayoutHandle = (loggingEvent: Partial<LoggingEvent> | any) => string;

/**
 * font style
 */
type LayoutFontStyle = 'bold' | 'italic' | 'underline' | 'inverse';

/**
 * font color
 */
type LayoutFontColor = 'white' | 'grey' | 'black' | 'blue' | 'cyan' | 'green' | 'magenta' | 'red' | 'yellow';

/**
 * font style
 */
type LayoutStyle = LayoutFontColor | LayoutFontStyle;

const styles: Record<LayoutStyle, number[]> = {
  // styles
  bold: [1, 22],
  italic: [3, 23],
  underline: [4, 24],
  inverse: [7, 27],
  // grayscale
  white: [37, 39],
  grey: [90, 39],
  black: [90, 39],
  // colors
  blue: [34, 39],
  cyan: [36, 39],
  green: [32, 39],
  magenta: [35, 39],
  red: [31, 39],
  yellow: [33, 39],
};

/**
 * Add start of colorize
 * @param style
 */
function colorizeStart(style?: LayoutStyle) {
  return style ? `\x1B[${styles[style][0]}m` : '';
}

/**
 * Add end of colorize
 * @param style
 */
function colorizeEnd(style?: LayoutStyle) {
  return style ? `\x1B[${styles[style][1]}m` : '';
}

/**
 * Taken from masylum's fork (https://github.com/masylum/log4js-node)
 */
function colorize(str: string, style: LayoutStyle) {
  return colorizeStart(style) + str + colorizeEnd(style);
}

function timestampLevelAndCategory(loggingEvent: Partial<LoggingEvent>, colour?: LayoutStyle) {
  return colorize(
    util.format(
      '[%s] [%s] %s - ',
      dateFormat.asString(loggingEvent.startTime),
      loggingEvent.level.toString(),
      loggingEvent.categoryName
    ),
    colour
  );
}

/**
 * layout log with time, level, category
 * @param loggingEvent
 */
const basicLayout: LayoutHandle = (loggingEvent: Partial<LoggingEvent>) => {
  // @ts-ignore
  return timestampLevelAndCategory(loggingEvent) + util.format(...loggingEvent.data);
};

/**
 * layout log with time, level, category and color
 * @param loggingEvent
 */
const colouredLayout: LayoutHandle = (loggingEvent: Partial<LoggingEvent>) => {
  // @ts-ignore
  return timestampLevelAndCategory(loggingEvent, loggingEvent.level.colour) + util.format(...loggingEvent.data);
};

export { LayoutHandle, LayoutFontColor, LayoutFontStyle, colouredLayout, basicLayout };
