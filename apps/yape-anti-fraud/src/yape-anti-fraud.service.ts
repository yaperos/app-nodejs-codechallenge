import {Inject, Injectable} from '@nestjs/common';
import {ClientProxy} from "@nestjs/microservices";

@Injectable()
export class YapeAntiFraudService {

    constructor(
        @Inject('YAPE_TX_MICROSERVICE')
        private readonly txClient: ClientProxy) {
    }

    async validate(data: any) {
        const {id, value} = data;

        const status = { id, status: value <= 1000 ? 2 : 3}
        console.log('before emit tx validate');
        this.txClient.send({cmd: 'tx.validate'}, status).subscribe(
            (result) => console.log(result),
            (error) => console.log((error)) ,
            () => console.log('finish process')
        );
        console.log('after emit tx validate');

    }
}
