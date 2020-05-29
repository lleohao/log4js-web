import { stringify } from 'flatted';
import { Level } from './levels';

interface LoggingLocation {
  functionName?: string;
  fileName: string;
  lineNumber: number;
  columnNumber: number;
  callStack: string;
}

export class LoggingEvent implements LoggingLocation {
  startTime: Date;
  functionName: string;
  fileName: string;
  lineNumber: number;
  columnNumber: number;
  callStack: string;

  constructor(
    public categoryName: string,
    public level: Level,
    public data: Array<string | { message: string; stack: string[] }>,
    public context: Record<string, unknown> = {},
    location?: LoggingLocation
  ) {
    this.startTime = new Date();
    this.categoryName = categoryName;
    this.data = data;
    this.level = level;
    this.context = Object.assign({}, context);

    if (location) {
      this.functionName = location.functionName;
      this.fileName = location.fileName;
      this.lineNumber = location.lineNumber;
      this.columnNumber = location.columnNumber;
      this.callStack = location.callStack;
    }
  }

  serialise(): string {
    this.data = this.data.map((e) => {
      // JSON.stringify(new Error('test')) returns {}, which is not really useful for us.
      // The following allows us to serialize errors correctly.
      if (typeof e !== 'string') {
        e = Object.assign({ message: e.message, stack: e.stack }, e);
      }

      return e;
    });

    return stringify(this);
  }
}
