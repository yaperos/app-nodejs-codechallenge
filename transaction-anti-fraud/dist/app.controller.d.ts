import { AppService } from './app.service';
import { ClientKafka } from '@nestjs/microservices';
declare class KillDragonMessage {
    dragonId: number;
    name: string;
    heroId: number;
}
export declare class AppController {
    private readonly appService;
    private readonly client;
    constructor(appService: AppService, client: ClientKafka);
    onModuleInit(): Promise<void>;
    getHello(): string;
    killDragon(message: KillDragonMessage): any;
    sendMessage(dragonId: number, name: string, heroId: number): void;
}

export {};
