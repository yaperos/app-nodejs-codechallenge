import { NestInterceptor, ExecutionContext, CallHandler, BadRequestException} from '@nestjs/common';
import { Observable, map } from 'rxjs';
import { IncomingTransaction } from 'src/transactions/dto/transactions.dto';

export class DataValidationInterceptor implements NestInterceptor {
    intercept(context: ExecutionContext, handler: CallHandler): Observable<any> {
        const req = context.switchToHttp().getRequest();
        if (!req.body.accountExternalIdCredit || 
            !req.body.accountExternalIdDebit || 
            !req.body.tranferTypeId || 
            !req.body.value ) {
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

        if(req.body.value < INVALID_TRANSACTION_AMOUNT || 
            req.body.value == INVALID_TRANSACTION_AMOUNT){
            throw new BadRequestException(
                'You can not send 0 or negative amounts of money',
                )
        }

        if(typeof req.body.value !== "number" ){
            throw new BadRequestException(
                'Type of value must be number'
                )
        }

        const incomingTransaction: IncomingTransaction = {
            accountExternalIdCredit: req.body.accountExternalIdCredit,
            accountExternalIdDebit: req.body.accountExternalIdDebit,
            tranferTypeId: req.body.tranferTypeId,
            value: req.body.value
        }

        return handler
        .handle()
        .pipe(map((data) => ({data, incomingTransaction })));
    }
}