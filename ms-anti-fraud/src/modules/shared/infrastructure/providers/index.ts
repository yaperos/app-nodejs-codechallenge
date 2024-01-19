import { BROKER_PROVIDER_ALIAS } from 'src/modules/shared/domain/providers/broker.provider';

import { KafkaBrokerProvider } from './kafka-broker.provider';

export const Providers = [
  {
    provide: BROKER_PROVIDER_ALIAS,
    useClass: KafkaBrokerProvider,
  },
];
