export const expectEnum = <T extends { [key: string]: string }>(enumType: T) =>
  expect.stringMatching(Object.values(enumType).join('|'));
