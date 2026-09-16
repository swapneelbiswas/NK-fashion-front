/**
 * Environment configuration for production builds.
 *
 * This configuration supports multiple targets:
 *  - dev     : Development API server
 *
 * To switch environment:
 *  1. Change the `target` value below to the desired environment.
 *  2. Rebuild the Angular app (`ng build --prod`) to apply changes.
 */
// eslint-disable-next-line import/no-unresolved
import { Environment, EnvConfig } from '@utils/environment.model';
type Target = 'dev';

/**
 * Current target environment.
 * Change this value to switch between dev/stage/live/local/device.
 */
const target: Target = 'dev';

const config: Record<Target, EnvConfig> = {
  /** Development API */
  dev: {
    api_url: 'http://localhost:5263',
    ws_url: 'http://localhost:4200/',
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
