import app from './app';
import { config } from './config';

app.listen(config.port, () => {
  console.log(`App is running on port ${config.port}`);
});
