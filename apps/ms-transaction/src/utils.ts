export const getObjectId = (base64: string) => {
  const decode = Buffer.from(base64, 'base64').toString('utf-8');
  return decode.split(':').slice(-1)[0];
};

export const toBase64 = (input: string) => {
  return Buffer.from(input).toString('base64');
};
