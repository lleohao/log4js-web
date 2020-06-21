import { addListener, addPreProcessingListener } from './configure';
import { LayoutFontColor } from './layouts';
import { anInteger, anObject, not, throwExceptionIf, validIdentifier } from './utils';

type LevelType = 'ALL' | 'TRACE' | 'DEBUG' | 'INFO' | 'WARN' | 'ERROR' | 'FATAL' | 'MARK' | 'OFF' | string;

type SimilarLevel = string | Level | { levelStr: string };

interface CustomLevel {
  value: number;
  colour: LayoutFontColor;
}

const BUILD_IN_LEVEL: Record<LevelType, Level> = {};

class Level {
  static levels: Level[] = [];

  constructor(public level: number, public levelStr: string, public colour: LayoutFontColor) {
    this.level = level;
    this.levelStr = levelStr;
    this.colour = colour;
  }

  /**
   * converts given String to corresponding Level
   * @param sArg - String value of Level OR Log4js.Level
   * @param [defaultLevel] - default Level, if no String representation
   */
  static getLevel(sArg: SimilarLevel, defaultLevel?: Level): Level {
    if (!sArg) {
      return defaultLevel;
    }

    if (sArg instanceof Level) {
      return sArg;
    }

    // a json-serialised level won't be an instance of Level (see issue #768)
    if (sArg instanceof Object && sArg.levelStr) {
      sArg = sArg.levelStr;
    }

    return BUILD_IN_LEVEL[sArg.toString().toUpperCase()] || defaultLevel;
  }

  static addLevels(customLevels: { [key: string]: CustomLevel }) {
    const levelKeys = Object.keys(customLevels);

    levelKeys.forEach((key) => {
      const levelStr = key.toUpperCase();

      BUILD_IN_LEVEL[levelStr] = new Level(customLevels[key].value, levelStr, customLevels[key].colour);

      const existingLevelIndex = Level.levels.findIndex((lvl) => lvl.levelStr === levelStr);

      if (existingLevelIndex > -1) {
        Level.levels[existingLevelIndex] = BUILD_IN_LEVEL[levelStr];
      } else {
        Level.levels.push(BUILD_IN_LEVEL[levelStr]);
      }
    });

    Level.levels.sort((a, b) => a.level - b.level);
  }

  toString() {
    return this.levelStr;
  }

  isLessThanOrEqualTo(otherLevel: SimilarLevel) {
    if (!(otherLevel instanceof Level)) {
      otherLevel = Level.getLevel(otherLevel);
    }

    return this.level <= (otherLevel as Level).level;
  }

  isGreaterThanOrEqualTo(otherLevel: SimilarLevel) {
    if (!(otherLevel instanceof Level)) {
      otherLevel = Level.getLevel(otherLevel);
    }

    return this.level >= (otherLevel as Level).level;
  }

  isEqualTo(otherLevel: SimilarLevel) {
    if (!(otherLevel instanceof Level)) {
      otherLevel = Level.getLevel(otherLevel);
    }

    return this.level === (otherLevel as Level).level;
  }
}

// Init builtin Level
Level.addLevels({
  ALL: { value: Number.MIN_VALUE, colour: 'grey' },
  TRACE: { value: 5000, colour: 'blue' },
  DEBUG: { value: 10000, colour: 'cyan' },
  INFO: { value: 20000, colour: 'green' },
  WARN: { value: 30000, colour: 'yellow' },
  ERROR: { value: 40000, colour: 'red' },
  FATAL: { value: 50000, colour: 'magenta' },
  MARK: { value: 9007199254740992, colour: 'grey' }, // 2^53
  OFF: { value: Number.MAX_VALUE, colour: 'grey' },
});

// Custom level check
addPreProcessingListener((config) => {
  const levelConfig = config.levels;
  const validColours: LayoutFontColor[] = [
    'white',
    'grey',
    'black',
    'blue',
    'cyan',
    'green',
    'magenta',
    'red',
    'yellow',
  ];

  if (levelConfig !== undefined) {
    throwExceptionIf(config, not(anObject(levelConfig)), 'levels must be an object');

    const newLevels = Object.keys(levelConfig);

    newLevels.forEach((levelName) => {
      throwExceptionIf(
        config,
        not(validIdentifier(levelName)),
        `level name "${levelName}" is not a valid identifier (must start with a letter, only contain A-Z,a-z,0-9,_)`
      );

      throwExceptionIf(config, not(anObject(levelConfig[levelName])), `level "${levelName}" must be an object`);

      throwExceptionIf(config, not(levelConfig[levelName].value), `level "${levelName}" must have a 'value' property`);

      throwExceptionIf(
        config,
        not(anInteger(levelConfig[levelName].value)),
        `level "${levelName}".value must have an integer value`
      );

      throwExceptionIf(
        config,
        not(levelConfig[levelName].colour),
        `level "${levelName}" must have a 'colour' property`
      );

      throwExceptionIf(
        config,
        not(validColours.indexOf(levelConfig[levelName].colour) > -1),
        `level "${levelName}".colour must be one of ${validColours.join(', ')}`
      );
    });
  }
});

addListener((config) => {
  Level.addLevels(config.levels);
});

export { Level, BUILD_IN_LEVEL as Levels, LevelType, CustomLevel };
