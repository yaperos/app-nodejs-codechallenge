import { Transaction } from "@api/entity";
import { MessageType } from "@api/types/message.type";

export class TransactionMessageCommand {
	private message: MessageType;

	constructor(private transac: Transaction) {
		this.message = new MessageType();
		// uuidv4
		this.message.id = this.uuidv4();
		this.message.accountExternalIdDebit = transac.accountExternalIdDebit;
		this.message.accountExternalIdCredit = transac.accountExternalIdCredit;
		this.message.tranferTypeId = transac.tranferTypeId;
		this.message.value = transac.value;
	}

	public toObject(): MessageType {
		return this.message;
	}

	static toMessageType(transac: Transaction): MessageType {
		return new TransactionMessageCommand(transac).toObject();
	}

	private uuidv4(): string {
	return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
		const r = Math.random() * 16 | 0;
		const v = c === 'x' ? r : (r & 0x3 | 0x8);
		return v.toString(16);
	});
}
}

