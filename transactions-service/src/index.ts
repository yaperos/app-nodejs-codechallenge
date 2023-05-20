import { App } from './app';

const start = async () => {
  const app = new App();
  await app.start();
};

start();
