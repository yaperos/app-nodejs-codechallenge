import { ValueObject } from '../../shared/domain/value-object';
import { UserEmail } from './user-email';
import { UserPassword } from './user-password';
import { UserName } from './user-name';
import { UserLastname } from './user-lastname';
import { UserStatus } from './user-status';
import { Result } from '../../shared/core/result';
import { UserID } from './user-id';

export interface UserProps {
  id?: UserID;
  email?: UserEmail;
  password?: UserPassword;
  name?: UserName;
  lastName?: UserLastname;
  status?: UserStatus;
}

export class User implements UserProps {
  id?: UserID;
  email?: UserEmail;
  password?: UserPassword;
  name?: UserName;
  lastName?: UserLastname;
  status?: UserStatus;

  private constructor(props: UserProps) {
    this.id = props.id;
    this.email = props.email;
    this.password = props.password;
    this.name = props.name;
    this.lastName = props.lastName;
    this.status = props.status;
  }

  public static create(props: UserProps): Result<User> {
    const user = new User(props);
    return Result.ok<User>(user);
  }
}
