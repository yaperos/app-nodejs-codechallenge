import { Producer } from '../../src/shared/event/Producer';
import { LoggerService } from '../../src/shared/logger/logger.service';
import { getDataSourceToken } from '@nestjs/typeorm';
import { getDatasourceMock } from './bdMock';
import { EventInterface } from 'shared-library-challenge/build/events/EventInterface';
import { DataSourceEnum } from '../../src/shared/config/DataSourceEnum';

export const providersMock = () => [
  {
    provide: Producer,
    useValue: {
      client: {
        emit: jest.fn().mockResolvedValue(null),
      },
      emit: jest.fn().mockImplementation((event: EventInterface) => {
        return;
      }),
    },
  },
  {
    provide: 'MY_CLIENT_KAFKA',
    useValue: {},
  },
  {
    provide: LoggerService,
    useValue: { error: jest.fn(), log: jest.fn() },
  },
  {
    provide: getDataSourceToken(DataSourceEnum.db_yape),
    useValue: getDatasourceMock(),
  },
];
