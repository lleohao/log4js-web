/* eslint-disable @typescript-eslint/no-explicit-any,@typescript-eslint/ban-ts-comment */
import * as dateFormat from 'date-format';
import { log } from 'util';
import * as util from 'util';
import { LoggingEvent } from './loggingEvent';

type LayoutHandle = (loggingEvent: Partial<LoggingEvent> | any) => string;

type LayoutType = 'basic' | 'colored' | 'coloured' | 'pattern' | 'dummy' | string;

type LayoutConfig = (config: any) => (loggingEvent: LoggingEvent) => string;

type LayoutFontStyle = 'bold' | 'italic' | 'underline' | 'inverse';

type LayoutFontColor = 'white' | 'grey' | 'black' | 'blue' | 'cyan' | 'green' | 'magenta' | 'red' | 'yellow';

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
  red: [91, 39],
  yellow: [33, 39],
};

function colorizeStart(style?: LayoutStyle) {
  return style ? `\x1B[${styles[style][0]}m` : '';
}

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

const basicLayout: LayoutHandle = (loggingEvent: Partial<LoggingEvent>) => {
  // @ts-ignore
  return timestampLevelAndCategory(loggingEvent) + util.format(...loggingEvent.data);
};

const colouredLayout: LayoutHandle = (loggingEvent: Partial<LoggingEvent>) => {
  // @ts-ignore
  return timestampLevelAndCategory(loggingEvent, loggingEvent.level.colour) + util.format(...loggingEvent.data);
};

const dummyLayout: LayoutHandle = (loggingEvent) => {
  return loggingEvent.data[0];
};

/**
 * PatternLayout
 * Format for specifiers is %[padding].[truncation][field]{[format]}
 * e.g. %5.10p - left pad the log level by 5 characters, up to a max of 10
 * both padding and truncation can be negative.
 * Negative truncation = trunc from end of string
 * Positive truncation = trunc from start of string
 * Negative padding = pad right
 * Positive padding = pad left
 *
 * Fields can be any of:
 *  - %r time in toLocaleTimeString format
 *  - %p log level
 *  - %c log category
 *  - %h hostname
 *  - %m log data
 *  - %d date in conscious formats
 *  - %% %
 *  - %n newline
 *  - %f filename
 *  - %l line number
 *  - %o column position
 *  - %s call stack
 *  - %x{<tokenname>} add dynamic tokens to your log. Tokens are specified in the tokens parameter
 *  - %X{<tokenname>} add dynamic tokens to your log. Tokens are specified in logger context
 * You can use %[ and %] to define a colored block.
 *
 * Tokens are specified as simple key:value objects.
 * The key represents the token name whereas the value can be a string or function
 * which is called to extract the value to put in the log message. If token is not
 * found, it doesn't replace the field.
 *
 * A sample token would be: { 'pid' : function() { return process.pid; } }
 *
 * Takes a pattern string, array of tokens and returns a layout function.
 * @param pattern
 * @param tokens
 *
 * @authors ['Stephan Strittmatter', 'Jan Schmidle']
 */
const patternLayout = (pattern: string, tokens?: Record<string, any>): LayoutHandle => {
  const TTCC_CONVERSION_PATTERN = '%r %p %c - %m%n';
  const regex = /%(-?[0-9]+)?(\.?-?[0-9]+)?([[\]cdhmnprxXyflos%])({([^}]+)})?|([^%]+)/;

  pattern = pattern || TTCC_CONVERSION_PATTERN;

  function categoryName(loggingEvent: Partial<LoggingEvent>, specifier?: string | number) {
    let loggerName = loggingEvent.categoryName;
    if (specifier) {
      const precision = parseInt('' + specifier, 10);
      const loggerNameBits = loggerName.split('.');
      if (precision < loggerNameBits.length) {
        loggerName = loggerNameBits.slice(loggerNameBits.length - precision).join('.');
      }
    }
    return loggerName;
  }

  function formatAsDate(loggingEvent: Partial<LoggingEvent>, specifier?: string) {
    let format = dateFormat.ISO8601_FORMAT;
    if (specifier) {
      format = specifier;
      // Pick up special cases
      if (format === 'ISO8601') {
        format = dateFormat.ISO8601_FORMAT;
      } else if (format === 'ISO8601_WITH_TZ_OFFSET') {
        format = dateFormat.ISO8601_WITH_TZ_OFFSET_FORMAT;
      } else if (format === 'ABSOLUTE') {
        format = dateFormat.ABSOLUTETIME_FORMAT;
      } else if (format === 'DATE') {
        format = dateFormat.DATETIME_FORMAT;
      }
    }
    // Format the date
    return dateFormat.asString(format, loggingEvent.startTime);
  }

  function hostname() {
    return location.hostname;
  }

  function formatMessage(loggingEvent: Partial<LoggingEvent>) {
    // @ts-ignore
    return util.format(...loggingEvent.data);
  }

  function endOfLine() {
    return '\n';
  }

  function logLevel(loggingEvent: Partial<LoggingEvent>) {
    return loggingEvent.level.toString();
  }

  function startTime(loggingEvent: Partial<LoggingEvent>) {
    return dateFormat.asString('hh:mm:ss', loggingEvent.startTime);
  }

  function startColour(loggingEvent: Partial<LoggingEvent>) {
    return colorizeStart(loggingEvent.level.colour);
  }

  function endColour(loggingEvent: Partial<LoggingEvent>) {
    return colorizeEnd(loggingEvent.level.colour);
  }

  function percent() {
    return '%';
  }

  function userDefined(loggingEvent: Partial<LoggingEvent>, specifier: string) {
    if (typeof tokens[specifier] !== 'undefined') {
      return typeof tokens[specifier] === 'function' ? tokens[specifier](loggingEvent) : tokens[specifier];
    }

    return null;
  }

  function contextDefined(loggingEvent: Partial<LoggingEvent>, specifier: string) {
    const resolver = loggingEvent.context[specifier];

    if (typeof resolver !== 'undefined') {
      return typeof resolver === 'function' ? resolver(loggingEvent) : resolver;
    }

    return null;
  }

  function fileName(loggingEvent: Partial<LoggingEvent>) {
    return loggingEvent.fileName || '';
  }

  function lineNumber(loggingEvent: Partial<LoggingEvent>) {
    return loggingEvent.lineNumber ? `${loggingEvent.lineNumber}` : '';
  }

  function columnNumber(loggingEvent: Partial<LoggingEvent>) {
    return loggingEvent.columnNumber ? `${loggingEvent.columnNumber}` : '';
  }

  function callStack(loggingEvent: Partial<LoggingEvent>) {
    return loggingEvent.callStack || '';
  }

  const replacers: Record<string, (loggingEvent: Partial<LoggingEvent>, specifier: any) => string> = {
    c: categoryName,
    d: formatAsDate,
    h: hostname,
    m: formatMessage,
    n: endOfLine,
    p: logLevel,
    r: startTime,
    '[': startColour,
    ']': endColour,
    '%': percent,
    x: userDefined,
    X: contextDefined,
    f: fileName,
    l: lineNumber,
    o: columnNumber,
    s: callStack,
  };

  function replaceToken(conversionCharacter: string, loggingEvent: Partial<LoggingEvent>, specifier?: any) {
    return replacers[conversionCharacter](loggingEvent, specifier);
  }

  function truncate(truncation: string, toTruncate: string) {
    let len;
    if (truncation) {
      len = parseInt(truncation.substr(1), 10);

      return len > 0 ? toTruncate.slice(0, len) : toTruncate.slice(len);
    }

    return toTruncate;
  }

  function pad(padding: string, toPad: string) {
    let len;
    if (padding) {
      if (padding.charAt(0) === '-') {
        len = parseInt(padding.substr(1), 10);
        // Right pad with spaces
        while (toPad.length < len) {
          toPad += ' ';
        }
      } else {
        len = parseInt(padding, 10);
        // Left pad with spaces
        while (toPad.length < len) {
          toPad = ` ${toPad}`;
        }
      }
    }
    return toPad;
  }

  function truncateAndPad(toTruncAndPad: string, truncation: string, padding: string) {
    let replacement = toTruncAndPad;
    replacement = truncate(truncation, replacement);
    replacement = pad(padding, replacement);
    return replacement;
  }

  return (loggingEvent: Partial<LoggingEvent>) => {
    let formattedString = '';
    let result;
    let searchString = pattern;

    while ((result = regex.exec(searchString)) !== null) {
      const padding = result[1];
      const truncation = result[2];
      const conversionCharacter = result[3];
      const specifier = result[5];
      const text = result[6];

      // Check if the pattern matched was just normal text
      if (text) {
        formattedString += text.toString();
      } else {
        // Create a raw replacement string based on the conversion
        // character and specifier
        const replacement = replaceToken(conversionCharacter, loggingEvent, specifier);
        formattedString += truncateAndPad(replacement, truncation, padding);
      }
      searchString = searchString.substr(result.index + result[0].length);
    }

    return formattedString;
  };
};

const layoutMarker: Record<LayoutType, (config?: any) => LayoutHandle> = {
  basic() {
    return basicLayout;
  },
  colored() {
    return colouredLayout;
  },
  coloured() {
    return colouredLayout;
  },
  pattern(config?: any) {
    return patternLayout(config && config.pattern, config && config.tokens);
  },
  dummy() {
    return dummyLayout;
  },
};

const layout = (type: LayoutType, config?: any): LayoutHandle => {
  return layoutMarker[type] && layoutMarker[type](config);
};

const addLayout = (layoutName: string, config: LayoutConfig) => {
  layoutMarker[layoutName] = config;
};

export {
  LayoutType,
  LayoutHandle,
  LayoutConfig,
  LayoutFontColor,
  LayoutFontStyle,
  layout,
  colouredLayout,
  basicLayout,
  dummyLayout,
  patternLayout,
  addLayout,
};
