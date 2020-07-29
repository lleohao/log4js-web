import { CategoryConfigure } from '../categories';
import { configureChecker } from './configure-checker';
import { setupCategories } from '../categories';

export interface Configuration {
  categories?: Record<string, CategoryConfigure>;
}

const configure = (configuration: Configuration) => {
  configureChecker(configuration);

  setupCategories(configuration);
};

export { configure };
