import { MessageStatusEnum } from "src/enum";

export class MessageResponse {
	id: string;

	status: MessageStatusEnum; // 'APPROVED' | 'REJECTED';
}