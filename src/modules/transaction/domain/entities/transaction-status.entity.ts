export class TransactionStatus {
    private id?: number;
    private name: string;

    /** Setters */

    public setId(id?: number) {
        this.id = id;
    }

    public setName(name?: string) {
        this.name = name ? name : "";
    }

    /** Getters */

    public getId(): number | undefined {
        return this.id;
    }

    public getName(): string {
        return this.name;
    }
}