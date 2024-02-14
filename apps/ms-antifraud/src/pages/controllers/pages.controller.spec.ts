import { Test, TestingModule } from '@nestjs/testing';
import { PagesController } from './pages.controller';
import { PagesService } from '../services/pages.service';

describe('AppController', () => {
  let pagesController: PagesController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [PagesController],
      providers: [PagesService],
    }).compile();

    pagesController = app.get<PagesController>(PagesController);
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      expect(pagesController.getHello()).toBe('Hello World!');
    });
  });
});
