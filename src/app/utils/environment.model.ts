// this is special case for use environment type script

export interface EnvConfig {
  api_url: string;
  ws_url: string;
}

export interface Environment extends EnvConfig {
  production: boolean;
}
