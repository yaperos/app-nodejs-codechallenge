import { User } from './user';
import {UserEmail} from "./user-email";

export const USER_REPO = 'USER_REPO';

export interface IUserRepo {
  userExists(email: string): Promise<boolean>;
  getByEmail(email: string): Promise<User>;
  createUser(user: any, hashed: boolean): Promise<User>;
}
