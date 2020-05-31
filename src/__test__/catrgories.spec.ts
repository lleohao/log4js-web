import { appendersForCategory, getLevelForCategory, setLevelForCategory } from '../categories';

describe('categories test', () => {
  describe('appendersForCategory', () => {
    test('appendersForCategory', () => {
      expect(appendersForCategory).toBeDefined();
    });
  });

  describe('getLevelForCategory', () => {
    test('getLevelForCategory', () => {
      expect(getLevelForCategory).toBeDefined();
    });
  });

  describe('setLevelForCategory', () => {
    test('setLevelForCategory', () => {
      expect(setLevelForCategory).toBeDefined();
    });
  });
});
