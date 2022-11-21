export class MongoFilterMapper {
  static init(filter: any, dateFilters: Array<string> = ['created', 'updated']): any {
    const [queryFilter, filterWithDates] = this.splitFilters(filter, dateFilters);
    return this.applyDateFilters(queryFilter, filterWithDates);
  }

  private static splitFilters(filter: any, dateFilters: string[]): Array<any> {
    const filterWithDates: any = {};
    const queryFilter: any = {};
    for (const f in filter) {
      dateFilters.includes(f) ? (filterWithDates[f] = filter[f]) : (queryFilter[f] = filter[f]);
    }
    return [queryFilter, filterWithDates];
  }

  private static applyDateFilters(queryFilter: any, filterWithDates: any): Record<string, any> {
    for (const filter in filterWithDates) {
      const object: any = {};
      for (const f of filterWithDates[filter]) {
        object[f.action] = new Date(f.value);
      }
      queryFilter[filter] = object;
    }
    return queryFilter;
  }
}
