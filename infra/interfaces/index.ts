export interface EnvConfig {
  env: string;
  region: string;
  account: string;
}

export interface BasicStackProps extends EnvConfig {
  name: string;
}
