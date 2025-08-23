import { INestApplication, Injectable, OnModuleInit, OnModuleDestroy, Logger } from '@nestjs/common';
import { PrismaClient, Prisma } from '@prisma/client';

@Injectable()
export class PrismaService
    extends PrismaClient<Prisma.PrismaClientOptions, Prisma.LogLevel>
    implements OnModuleInit, OnModuleDestroy
{
    private readonly logger = new Logger(PrismaService.name);

    constructor() {
        super({
            log: [
                { emit: 'event', level: 'query' },
                { emit: 'event', level: 'error' },
                { emit: 'event', level: 'info' },
                { emit: 'event', level: 'warn' },
            ],
        });
    }

    async onModuleInit() {
        await this.$connect();
        this.registerLogger();
    }

    async onModuleDestroy() {
        await this.$disconnect();
    }

    async enableShutdownHooks(app: INestApplication) {
        // Solución al error de tipos
        process.on('beforeExit', async () => {
            this.logger.log('Received beforeExit event - closing application');
            await app.close();
        });
    }

    private registerLogger() {
        this.$on('query', (e) => {
            this.logger.debug(`Query: ${e.query} | Params: ${e.params} | Duration: ${e.duration}ms`);
        });

        this.$on('error', (e) => {
            this.logger.error(e.message);
        });

        this.$on('info', (e) => {
            this.logger.log(e.message);
        });

        this.$on('warn', (e) => {
            this.logger.warn(e.message);
        });
    }
}
