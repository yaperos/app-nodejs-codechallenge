import { Test, TestingModule } from '@nestjs/testing';
import { HelloWorldController } from '../src/interfaces/http/hello-world/hello-world.controller';
import { HelloWorldService } from '../src/application/services/hello-world.service';
import { clientsModule } from './conftest';

describe('HelloWorldController', () => {
  let appController: HelloWorldController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [HelloWorldController],
      providers: [
        HelloWorldService,
        {
          provide: 'ANTIFRAUD_SERVICE',
          useValue: clientsModule,
        },
      ],
    }).compile();

    appController = app.get<HelloWorldController>(HelloWorldController);
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      expect(appController.getHello()).toBe('Hello World!');
    });
  });
});
