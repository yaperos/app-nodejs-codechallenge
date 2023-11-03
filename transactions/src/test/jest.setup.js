import { Test } from '@nestjs/testing';
import { pgMemProvider } from './pg-mem.provider';

beforeAll(async () => {
  const moduleRef = await Test.createTestingModule({
    providers: [pgMemProvider],
  }).compile();

  const app = moduleRef.createNestApplication();
  // Realiza otras configuraciones de la aplicación NestJS aquí si es necesario

  await app.init();
});

afterAll(async () => {
  // Realiza tareas de limpieza o cierre de la aplicación aquí si es necesario
});
