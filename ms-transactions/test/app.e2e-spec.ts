import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';
import { HealthService } from '../src/application/useCases/health/health.service';
import { healthMock } from './mock/health.mock';
import { LoggerService } from '../src/application/useCases/logger/logger.service';

describe('AppController (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(HealthService)
      .useValue({ getHealth: () => healthMock })
      .overrideProvider(LoggerService)
      .useValue({ report: () => {} })
      .compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('/ health (GET)', () => {
    return request(app.getHttpServer())
      .get('/health')
      .expect(200)
      .expect(healthMock);
  });
});
