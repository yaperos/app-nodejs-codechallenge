import { faker } from '@faker-js/faker';
import { Factory } from 'rosie';
import { User } from '../models';

export default Factory.define(User.tableName).attrs({
  name: faker.name.firstName(),
  password: 'password',
  email: faker.internet.email(),
  role_id: faker.datatype.number({ min: 1, max: 2 })
});
