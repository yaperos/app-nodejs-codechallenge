import Application from './app';

(async () => {
  try {
    await new Application().start();
  } catch (error) {
    console.log(error);
  }
})();
