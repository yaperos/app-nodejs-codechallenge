import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller';

describe('AppController', () => {
  let controller: AppController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
    }).compile();

    controller = module.get<AppController>(AppController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('shold redirect to /graphql', () => {
    const resMock = {
      redirect: jest.fn(),
    };
    controller.redirect(resMock as any);

    expect(resMock.redirect).toHaveBeenCalled();
  });
});
