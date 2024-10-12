const dayjs = require('dayjs');
const utc = require('dayjs/plugin/utc');
import { DateAdapter } from '../../../src/classes/DateAdapter';

dayjs.extend(utc);

describe('DateAdapter', () => {
  it('should return the current timestamp in UTC format', () => {
    const result = DateAdapter.nowUTC();
    const expectedFormat = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}Z$/;

    expect(result).toMatch(expectedFormat);
  });

  it('should return a valid date', () => {
    const result = DateAdapter.nowUTC();
    const date = dayjs.utc(result);

    expect(date.isValid()).toBe(true);
  });
});
