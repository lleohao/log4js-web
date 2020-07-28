import { LayoutFontColor } from './layouts';

type LevelType = 'ALL' | 'TRACE' | 'DEBUG' | 'INFO' | 'WARN' | 'ERROR' | 'FATAL' | 'MARK' | 'OFF';

class Level {
  static levels: Level[] = [];

  constructor(public level: number, public levelStr: string, public colour: LayoutFontColor) {
    this.level = level;
    this.levelStr = levelStr;
    this.colour = colour;
  }

  toString() {
    return this.levelStr;
  }

  isLessThanOrEqualTo(otherLevel: Level) {
    return this.level <= otherLevel.level;
  }

  isGreaterThanOrEqualTo(otherLevel: Level) {
    return this.level >= otherLevel.level;
  }

  isEqualTo(otherLevel: Level) {
    return this.level === otherLevel.level;
  }
}

// Init builtin Level
const BUILD_IN_LEVEL: Record<LevelType, Level> = {
  ALL: new Level(Number.MIN_VALUE, 'ALL', 'grey'),
  DEBUG: new Level(10000, 'DEBUG', 'cyan'),
  ERROR: new Level(40000, 'ERROR', 'red'),
  FATAL: new Level(50000, 'FATAL', 'magenta'),
  INFO: new Level(20000, 'INFO', 'green'),
  MARK: new Level(9007199254740992, 'MARK', 'grey'),
  OFF: new Level(Number.MAX_VALUE, 'OFF', 'grey'),
  TRACE: new Level(5000, 'TRACE', 'blue'),
  WARN: new Level(30000, 'WARN', 'yellow'),
};

export { Level, BUILD_IN_LEVEL as Levels, LevelType };
