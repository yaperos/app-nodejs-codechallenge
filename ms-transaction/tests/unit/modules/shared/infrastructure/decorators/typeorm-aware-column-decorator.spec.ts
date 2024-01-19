import { AwareColumn } from 'src/modules/shared/infrastructure/persistence/typeorm/typeorm-aware-column.decorator';
import { ColumnOptions } from 'typeorm';

describe('TypeOrmAwareColumn test', () => {
  it('should test AwareColumn', async () => {
    const mockOptions: Partial<ColumnOptions> = {};

    const getProperty = jest.fn().mockReturnValue('bool');
    const setProperty = jest.fn();
    Object.defineProperty(mockOptions, 'type', {
      get: getProperty,
      set: setProperty,
    });

    AwareColumn(mockOptions);

    expect(setProperty).toHaveBeenCalledTimes(1);
    expect(setProperty).toHaveBeenCalledWith('bool');
  });
});
