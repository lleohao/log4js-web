import { setupCategories, getCategoryByCategoryName } from '../categories';

describe('categories', () => {
  test('check default category is defined', () => {
    expect(getCategoryByCategoryName('default')).toBeDefined();
  });

  test('getCategoryByCategoryName', () => {
    expect(getCategoryByCategoryName('default')).toEqual(getCategoryByCategoryName());

    setupCategories({
      categories: {
        other: {
          appenders: [{ type: 'other', level: 'DEBUG' }],
        },
      },
    });

    const otherCategory = getCategoryByCategoryName('other');
    expect(otherCategory.name).toEqual('other');
    expect(otherCategory.appenders[0].level.levelStr).toEqual('DEBUG');
  });
});
