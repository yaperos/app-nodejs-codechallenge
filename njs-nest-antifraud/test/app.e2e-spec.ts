import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { WinstonModule } from 'nest-winston';
import { LoggerConfig, } from '../src/config';

const logger: LoggerConfig = new LoggerConfig();

describe('Test (e2e)', () => {
  let app: INestApplication;
  const mockUser = [
    {
      id: 1,
      name: 'test1',
      lastname: 'the-brand-1',
      email: 'the-category-1',
    },
    {
      id: 2,
      name: 'testing',
      lastname: 'the-brand-1',
      email: 'the-category-1',
    },
  ]
  const mockUserRepository = {
    getAllUsers: jest.fn().mockImplementation(() => Promise.resolve(mockUser)),
    saveUser: jest.fn().mockImplementation((dto) => {
      return {
        id: Math.random() * (1000 - 1) + 1,
        ...dto,
      };
    }),
    updateUser: jest.fn().mockImplementation((newUser) => { Promise.resolve(newUser) })
  };

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [WinstonModule.forRoot(logger.console())],
      controllers: [],
      providers: [],
    }).overrideProvider('UserRepository')
      .useValue(mockUserRepository)
      .compile();

    app = moduleFixture.createNestApplication();
    await app.init()
  });

  it('/ (GET)', () => {
    return request(app.getHttpServer())
      .get('/health')
      .expect(200)
      .expect('Content-Type', /json/)
      .expect(mockUser);
  });
  afterAll(async () => {
    await app.close();
  });


});
