import {HttpException, HttpStatus, Inject, Injectable} from '@nestjs/common';
import {ClientKafka} from "@nestjs/microservices";
import {StripeService} from "../stripe/stripe.service";

@Injectable()
export class TransactionService {
    constructor(
        @Inject('KAFKA_SERVICE')
        private readonly _clientKafka: ClientKafka,
        private readonly _stripeService: StripeService,
    ) {}

    async newTransaction(data: any): Promise<void> {
        try {
            if (parseInt(data.amount) > 1000) {
                this._clientKafka.emit('topic.transaction.yape', JSON.stringify({transactionId: data.transactionId, status: 'rejected'}));
            } else {
                const resp = await this._stripeService.generateCharge(
                    data.stripePaymentMethodId,
                    data.stripeCostumerId,
                    parseInt(data.amount),
                    data.currency,
                    data.paymentMethodType,
                );
                this._clientKafka.emit('topic.transaction.yape', JSON.stringify({transactionId: data.transactionId, status: resp.status}));
            }
        } catch (err) {
            throw new HttpException(err.message, HttpStatus.BAD_REQUEST);
        }
    }
}
