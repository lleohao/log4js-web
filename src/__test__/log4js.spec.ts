import { addLayout, configure, getLogger } from '../log4js';

describe('log4js test', () => {
  test('getLogger should be defined', () => {
    expect(getLogger).toBeInstanceOf(Function);
  });

  test('addLayout should be defined', () => {
    expect(addLayout).toBeInstanceOf(Function);
  });

  test('configure should be defined', () => {
    expect(configure).toBeInstanceOf(Function);
  });
});
