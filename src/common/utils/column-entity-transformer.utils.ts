import * as dayjs from 'dayjs';
import { ValueTransformer } from 'typeorm';

export const dayjsTransformer: ValueTransformer = {
  to: (entityValue: dayjs.Dayjs) => entityValue.toDate(),
  from: (databaseValue: Date) => dayjs(databaseValue),
};
