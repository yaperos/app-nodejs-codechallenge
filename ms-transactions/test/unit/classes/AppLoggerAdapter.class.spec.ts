import { AppLoggerAdapter } from "../../../src/classes/AppLoggerAdapter.class";
import { DateAdapter } from "../../../src/classes/DateAdapter";

const winston = require('winston');

jest.mock('winston', () => {
  const originalWinston = jest.requireActual('winston');
  return {
    ...originalWinston,
    createLogger: jest.fn(() => ({
      info: jest.fn(),
      warn: jest.fn(),
      error: jest.fn(),
    })),
  };
});

describe('AppLoggerAdapter', () => {
  let logger: AppLoggerAdapter;
  let mockLogger: any;
	const data = { key: 'value' };

  beforeEach(() => {

    mockLogger = {
      info: jest.fn(),
      warn: jest.fn(),
      error: jest.fn(),
    };

    winston.createLogger.mockReturnValue(mockLogger);

    DateAdapter.nowUTC = jest.fn().mockReturnValue('2024-10-10T10:10:10Z');
    logger = new AppLoggerAdapter('test-trace-id', 'test-event');
  });

  it('should log info correctly', () => {
    const message = 'Info message';

    logger.logInfo(message, data);

    expect(mockLogger.info).toHaveBeenCalledWith({
      event: 'test-event',
      traceId: 'test-trace-id',
      message: 'Info message',
      data: { key: 'value' },
      createdAt: '2024-10-10T10:10:10Z',
    });
  });

  it('should log warning correctly', () => {
    const message = 'Warning message';

    logger.logWarning(message, data);

    expect(mockLogger.warn).toHaveBeenCalledWith({
      event: 'test-event',
      traceId: 'test-trace-id',
      message: 'Warning message',
      data: { key: 'value' },
      createdAt: '2024-10-10T10:10:10Z',
    });
  });

  it('should log error correctly', () => {
    const message = 'Error message';

    logger.logError(message, data);

    expect(mockLogger.error).toHaveBeenCalledWith({
      event: 'test-event',
      traceId: 'test-trace-id',
      message: 'Error message',
      data: { key: 'value' },
      createdAt: '2024-10-10T10:10:10Z',
    });
  });
});
