import { stringify } from 'flatted';
import { Level } from './levels';

export class LoggingEvent {
  startTime: Date;

  constructor(
    public categoryName: string,
    public level: Level,
    public data: Array<any>,
    public context: Record<string, any> = {}
  ) {
    this.startTime = new Date();
    this.categoryName = categoryName;
    this.data = data;
    this.level = level;
    this.context = Object.assign({}, context);
  }

  serialise(): string {
    this.data = this.data.map((e) => {
      // JSON.stringify(new Error('test')) returns {}, which is not really useful for us.
      // The following allows us to serialize errors correctly.
      if (e && e.message && e.stack) {
        e = Object.assign({ message: e.message, stack: e.stack }, e);
      }

      return e;
    });

    return stringify(this);
  }
}
