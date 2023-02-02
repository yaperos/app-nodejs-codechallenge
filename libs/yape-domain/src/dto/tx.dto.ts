export class TxDto {
    transactionExternalId: string;
    transactionType: TxType;
    transactionStatus: TxStatus
    value: number;
    createdAt: Date;
}

export class TxType {

    constructor(id: number) {
        this.id = id;
        this.name = this._name()
    }

    id: number;

    name: string;

    public _name() : string
    {
        switch (this.id || 0) {
            case 1:
                return 'SEND';
            case 2:
                return 'RECEIVED';
            default:
                return 'NONE';
        }
    }
}

export class TxStatus {
    constructor(id: number) {
        this.id = id;
        this.name = this._name()
    }
    id: number;
    name: string;

    private _name() : string
    {
        switch (this.id || 1) {
            case 2:
                return 'APPROVED';
            case 3:
                return 'REJECTED';
            default:
                return 'PENDING';
        }
    }
}
