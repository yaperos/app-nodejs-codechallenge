import { ValidationError } from '../infrastructure/middlewares/errorMiddleware';
export class Transaction {
    constructor(
        public readonly id: string,
        public readonly accountExternalIdDebit: string,
        public readonly accountExternalIdCredit: string,
        public readonly tranferTypeId: number,
        public readonly value: number,
        public status: 'pending' | 'approved' | 'rejected',
        public readonly createdAt: Date = new Date(),
        public readonly userId: string 
    ) {}

    // Lógica de negocio: validar el monto de la transacción
    public validateAmount(): void {
        if (this.value <= 0) throw new ValidationError('El monto de la transacción debe ser mayor que cero.');
    }

    // Lógica de negocio: Cambiar el estado
    public approve(): void {
        this.status = 'approved';
    }

    public reject(): void {
        this.status = 'rejected';
    }
}
