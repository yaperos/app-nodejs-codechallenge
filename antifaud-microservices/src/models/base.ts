import { Model } from 'objection';
import * as path from 'path';

import knex from '../db/knex';

Model.knex(knex);

export default class Base extends Model {
  static get modelPaths(): string[] {
    return [path.resolve('src/models')];
  }
}
