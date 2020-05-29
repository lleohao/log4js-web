import { getLogger, configure } from '../index';

test('getLogger should defined', () => {
  expect(getLogger).toBeInstanceOf(Function);
});

test('configure should define', () => {
  expect(configure).toBeInstanceOf(Function);
});
