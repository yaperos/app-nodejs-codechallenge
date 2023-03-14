import { environment } from '../environment';
import { CacheConfig } from '../types';

export const cacheConfig: CacheConfig = {
  host: environment.cacheConfig.host,
  name: environment.cacheConfig.name,
  username: environment.cacheConfig.username,
  passsword: environment.cacheConfig.passsword,
  port: environment.cacheConfig.port,
  ttl: environment.cacheConfig.ttl,
  max: environment.cacheConfig.max,
};
