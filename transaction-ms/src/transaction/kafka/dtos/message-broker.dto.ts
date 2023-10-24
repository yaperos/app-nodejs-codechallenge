export class MessageBrokerDto<T> {
    type: string;
    date: Date;
    content: T;

    constructor(type: string, date: Date, content: T) {
        this.type = type;
        this.date = date;
        this.content = content;
    }

    toString(): string {
        return JSON.stringify(this);
    }
}