import { ExecutionContext, CallHandler } from '@nestjs/common';
import { LoggingInterceptor } from './logging.interceptor';

describe('LoggingInterceptor', () => {
  let interceptor: LoggingInterceptor;
  let mockContext: ExecutionContext;
  let mockCallHandler: CallHandler;

  beforeEach(() => {
    interceptor = new LoggingInterceptor();
    mockContext = {
      switchToHttp: jest.fn(() => ({
        getRequest: jest.fn(() => ({
          method: 'GET',
          url: '/test',
          headers: {},
        })),
      })),
    } as unknown as ExecutionContext;
    mockCallHandler = {
      handle: jest.fn(),
    } as CallHandler;
  });

  it('should be defined', () => {
    expect(interceptor).toBeDefined();
  });

  it('should log request information', async () => {
    // Arrange
    jest.spyOn(console, 'log').mockImplementation();

    // Act
    await interceptor.intercept(mockContext, mockCallHandler);

    // Assert
    expect(console.log).toHaveBeenCalledWith('[KAFKA EVENT]', {
      method: 'GET',
      url: '/test',
      headers: {},
    });
  });

  it('should call the next handler', async () => {
    // Act
    await interceptor.intercept(mockContext, mockCallHandler);

    // Assert
    expect(mockCallHandler.handle).toHaveBeenCalled();
  });
});
