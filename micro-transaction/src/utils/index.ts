

export function to<T>(promise: Promise<T>, errInfo?: string | object): Promise<[any, T] | T[]> {
  return promise
    .then((res) => [undefined, res])
    .catch((err) => {
      if (errInfo) {
        Object.assign(err, errInfo);
      }

      return [err, undefined];
    });
}
