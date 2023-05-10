import { IRepository } from "../domain/repository"
import { ValidationRequest } from "../shared/decorators"
import { HttpResponse } from "../shared/dto"
import { HTTP_STATUS } from "../shared/enum"
import { ValidateRequestDetail } from "./validation.request.detail"

class TransactionDetail {
    constructor(
        private readonly repository: IRepository
    ) { }
    
    @ValidationRequest(ValidateRequestDetail)
    async run(payload: any) {
        const { status, data, error } = await this.repository.transactionDetail(payload.id)
        if (!status) return new HttpResponse(HTTP_STATUS.INTERNAL_ERROR, error)
        if (!data) return new HttpResponse(HTTP_STATUS.NO_CONTENT)
        return new HttpResponse(HTTP_STATUS.OK, data)
    }
}

export {
    TransactionDetail
}