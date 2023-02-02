import {Body, Controller, Get, Param, Post, UseGuards} from '@nestjs/common';
import {TxService} from "./tx.service";
import {TxCreateDto} from "@yape/yape-domain/dto/tx.create.dto";
import {AuthGuard} from "../auth/auth.guard";
import {User} from "../auth/user.decorator";
import {AuthDto} from "@yape/yape-domain/dto/auth.dto";

@Controller('tx')
export class TxController {
    constructor(private readonly txService: TxService) {
    }

    @UseGuards(AuthGuard)
    @Post()
    async create(@Body() tx: TxCreateDto, @User() user: AuthDto): Promise<any> {
        const id = await this.txService.create(tx, user);

        return {id}
    }

    @UseGuards(AuthGuard)
    @Get('/:id')
    async retrieve(@Param('id') id: string): Promise<any> {
        return await this.txService.retrieve(id);
    }
}
