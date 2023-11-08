import { mockGetTransaction, mockReturnGetTransaction } from '../../mock-data';
import { transformTransaction } from '../../../src/utils/transform.utils';

describe('Helpers Utils', () => {
  it('Transform response', () => {
    const transform = transformTransaction(mockGetTransaction as any);
    expect(transform).toEqual(mockReturnGetTransaction);
  });
});
