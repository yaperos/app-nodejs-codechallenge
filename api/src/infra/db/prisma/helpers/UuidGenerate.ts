import { v4 as uuidV4, validate } from 'uuid';
export class Uuid {
	static generate() {
		return uuidV4();
	}

	static validate(uuid: string) {
		return validate(uuid);
	}
}
