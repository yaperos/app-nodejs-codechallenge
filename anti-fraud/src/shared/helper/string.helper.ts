import { v4 as uuidv4, validate } from 'uuid';

export class StringHelper {
  public static generateUUID(): string {
    return uuidv4();
  }

  public static isValidUUID(uuid: string): boolean {
    return validate(uuid);
  }
}
