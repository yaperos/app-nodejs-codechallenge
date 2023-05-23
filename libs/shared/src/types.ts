// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Fn = (...args: any[]) => any;

export type NonFunctionPropertyNames<T> = {
  [K in keyof T]: T[K] extends Fn ? never : K;
}[keyof T];

export type NonFunctionProperties<T> = Pick<T, NonFunctionPropertyNames<T>>;

export type FunctionPropertyNames<T> = {
  [K in keyof T]: T[K] extends Fn ? K : never;
}[keyof T];
export type FunctionProperties<T> = {
  [K in FunctionPropertyNames<T>]: T[K] extends Fn ? T[K] : never;
};

export type ServiceInput<
  T extends object,
  K extends FunctionPropertyNames<T>,
  I extends number = 0
> = NonFunctionProperties<Parameters<FunctionProperties<T>[K]>[I]>;
