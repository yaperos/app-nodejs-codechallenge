import { ExecutionContext, CallHandler } from '@nestjs/common';
import { FormatResponseInterceptor } from './format-response.interceptor';
import { of } from 'rxjs';

describe('FormatResponseInterceptor', () => {
  let interceptor: FormatResponseInterceptor;
  let mockContext: ExecutionContext;
  let mockCallHandler: CallHandler;

  beforeEach(() => {
    interceptor = new FormatResponseInterceptor();
    mockContext = {
      switchToHttp: jest.fn(),
    } as unknown as ExecutionContext;
    mockCallHandler = {
      handle: jest.fn(),
    } as CallHandler;
  });

  it('should be defined', () => {
    expect(interceptor).toBeDefined();
  });

  it('should format response data using map operator', (done) => {
    // Arrange
    const responseData = { message: 'Data formatted successfully' };
    jest
      .spyOn(mockCallHandler, 'handle')
      .mockImplementation(() => of(responseData));

    // Act
    interceptor
      .intercept(mockContext, mockCallHandler)
      .subscribe((formattedData) => {
        // Assert
        expect(formattedData).toEqual(responseData);
        done();
      });
  });
});
