import { v4 as uuidv4, validate as uuidValidate } from 'uuid';
import { GuidAdapter } from '../../../src/classes/GuidAdapter.class';

jest.mock('uuid', () => ({
  v4: jest.fn(),
  validate: jest.fn(),
}));

describe('GuidAdapter', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should create a new GUID', () => {
    const mockGuid = '550e8400-e29b-41d4-a716-446655440000';
    (uuidv4 as jest.Mock).mockReturnValue(mockGuid);

    const result = GuidAdapter.create();
    
    expect(result).toBe(mockGuid);
    expect(uuidv4).toHaveBeenCalled();
  });

  it('should return true for a valid GUID', () => {
    const validGuid = '550e8400-e29b-41d4-a716-446655440000';
    (uuidValidate as jest.Mock).mockReturnValue(true);
    const result = GuidAdapter.isGuid(validGuid);
    
    expect(result).toBe(true);
    expect(uuidValidate).toHaveBeenCalledWith(validGuid);
  });

  it('should return false for an invalid GUID', () => {
    const invalidGuid = 'invalid-guid';
    (uuidValidate as jest.Mock).mockReturnValue(false);

    const result = GuidAdapter.isGuid(invalidGuid);
    
    expect(result).toBe(false);
    expect(uuidValidate).toHaveBeenCalledWith(invalidGuid); 
  });
});
