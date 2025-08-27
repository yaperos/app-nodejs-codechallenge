import { Body, Controller, Post } from "@nestjs/common";
import { CreatePaymentDto } from "./dto/request/createPaymentDto.dto";
import { SavePaymentUseCase } from "src/application/usecase/operation/savePayment.usecase";

@Controller('payments')
export class SavePaymentController {
    constructor(
        private readonly savePaymentUseCase: SavePaymentUseCase
    ) { }

    @Post()
    savePayment(@Body() createPaymentDto: CreatePaymentDto) {
        return this.savePaymentUseCase.execute(createPaymentDto);
    }
}
