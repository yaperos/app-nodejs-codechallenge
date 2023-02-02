import {Module} from '@nestjs/common';
import {ClientsModule, Transport} from '@nestjs/microservices';
import {TxController} from "./tx.controller";
import {TxService} from "./tx.service";

@Module({
    imports: [
        ClientsModule.register([
            {
                name: 'YAPE_TX_MICROSERVICE',
                transport: Transport.TCP,
                options: {
                    host: 'localhost',
                    port: 8082
                },
            },
        ]),
    ],
    controllers: [TxController],
    providers: [TxService],
})
export class TxModule {
}
