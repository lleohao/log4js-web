import { CategoryConfigure } from '../categories';

import { configureChecker } from './configure-checker';
import { setup } from './setup';

export interface Configuration {
  categories?: Record<string, CategoryConfigure>;
}

const configure = (configuration: Configuration) => {
  configureChecker(configuration);

  setup(configuration);
};

export { configure };
