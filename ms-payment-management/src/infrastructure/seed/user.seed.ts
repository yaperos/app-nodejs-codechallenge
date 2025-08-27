import { UserInterface } from 'src/domain/interfaces/user.inteface';
import { v4 as uuid } from 'uuid';

export const USER_SEED: UserInterface = {
    id: uuid(),
    name: 'Juan',
    email: 'juan@diaz.com',
}
