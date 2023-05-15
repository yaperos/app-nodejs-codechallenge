import { User, UserProps } from '../../domain/user';
import { UserID } from '../../domain/user-id';
import { Result } from '../../../shared/core/result';

export interface Mapper<T> {}

export class UserMapper implements Mapper<User> {
  public static toDomain(raw: any): User {
    const userProps: UserProps = {
      id: raw.id,
      email: raw.email,
      password: raw.password,
      name: raw.name,
      lastName: raw.lastName,
      status: raw.status,
    };
    const values = Result.combine<UserProps>(userProps);

    if (values.isFailure) {
      throw new Error('User not found');
    }
    const userResult = User.create(values.getValue());
    if (userResult.isFailure) {
      throw new Error('User not found');
    }
    return userResult.getValue();
  }
}
