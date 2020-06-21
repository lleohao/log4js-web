import { configure } from '../configure';
import { Level, Levels } from '../levels';

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
      assertThat(all).isEqualTo([Level.getLevel('ALL')]);
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
      assertThat(trace).isEqualTo([Level.getLevel('TRACE')]);
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
      assertThat(debug).isEqualTo([Level.getLevel('DEBUG')]);
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
      assertThat(info).isEqualTo([Level.getLevel('INFO')]);
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
      assertThat(warn).isEqualTo([Level.getLevel('WARN')]);
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
      assertThat(error).isEqualTo([Level.getLevel('ERROR')]);
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
      assertThat(fatal).isEqualTo([Level.getLevel('FATAL')]);
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
      assertThat(mark).isEqualTo([Level.getLevel('MARK')]);
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
      assertThat(off).isEqualTo([Level.getLevel('OFF')]);
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

  test('isGreaterThanOrEqualTo', () => {
    const info = Levels.INFO;

    assertThat(info).isGreaterThanOrEqualTo(['all', 'trace', 'debug']);
    assertThat(info).isNotGreaterThanOrEqualTo(['warn', 'ERROR', 'Fatal', 'MARK', 'off']);
  });

  test('isLessThanOrEqualTo', () => {
    const info = Levels.INFO;
    assertThat(info).isNotLessThanOrEqualTo(['all', 'trace', 'debug']);
    assertThat(info).isLessThanOrEqualTo(['warn', 'ERROR', 'Fatal', 'MARK', 'off']);
  });

  test('isEqualTo', () => {
    const info = Levels.INFO;
    assertThat(info).isEqualTo(['info', 'INFO', 'iNfO']);
  });

  test('getLevel', () => {
    expect(Level.getLevel('debug')).toEqual(Levels.DEBUG);
    expect(Level.getLevel('DEBUG')).toEqual(Levels.DEBUG);
    expect(Level.getLevel('DeBuG')).toEqual(Levels.DEBUG);
    expect(Level.getLevel('cheese')).toBeFalsy();
    expect(Level.getLevel('cheese', Levels.DEBUG)).toEqual(Levels.DEBUG);

    expect(Level.getLevel('', Levels.DEBUG)).toEqual(Levels.DEBUG);
    expect(Level.getLevel(Levels.DEBUG)).toEqual(Levels.DEBUG);
    expect(Level.getLevel({ levelStr: 'DEBUG' })).toEqual(Levels.DEBUG);
  });

  test('toString', () => {
    expect(Levels.DEBUG.toString()).toEqual('DEBUG');
  });

  describe('Configuration.levels check', () => {
    test('levels should be an object', () => {
      expect(() => {
        configure({
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          levels: '',
        });
      }).toThrow('levels must be an object');
    });

    test('level name should contain A-Z,a-z,0-9,_', () => {
      expect(() => {
        configure({
          levels: {
            'a@': {
              value: 1,
              colour: 'white',
            },
          },
        });
      }).toThrow('level name "a@" is not a valid identifier (must start with a letter, only contain A-Z,a-z,0-9,_)');
    });

    test('level config should be an object', () => {
      expect(() => {
        configure({
          levels: {
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            name: '',
          },
        });
      }).toThrow('level "name" must be an object');
    });

    test('level config should have value property', () => {
      expect(() => {
        configure({
          levels: {
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            name: {
              colour: 'white',
            },
          },
        });
      }).toThrow(/level "name" must have a 'value' property/);
    });

    test('level config value should be an integer', () => {
      expect(() => {
        configure({
          levels: {
            name: {
              // eslint-disable-next-line @typescript-eslint/ban-ts-comment
              // @ts-ignore
              value: '1',
            },
          },
        });
      }).toThrow('level "name".value must have an integer value');
    });

    test('level config should have colour property', () => {
      expect(() => {
        configure({
          levels: {
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            name: {
              value: 1,
            },
          },
        });
      }).toThrow(/level "name" must have a 'colour' property/);
    });

    test("level config colour property be one of ['white', 'grey' , 'black' , 'blue' , 'cyan' , 'green' , 'magenta' , 'red' , 'yellow']", () => {
      expect(() => {
        configure({
          levels: {
            name: {
              value: 1,
              // eslint-disable-next-line @typescript-eslint/ban-ts-comment
              // @ts-ignore
              colour: 'hhh',
            },
          },
        });
      }).toThrow(/level "name".colour must be one of white, grey, black, blue, cyan, green, magenta, red, yellow/);
    });
  });

  test('addLevels', () => {
    configure({
      levels: {
        custom: {
          value: 1,
          colour: 'white',
        },
        debug: {
          value: 2,
          colour: 'red',
        },
      },
    });

    expect(Levels['CUSTOM'].colour).toEqual('white');
    expect(Levels['CUSTOM'].level).toEqual(1);
    expect(Levels['CUSTOM'].levelStr).toEqual('CUSTOM');

    expect(Levels['DEBUG'].colour).toEqual('red');
    expect(Levels['DEBUG'].level).toEqual(2);
    expect(Levels['DEBUG'].levelStr).toEqual('DEBUG');
  });
});
