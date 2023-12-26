import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller';
import { AppService } from './app.service';

/**
 * Describe el componente para generar el test unitario
 */
describe('AppController', () => {
  let appController: AppController;

  /** se deben importar todos los componentes antes de ejecutar el test*/
  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [AppService],
    }).compile();

    appController = app.get<AppController>(AppController);
  });

  /** se inicia el test unitario*/
  describe('root', () => {
    it('should return "Health"', () => {
      expect(appController.getHealth()).toBe('Health');
    });
  });
});
