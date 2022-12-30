import { faker } from '@faker-js/faker';
import { Factory } from 'rosie';
import { Role } from '../models';

export default Factory.define(Role.tableName).attrs({
  name: faker.name.firstName(),
});
