export class QueryBuilder {
  private readonly query = [] as any;

  private addStep(step: string, data: Record<string, any> | string): QueryBuilder {
    this.query.push({
      [step]: data,
    });
    return this;
  }

  match(data: Record<string, any>): QueryBuilder {
    return this.addStep('$match', data);
  }

  group(data: Record<string, any>): QueryBuilder {
    return this.addStep('$group', data);
  }
  addFields(data: any): QueryBuilder {
    return this.addStep('$addFields', data);
  }

  sort(data: Record<string, any>): QueryBuilder {
    return this.addStep('$sort', data);
  }

  unwind(data: string | Record<string, any>): QueryBuilder {
    return this.addStep('$unwind', data);
  }

  lookup(data: Record<string, any>): QueryBuilder {
    return this.addStep('$lookup', data);
  }

  arrayElemAt(data: any): QueryBuilder {
    return this.addStep('$arrayElemAt', data);
  }

  project(data: Record<string, any>): QueryBuilder {
    return this.addStep('$project', data);
  }

  facet(data: Record<string, any>): QueryBuilder {
    return this.addStep('$facet', data);
  }

  build(): Record<string, any>[] {
    return this.query;
  }
}
