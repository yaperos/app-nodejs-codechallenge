import { BadGatewayException, BadRequestException } from "@nestjs/common"
import { validate } from "uuid"
import { DomainMessagesException } from "./domain-messages-exceptions"
import { AggregateRoot } from "@nestjs/cqrs"
import { TransactionCreatedEvent } from "./events/transaction-created.event"

export type TStatusTransaction = "PENDING" | "APPROVED" | "REJECTED"
export enum ETransferType {
    Type01 = 1,
    Type02 = 2,
    Type03 = 3
}

export interface ITransactionEssentials {
    readonly transactionId: string
    readonly accountExternalIdDebit: string
    readonly accountExternalIdCredit: string
    readonly transferTypeId: ETransferType
    readonly value: number
}

export interface ITransactionOptionals {
    status: TStatusTransaction
    readonly createdAt: Date
    updateAt: Date | undefined
}

export type TransactionProps = ITransactionEssentials & Partial<ITransactionOptionals>

export function getEnumKeyByEnumValue<T>(myEnum: T, enumValue: number): keyof T | string | null {
    const keys = Object.keys(myEnum).filter((x) => (myEnum as any)[x] === enumValue);
    return keys.length > 0 ? keys[0] : null;
}

export class Transaction extends AggregateRoot {
    private readonly transactionId: string
    private readonly accountExternalIdDebit: string
    private readonly accountExternalIdCredit: string
    private readonly transferTypeId: ETransferType
    private readonly value: number
    private status: TStatusTransaction
    private readonly createdAt: Date
    private updateAt: Date | undefined

    constructor(props: TransactionProps) {
        super()
        if (!validate(props.accountExternalIdCredit)) throw new BadRequestException(DomainMessagesException.ACCOUNT_EXTERNAL_ID_CREDIT)
        if (!validate(props.accountExternalIdDebit)) throw new BadRequestException(DomainMessagesException.ACCOUNT_EXTERNAL_ID_DEBIT)
        if (!validate(props.transactionId)) throw new BadRequestException(DomainMessagesException.TRANSACTION_ID)
        if (props.value < 0) throw new BadRequestException(DomainMessagesException.VALUE_NEGATIVE)

        Object.assign(this, props)
        if (!props.createdAt) this.createdAt = new Date()
        if (!props.status) this.status = "PENDING"

        this.apply(new TransactionCreatedEvent(props.transactionId, props.status, getEnumKeyByEnumValue(ETransferType, props.transferTypeId), props.value, props.createdAt))
    }

    get properties() {
        return {
            transactionId: this.transactionId,
            accountExternalIdDebit: this.accountExternalIdDebit,
            accountExternalIdCredit: this.accountExternalIdCredit,
            transferTypeId: this.transferTypeId,
            value: this.value,
            status: this.status,
            createdAt: this.createdAt,
            updateAt: this.updateAt
        }
    }

    update(status: TStatusTransaction) {
        this.status = status
        this.updateAt = new Date()
    }

}