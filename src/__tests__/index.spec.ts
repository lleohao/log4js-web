import { configure, getLogger } from '../index';

describe('log4js test', () => {
  test('getLogger should defined', () => {
    expect(getLogger).toBeInstanceOf(Function);
  });

  test('configure should define', () => {
    expect(configure).toBeInstanceOf(Function);
  });
});
