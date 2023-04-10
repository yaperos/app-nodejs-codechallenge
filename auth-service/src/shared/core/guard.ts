export interface IGuardResult {
  valid: boolean;
  message?: string;
}

export interface IGuardArgument {
  [key: string]: any;
}

export class Guard {
  public static againstNullOrUndefined(
    argument: IGuardArgument = {},
  ): IGuardResult {
    const errors = Object.entries(argument).reduce(
      (errorList, [key, value]) => {
        if (value === null || value === undefined) {
          errorList.push(key);
        }
        return errorList;
      },
      [] as string[],
    );

    return {
      valid: errors.length === 0,
      message:
        errors.length > 0
          ? `${errors.join(', ')} cannot be null or undefined`
          : undefined,
    };
  }
}
