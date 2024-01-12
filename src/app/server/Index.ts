import { Run } from './Run';

try {
  new Run().start().then();
} catch (error: any) {
  process.exit(1);
}

process.on('uncaughtException', (_err) => {
  process.exit(1);
});
