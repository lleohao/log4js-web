/* eslint-disable @typescript-eslint/no-explicit-any */
import { appenders } from './appenders/appenders';
import { addPreProcessingListener, Configuration } from './configure';
import { Level, LevelType } from './levels';
import { anObject, not, throwExceptionIf } from './utils';

export interface Category {
  appenders: any[];
  level?: LevelType;
  inherit?: boolean;
  parent?: Category;
}

const categories = new Map();

/**
 * Add inherited config to this category.  That includes extra appenders from parent,
 * and level, if none is set on this category.
 * This is recursive, so each parent also gets loaded with inherited appenders.
 * Inheritance is blocked if a category has inherit=false
 * @param config
 * @param category the child category
 * @param categoryName dotted path to category
 * @return
 */
function inheritFromParent(config: Configuration, category: Category, categoryName: string) {
  if (category.inherit === false) return false;

  const lastDotIndex = categoryName.lastIndexOf('.');
  if (lastDotIndex < 0) return;

  const parentCategoryName = categoryName.substring(0, lastDotIndex);
  let parentCategory = config.categories[parentCategoryName];

  if (!parentCategory) {
    parentCategory = { inherit: true, appenders: [] };
  }

  inheritFromParent(config, parentCategory, parentCategoryName);

  if (
    !config.categories[parentCategoryName] &&
    parentCategory.appenders &&
    parentCategory.appenders.length &&
    parentCategory.level
  ) {
    config.categories[parentCategoryName] = parentCategory;
  }

  category.appenders = category.appenders || [];
  category.level = category.level || parentCategory.level;

  parentCategory.appenders.forEach((ap) => {
    if (!category.appenders.includes(ap)) {
      category.appenders.push(ap);
    }
  });

  category.parent = parentCategory;
}

/**
 * Walk all categories in the config, and pull down any configuration from parent to child.
 * This includes inherited appenders, and level, where level is not set.
 * Inheritance is skipped where a category has inherit=false.
 * @param config
 */
function addCategoryInheritance(config: Configuration) {
  if (!config.categories) return;
  const categoryNames = Object.keys(config.categories);

  categoryNames.forEach((name) => {
    const category = config.categories[name];
    inheritFromParent(config, category, name);
  });
}

addPreProcessingListener((config) => addCategoryInheritance(config));

// check category config
addPreProcessingListener((config) => {
  throwExceptionIf(config, not(anObject(config.categories)), 'must have a property "categories" of type object.');

  const categoryNames = Object.keys(config.categories);
  throwExceptionIf(config, not(categoryNames.length), 'must define at least one category.');

  categoryNames.forEach((name) => {
    const category = config.categories[name];
    throwExceptionIf(
      config,
      [not(category.appenders), not(category.level)],
      `category "${name}" is not valid (must be an object with properties "appenders" and "level")`
    );

    throwExceptionIf(
      config,
      not(Array.isArray(category.appenders)),
      `category "${name}" is not valid (appenders must be an array of appender names)`
    );

    throwExceptionIf(
      config,
      not(category.appenders.length),
      `category "${name}" is not valid (appenders must contain at least one appender name)`
    );

    category.appenders.forEach((appender) => {
      throwExceptionIf(
        config,
        not(appenders.get(appender)),
        `category "${name}" is not valid (appender "${appender}" is not defined)`
      );
    });

    throwExceptionIf(
      config,
      not(Level.getLevel(category.level)),
      `category "${name}" is not valid (level "${category.level}" not recognised;` +
        ` valid levels are ${Level.levels.join(', ')})`
    );
  });
});

const setup = (config: Configuration) => {
  categories.clear();

  const categoryNames = Object.keys(config.categories);
  categoryNames.forEach((name) => {
    const category = config.categories[name];
    const categoryAppenders: any[] = [];
    category.appenders.forEach((appender) => {
      categoryAppenders.push(appenders.get(appender));
      categories.set(name, {
        appenders: categoryAppenders,
        level: Level.getLevel(category.level),
      });
    });
  });
};
setup({ categories: { default: { appenders: ['console'], level: 'OFF' } } });
addPreProcessingListener(setup);

const configForCategory = (category?: string): Category => {
  if (categories.has(category)) {
    return categories.get(category);
  }

  if (category.indexOf('.') > 0) {
    return configForCategory(category.substring(0, category.lastIndexOf('.')));
  }

  return configForCategory('default');
};

const appendersForCategory = (category: string) => configForCategory(category).appenders;

const getLevelForCategory = (category: string) => configForCategory(category).level;

const setLevelForCategory = (category: string, level: Level) => {
  let categoryConfig = categories.get(category);
  if (!categoryConfig) {
    const sourceCategoryConfig = configForCategory(category);
    categoryConfig = { appenders: sourceCategoryConfig.appenders };
  }
  categoryConfig.level = level;
  categories.set(category, categoryConfig);
};

export { appendersForCategory, getLevelForCategory, setLevelForCategory };
