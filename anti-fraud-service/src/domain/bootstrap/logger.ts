export const logger = {
  log(message: any) {
    console.info(message);
  },

  error(error: Error | any) {
    console.error(error);
  },
};
