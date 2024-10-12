import { INestApplication } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { Swagger } from '../../../src/classes/Swagger.class';

jest.mock('@nestjs/swagger', () => ({
  SwaggerModule: {
    createDocument: jest.fn(),
    setup: jest.fn(),
  },
  DocumentBuilder: jest.fn().mockImplementation(() => ({
    setTitle: jest.fn().mockReturnThis(),
    setDescription: jest.fn().mockReturnThis(),
    setVersion: jest.fn().mockReturnThis(),
    addTag: jest.fn().mockReturnThis(),
    build: jest.fn().mockReturnValue({ some: 'document' }),
  })),
}));

describe('Swagger', () => {
  let app: INestApplication;

  beforeEach(() => {
    app = {} as INestApplication;
  });

  it('should configure Swagger documentation correctly', () => {
    const mockDocument = { some: 'document' };
    (SwaggerModule.createDocument as jest.Mock).mockReturnValue(mockDocument);

    Swagger.config(app);

    expect(DocumentBuilder).toHaveBeenCalled();
    expect(SwaggerModule.createDocument).toHaveBeenCalledWith(app, expect.anything());
    expect(SwaggerModule.setup).toHaveBeenCalledWith('docs', app, mockDocument);
	});
});