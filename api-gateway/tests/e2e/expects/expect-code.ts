export const expectBadRequestCode = (code: number) => {
  expect(code).toEqual(400);
};
