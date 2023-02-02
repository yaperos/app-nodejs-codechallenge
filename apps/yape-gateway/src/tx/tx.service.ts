import { Inject, Injectable } from '@nestjs/common';
import {ClientProxy} from '@nestjs/microservices';
import {firstValueFrom} from "rxjs";
import {TxCreateDto} from "@yape/yape-domain/dto/tx.create.dto";
import {AuthDto} from "@yape/yape-domain/dto/auth.dto";

@Injectable()
export class TxService {
    constructor(
        @Inject('YAPE_TX_MICROSERVICE')
        private readonly txClient: ClientProxy,
    ) {}

    async create(tx: TxCreateDto, user: AuthDto): Promise<string> {
        return await firstValueFrom(this.txClient.send({cmd: 'tx.create'}, {tx, user}));
    }

    async retrieve(id: string): Promise<any> {
        return await firstValueFrom(this.txClient.send({cmd: 'tx.retrieve'}, {id}));
    }
}
