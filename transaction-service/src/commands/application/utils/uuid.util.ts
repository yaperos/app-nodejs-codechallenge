import { v4 as uuidv4 } from 'uuid';

export class UuidUtil {
    static generateUuid(): string {
        return uuidv4();
    }
}