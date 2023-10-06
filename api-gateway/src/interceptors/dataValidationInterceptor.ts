import { NestInterceptor, ExecutionContext, CallHandler, BadRequestException} from '@nestjs/common';
import { Observable, map } from 'rxjs';

export class DataValidationInterceptor implements NestInterceptor {
    intercept(context: ExecutionContext, handler: CallHandler): Observable<any> {
        const req = context.switchToHttp().getRequest();
        if (!req.body.accountExternalIdCredit || 
            !req.body.accountExternalIdDebit || 
            !req.body.tranferTypeId || 
            !req.body.values ) {
            throw new BadRequestException(
            'You did not send all the parameters',
            );
        }
        const CARDS_ID_LENGHT: number = 16;
        const INVALID_TRANSACTION_AMOUNT: number = 0;
        const idCreditLenght: number = req.body.accountExternalIdCredit.length;
        const idDebitLenght: number = req.body.accountExternalIdDebit.length;
        const transferTypeIdType: string = typeof req.body.tranferTypeId; //must be number

        if(idCreditLenght !== CARDS_ID_LENGHT){
            throw new BadRequestException(
                'Invalid Credit Card number size',
                )
        }

        if(idDebitLenght !== CARDS_ID_LENGHT){
            throw new BadRequestException(
                'Invalid Debit Card number size',
                )
        }

        if(transferTypeIdType !== "number"){
            throw new BadRequestException(
                'TransferIdType Must be number',
                )
        }

        if(req.body.values < INVALID_TRANSACTION_AMOUNT || 
            req.body.values == INVALID_TRANSACTION_AMOUNT){
            throw new BadRequestException(
                'You can not send 0 or negative amounts of money',
                )
        }

        if(typeof req.body.values !== "number" ){
            throw new BadRequestException(
                'Type of values must be number'
                )
        }

        return handler
        .handle()
        .pipe(map((data) => ({data})));
    }
}