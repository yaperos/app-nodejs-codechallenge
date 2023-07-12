
export class Model {
  public constructor(params: Record<string, any>) {
    for (const key in params) {
      this[key] = params[key];
    }
  }

  public toString() {
    return JSON.stringify(this);
  }
}