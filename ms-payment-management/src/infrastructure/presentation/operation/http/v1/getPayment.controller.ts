import { Controller, Get, Param } from "@nestjs/common";
import { GetPaymentUseCase } from "src/application/usecase/operation/getPayment.usecase";

@Controller('payments')
export class GetPaymentController {
    constructor(
        private readonly getPaymentUseCase: GetPaymentUseCase,
    ) { }

    @Get(':id')
    async getPayment(@Param('id') id: string) {
        return this.getPaymentUseCase.execute(id);
    }
}