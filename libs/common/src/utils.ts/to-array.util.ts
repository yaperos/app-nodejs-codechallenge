export const toArray = <T>(text: string, defaultValue: [] = []): T[] => {
  let array: T[];
  try {
    array = JSON.parse(text);
  } catch (e) {
    console.log(e);
  }

  return array || defaultValue;
};
