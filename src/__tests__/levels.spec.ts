import { Level, Levels, LevelType } from '../levels';

function assertThat(level: Level) {
  function assertForEach(assertion: boolean, testFn: (level: Level) => boolean, otherLevels: Array<Level | string>) {
    otherLevels.forEach((other: Level) => {
      expect(testFn.call(level, other)).toEqual(assertion);
    });
  }

  return {
    isLessThanOrEqualTo(levels: Array<Level | string>) {
      assertForEach(true, level.isLessThanOrEqualTo, levels);
    },
    isNotLessThanOrEqualTo(levels: Array<Level | string>) {
      assertForEach(false, level.isLessThanOrEqualTo, levels);
    },
    isGreaterThanOrEqualTo(levels: Array<Level | string>) {
      assertForEach(true, level.isGreaterThanOrEqualTo, levels);
    },
    isNotGreaterThanOrEqualTo(levels: Array<Level | string>) {
      assertForEach(false, level.isGreaterThanOrEqualTo, levels);
    },
    isEqualTo(levels: Array<Level | string>) {
      assertForEach(true, level.isEqualTo, levels);
    },
    isNotEqualTo(levels: Array<Level | string>) {
      assertForEach(false, level.isEqualTo, levels);
    },
  };
}

describe('Levels', () => {
  describe('values', () => {
    test('should define some Levels', () => {
      expect(Levels['ALL']).toBeInstanceOf(Level);
      expect(Levels['TRACE']).toBeInstanceOf(Level);
      expect(Levels['DEBUG']).toBeInstanceOf(Level);
      expect(Levels['INFO']).toBeInstanceOf(Level);
      expect(Levels['WARN']).toBeInstanceOf(Level);
      expect(Levels['ERROR']).toBeInstanceOf(Level);
      expect(Levels['FATAL']).toBeInstanceOf(Level);
      expect(Levels['MARK']).toBeInstanceOf(Level);
      expect(Levels['OFF']).toBeInstanceOf(Level);
    });

    test('ALL', () => {
      const all = Levels['ALL'];

      assertThat(all).isLessThanOrEqualTo([
        Levels.ALL,
        Levels.TRACE,
        Levels.DEBUG,
        Levels.INFO,
        Levels.WARN,
        Levels.ERROR,
        Levels.FATAL,
        Levels.MARK,
        Levels.OFF,
      ]);
      assertThat(all).isNotGreaterThanOrEqualTo([
        Levels.TRACE,
        Levels.DEBUG,
        Levels.INFO,
        Levels.WARN,
        Levels.ERROR,
        Levels.FATAL,
        Levels.MARK,
        Levels.OFF,
      ]);
      assertThat(all).isEqualTo([Levels.ALL]);
      assertThat(all).isNotEqualTo([
        Levels.TRACE,
        Levels.DEBUG,
        Levels.INFO,
        Levels.WARN,
        Levels.ERROR,
        Levels.FATAL,
        Levels.MARK,
        Levels.OFF,
      ]);
    });

    test('TRACE', () => {
      const trace = Levels.TRACE;
      assertThat(trace).isLessThanOrEqualTo([
        Levels.DEBUG,
        Levels.INFO,
        Levels.WARN,
        Levels.ERROR,
        Levels.FATAL,
        Levels.MARK,
        Levels.OFF,
      ]);
      assertThat(trace).isNotLessThanOrEqualTo([Levels.ALL]);
      assertThat(trace).isGreaterThanOrEqualTo([Levels.ALL, Levels.TRACE]);
      assertThat(trace).isNotGreaterThanOrEqualTo([
        Levels.DEBUG,
        Levels.INFO,
        Levels.WARN,
        Levels.ERROR,
        Levels.FATAL,
        Levels.MARK,
        Levels.OFF,
      ]);
      assertThat(trace).isEqualTo([Levels.TRACE]);
      assertThat(trace).isNotEqualTo([
        Levels.ALL,
        Levels.DEBUG,
        Levels.INFO,
        Levels.WARN,
        Levels.ERROR,
        Levels.FATAL,
        Levels.MARK,
        Levels.OFF,
      ]);
    });

    test('DEBUG', () => {
      const debug = Levels.DEBUG;
      assertThat(debug).isLessThanOrEqualTo([
        Levels.INFO,
        Levels.WARN,
        Levels.ERROR,
        Levels.FATAL,
        Levels.MARK,
        Levels.OFF,
      ]);
      assertThat(debug).isNotLessThanOrEqualTo([Levels.ALL, Levels.TRACE]);
      assertThat(debug).isGreaterThanOrEqualTo([Levels.ALL, Levels.TRACE]);
      assertThat(debug).isNotGreaterThanOrEqualTo([
        Levels.INFO,
        Levels.WARN,
        Levels.ERROR,
        Levels.FATAL,
        Levels.MARK,
        Levels.OFF,
      ]);
      assertThat(debug).isEqualTo([Levels.DEBUG]);
      assertThat(debug).isNotEqualTo([
        Levels.ALL,
        Levels.TRACE,
        Levels.INFO,
        Levels.WARN,
        Levels.ERROR,
        Levels.FATAL,
        Levels.MARK,
        Levels.OFF,
      ]);
    });

    test('INFO', () => {
      const info = Levels.INFO;
      assertThat(info).isLessThanOrEqualTo([Levels.WARN, Levels.ERROR, Levels.FATAL, Levels.MARK, Levels.OFF]);
      assertThat(info).isNotLessThanOrEqualTo([Levels.ALL, Levels.TRACE, Levels.DEBUG]);
      assertThat(info).isGreaterThanOrEqualTo([Levels.ALL, Levels.TRACE, Levels.DEBUG]);
      assertThat(info).isNotGreaterThanOrEqualTo([Levels.WARN, Levels.ERROR, Levels.FATAL, Levels.MARK, Levels.OFF]);
      assertThat(info).isEqualTo([Levels.INFO]);
      assertThat(info).isNotEqualTo([
        Levels.ALL,
        Levels.TRACE,
        Levels.DEBUG,
        Levels.WARN,
        Levels.ERROR,
        Levels.FATAL,
        Levels.MARK,
        Levels.OFF,
      ]);
    });

    test('WARN', () => {
      const warn = Levels.WARN;
      assertThat(warn).isLessThanOrEqualTo([Levels.ERROR, Levels.FATAL, Levels.MARK, Levels.OFF]);
      assertThat(warn).isNotLessThanOrEqualTo([Levels.ALL, Levels.TRACE, Levels.DEBUG, Levels.INFO]);
      assertThat(warn).isGreaterThanOrEqualTo([Levels.ALL, Levels.TRACE, Levels.DEBUG, Levels.INFO]);
      assertThat(warn).isNotGreaterThanOrEqualTo([Levels.ERROR, Levels.FATAL, Levels.MARK, Levels.OFF]);
      assertThat(warn).isEqualTo([Levels.WARN]);
      assertThat(warn).isNotEqualTo([
        Levels.ALL,
        Levels.TRACE,
        Levels.DEBUG,
        Levels.INFO,
        Levels.ERROR,
        Levels.FATAL,
        Levels.OFF,
      ]);
    });

    test('ERROR', () => {
      const error = Levels.ERROR;
      assertThat(error).isLessThanOrEqualTo([Levels.FATAL, Levels.MARK, Levels.OFF]);
      assertThat(error).isNotLessThanOrEqualTo([Levels.ALL, Levels.TRACE, Levels.DEBUG, Levels.INFO, Levels.WARN]);
      assertThat(error).isGreaterThanOrEqualTo([Levels.ALL, Levels.TRACE, Levels.DEBUG, Levels.INFO, Levels.WARN]);
      assertThat(error).isNotGreaterThanOrEqualTo([Levels.FATAL, Levels.MARK, Levels.OFF]);
      assertThat(error).isEqualTo([Levels.ERROR]);
      assertThat(error).isNotEqualTo([
        Levels.ALL,
        Levels.TRACE,
        Levels.DEBUG,
        Levels.INFO,
        Levels.WARN,
        Levels.FATAL,
        Levels.MARK,
        Levels.OFF,
      ]);
    });

    test('FATAL', () => {
      const fatal = Levels.FATAL;
      assertThat(fatal).isLessThanOrEqualTo([Levels.MARK, Levels.OFF]);
      assertThat(fatal).isNotLessThanOrEqualTo([
        Levels.ALL,
        Levels.TRACE,
        Levels.DEBUG,
        Levels.INFO,
        Levels.WARN,
        Levels.ERROR,
      ]);
      assertThat(fatal).isGreaterThanOrEqualTo([
        Levels.ALL,
        Levels.TRACE,
        Levels.DEBUG,
        Levels.INFO,
        Levels.WARN,
        Levels.ERROR,
      ]);
      assertThat(fatal).isNotGreaterThanOrEqualTo([Levels.MARK, Levels.OFF]);
      assertThat(fatal).isEqualTo([Levels.FATAL]);
      assertThat(fatal).isNotEqualTo([
        Levels.ALL,
        Levels.TRACE,
        Levels.DEBUG,
        Levels.INFO,
        Levels.WARN,
        Levels.ERROR,
        Levels.MARK,
        Levels.OFF,
      ]);
    });

    test('MARK', () => {
      const mark = Levels.MARK;
      assertThat(mark).isLessThanOrEqualTo([Levels.OFF]);
      assertThat(mark).isNotLessThanOrEqualTo([
        Levels.ALL,
        Levels.TRACE,
        Levels.DEBUG,
        Levels.INFO,
        Levels.WARN,
        Levels.FATAL,
        Levels.ERROR,
      ]);
      assertThat(mark).isGreaterThanOrEqualTo([
        Levels.ALL,
        Levels.TRACE,
        Levels.DEBUG,
        Levels.INFO,
        Levels.WARN,
        Levels.ERROR,
        Levels.FATAL,
      ]);
      assertThat(mark).isNotGreaterThanOrEqualTo([Levels.OFF]);
      assertThat(mark).isEqualTo([Levels.MARK]);
      assertThat(mark).isNotEqualTo([
        Levels.ALL,
        Levels.TRACE,
        Levels.DEBUG,
        Levels.INFO,
        Levels.WARN,
        Levels.ERROR,
        Levels.FATAL,
        Levels.OFF,
      ]);
    });

    test('OFF', () => {
      const off = Levels.OFF;
      assertThat(off).isNotLessThanOrEqualTo([
        Levels.ALL,
        Levels.TRACE,
        Levels.DEBUG,
        Levels.INFO,
        Levels.WARN,
        Levels.ERROR,
        Levels.FATAL,
        Levels.MARK,
      ]);
      assertThat(off).isGreaterThanOrEqualTo([
        Levels.ALL,
        Levels.TRACE,
        Levels.DEBUG,
        Levels.INFO,
        Levels.WARN,
        Levels.ERROR,
        Levels.FATAL,
        Levels.MARK,
      ]);
      assertThat(off).isEqualTo([Levels.OFF]);
      assertThat(off).isNotEqualTo([
        Levels.ALL,
        Levels.TRACE,
        Levels.DEBUG,
        Levels.INFO,
        Levels.WARN,
        Levels.ERROR,
        Levels.FATAL,
        Levels.MARK,
      ]);
    });
  });

  test('toString', () => {
    expect(Levels.DEBUG.toString()).toEqual('DEBUG');
  });

  test('getLevel', () => {
    ['ALL', 'TRACE', 'DEBUG', 'INFO', 'WARN', 'ERROR', 'FATAL', 'MARK', 'OFF'].forEach((level) => {
      expect(Level.getLevel(level as LevelType).levelStr).toEqual(level);
    });

    expect(() => {
      Level.getLevel('OTHER' as LevelType);
    }).toThrow("OTHER isn't one of ALL, TRACE, DEBUG, INFO, WARN, ERROR, FATAL, MARK, OF");
  });
});
