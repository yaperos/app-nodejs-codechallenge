import {
  INestApplication,
  ValidationPipe,
} from '@nestjs/common';
import { Test } from '@nestjs/testing';
import * as pactum from 'pactum';
import { AppModule } from '../src/app.module';
import { CreateBalanceDto } from '../src/balance/dto';
import { PrismaService } from '../src/prisma/prisma.service';
import { CreateUserDto } from '../src/user/dto';

describe('App e2e', () => {
  let app: INestApplication;
  let prisma: PrismaService;

  beforeAll(async () => {
    const moduleRef =
      await Test.createTestingModule({
        imports: [AppModule],
      }).compile();

    app = moduleRef.createNestApplication();
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
      }),
    );
    await app.init();
    await app.listen(3000);

    prisma = app.get(PrismaService);
    await prisma.cleanDb();
    pactum.request.setBaseUrl(
      'http://localhost:3000',
    );
  });

  afterAll(() => {
    app.close();
  });

  describe('User', () => {
    describe('Get by Id', () => {
      it('should get user', () => {
        return pactum
          .spec()
          .get('/users/user1')
          .withHeaders({
            Authorization: 'Bearer $S{userAt}',
          })
          .expectStatus(200);
      });
    });

    describe('Create user', () => {
      it('should create user', () => {
        const dto: CreateUserDto = {
          name: 'Jose',
          email: 'josearanciba09@gmail.com',
        };
        return pactum
          .spec()
          .patch('/users')
          .withBody(dto)
          .expectStatus(200)
          .expectBodyContains(dto.name)
          .expectBodyContains(dto.email);
      });
    });
  });

  describe('Balances', () => {
    describe('Get balances', () => {
      it('should get balances', () => {
        return pactum
          .spec()
          .get('/balances')
          .expectStatus(200)
          .expectBody([]);
      });
    });

    describe('Create balance', () => {
      const dto: CreateBalanceDto = {
        userId: 'user1',
      };
      it('should create balance', () => {
        return pactum
          .spec()
          .post('/balances')
          .withHeaders({
            Authorization: 'Bearer $S{userAt}',
          })
          .withBody(dto)
          .expectStatus(201)
          .stores('balanceId', 'id');
      });
    });

    describe('Get balances', () => {
      it('should get balances', () => {
        return pactum
          .spec()
          .get('/balances')
          .withHeaders({
            Authorization: 'Bearer $S{userAt}',
          })
          .expectStatus(200)
          .expectJsonLength(1);
      });
    });

    describe('Get balance by id', () => {
      it('should get balance by id', () => {
        return pactum
          .spec()
          .get('/balances/{id}')
          .withPathParams('id', '$S{balanceId}')
          .withHeaders({
            Authorization: 'Bearer $S{userAt}',
          })
          .expectStatus(200)
          .expectBodyContains('$S{balanceId}');
      });
    });

    describe('Delete balance by id', () => {
      it('should delete balance', () => {
        return pactum
          .spec()
          .delete('/balances/{id}')
          .withPathParams('id', '$S{balanceId}')
          .withHeaders({
            Authorization: 'Bearer $S{userAt}',
          })
          .expectStatus(204);
      });
    });
  });
});
