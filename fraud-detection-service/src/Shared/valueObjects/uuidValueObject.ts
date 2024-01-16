export class UuidValueObject {
    private value: string;

    constructor(uuid: string) {
        if (!this.validateUuid(uuid)) {
            throw new Error('Invalid UUID format');
        }
        this.value = uuid;
    }

    private validateUuid(uuid: string): boolean {
        return true;
    }

    toString(): string {
        return this.value;
    }
}