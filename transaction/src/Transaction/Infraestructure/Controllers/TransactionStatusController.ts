import {Inject, Injectable, OnModuleInit} from "@nestjs/common";
import {TransactionEventInterface} from "../../Domain/Events/TransactionEventInterface";

@Injectable()
export class TransactionStatusController implements OnModuleInit {
    constructor(
        @Inject('TransactionEventInterface')
        private readonly eventPublisher: TransactionEventInterface,
    ) {}

    async onModuleInit(): Promise<void> {
        await this.eventPublisher.subscribeTransactionCreated();
    }
}
