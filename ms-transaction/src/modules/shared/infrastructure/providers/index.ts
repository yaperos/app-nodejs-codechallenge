import { BROKER_PROVIDER_ALIAS } from 'src/modules/shared/domain/providers/broker.provider';

import { CACHE_PROVIDER_ALIAS } from '../../domain/providers/cache.provider';
import { CacheManagerProvider } from './cache-manager.provider';
import { KafkaBrokerProvider } from './kafka-broker.provider';

export const Providers = [
  {
    provide: CACHE_PROVIDER_ALIAS,
    useClass: CacheManagerProvider,
  },
  {
    provide: BROKER_PROVIDER_ALIAS,
    useClass: KafkaBrokerProvider,
  },
];
