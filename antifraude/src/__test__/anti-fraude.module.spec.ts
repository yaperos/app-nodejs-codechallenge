import { Test, TestingModule } from '@nestjs/testing';
import { INestMicroservice } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AntiFraudeModule } from '../anti-fraude.module';
import { config } from '../config';

describe('AntiFraudeModule', () => {
  let app: INestMicroservice;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports:[
        ConfigModule.forRoot({
          envFilePath: '.env.test',
          load: [config],
        }),
        AntiFraudeModule
      ]
    }).compile();
   
    app = module.createNestMicroservice({});
    await app.init();
  });
  
  it('should be defined', () => {
    expect(app).toBeDefined();
  })

});
