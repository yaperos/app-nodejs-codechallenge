// Generic function to get enum key from value
export const getEnumKey = <T extends Record<keyof T, number>>(
  enumObject: T,
  value: number,
): keyof T | undefined => {
  const reverseMapping: Record<number, keyof T> = Object.entries(
    enumObject,
  ).reduce(
    (acc, [key, val]: any) => {
      acc[val] = key as keyof T;
      return acc;
    },
    {} as Record<number, keyof T>,
  );

  return reverseMapping[value];
};
