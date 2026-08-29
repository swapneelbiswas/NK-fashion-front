// src/environments/environment.prod.ts

/**
 * Environment configuration for production builds.
 *
 * This configuration supports multiple targets:
 *  - dev     : Development API server
 *  - stage   : Staging API server
 *  - live    : Live/Production API server
 *  - local   : Localhost (for testing builds on local machine)
 *  - device  : Another device in the same network
 *
 * To switch environment:
 *  1. Change the `target` value below to the desired environment.
 *  2. Rebuild the Angular app (`ng build --prod`) to apply changes.
 */
// eslint-disable-next-line import/no-unresolved
import { Environment, EnvConfig } from '@utils/environment.model';
type Target = 'api';

/**
 * Current target environment.
 * Change this value to switch between dev/stage/live/local/device.
 */
const target: Target = 'api';

const config: Record<Target, EnvConfig> = {
  /** Live/Production API */
  api: {
    api_url: 'https://nk-fashion.com/api',
    ws_url: 'https://nk-fashion.com',
  },
};

/**
 * Exported environment object used throughout the Angular app.
 * - `production` flag enables Angular optimizations.
 * - `api_url` and `ws_url` come from the selected target environment.
 */
export const environment: Environment = {
  production: true,
  ...config[target],
};
