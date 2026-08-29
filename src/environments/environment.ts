import { Environment, EnvConfig } from '@utils/environment.model';

type Target = 'local' | 'api' | 'device' | 'dev' | 'stage' | 'live';

const target: Target = 'dev';

const config: Record<Target, EnvConfig> = {
  local: {
    api_url: 'http://localhost:3000',
    ws_url: 'http://localhost:4200/',
  },
  api: {
    api_url: 'http://localhost:4200/api',
    ws_url: 'http://localhost:4200/',
  },
  stage: {
    api_url: 'http://localhost:4200/stage',
    ws_url: 'http://localhost:4200/',
  },
  dev: {
    api_url: 'http://localhost:4200/api',
    ws_url: 'http://localhost:4200/',
  },
  device: {
    api_url: 'http://192.168.50.3:3000',
    ws_url: 'http://192.168.50.3:4200/',
  },
  live: {
    api_url: 'https://your-live-api.com',
    ws_url: 'https://your-live-ws.com',
  },
};

export const environment: Environment = {
  production: false,
  ...config[target],
};
