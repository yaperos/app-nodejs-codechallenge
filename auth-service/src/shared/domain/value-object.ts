interface ValueObjectProps {
  [key: string]: any;
}

export abstract class ValueObject<T extends ValueObjectProps> {
  public props: T;
  constructor(props: T) {
    const baseProps: any = {
      ...props,
    };
    this.props = baseProps;
  }

  public equals(vo?: ValueObject<T>): boolean {
    if (vo === null || vo === undefined) {
      return false;
    }
    if (vo.props === null || vo.props === undefined) {
      return false;
    }
    if (!(vo instanceof ValueObject)) {
      return false;
    }
    return JSON.stringify(vo.props) === JSON.stringify(this.props);
  }
}
