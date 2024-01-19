import { Criteria } from './criteria';

export abstract class CriteriaWithId extends Criteria {
  private id: string | null = null;
  private ids: Array<string> | null = null;

  public static createById<T extends CriteriaWithId>(
    this: new () => T,
    id: string,
  ): T {
    return new this().filterById(id);
  }

  public static createByIds<T extends CriteriaWithId>(
    this: new () => T,
    ids: Array<string>,
  ): T {
    return new this().filterByIds(ids);
  }

  public filterById(id: string): this {
    this.id = id;

    return this;
  }

  public getId(): string | null {
    return this.id;
  }

  public filterByIds(ids: Array<string>): this {
    this.ids = ids;

    return this;
  }

  public getIds(): Array<string> | null {
    return this.ids;
  }
}
