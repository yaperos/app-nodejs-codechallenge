import { Inject, Injectable } from '@nestjs/common';
import {ClientProxy} from '@nestjs/microservices';
import {firstValueFrom, Observable} from "rxjs";
import {TxCreateDto} from "@yape/yape-domain/dto/tx.create.dto";

@Injectable()
export class TxService {
    constructor(
        @Inject('YAPE_TX_MICROSERVICE')
        private readonly txClient: ClientProxy,
    ) {}

    async create(tx: TxCreateDto): Promise<string> {
        return await firstValueFrom(this.txClient.send({cmd: 'tx.create'}, tx));
    }
}
