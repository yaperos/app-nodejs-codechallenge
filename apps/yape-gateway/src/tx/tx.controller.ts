import {Body, Controller, Post} from '@nestjs/common';
import {TxService} from "./tx.service";
import {TxCreateDto} from "@yape/yape-domain/dto/tx.create.dto";

@Controller('tx')
export class TxController {
    constructor(private readonly txService: TxService) {
    }

    @Post()
    async create(@Body() tx: TxCreateDto): Promise<any> {
        const id = await this.txService.create(tx);

        return {id}
    }
}
