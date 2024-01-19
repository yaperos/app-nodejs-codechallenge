import { Collection } from 'src/modules/shared/domain/collection';

import { Test } from './test';

export class Tests extends Collection<Test> {
  constructor(private readonly tests: Array<Test>) {
    super();
  }

  public all(): Array<Test> {
    return this.tests;
  }
}
