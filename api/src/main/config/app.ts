import express from 'express';
import 'dotenv/config';
import setupMiddlewares from './middlewares';
import { router } from './routes';
import helmet from 'helmet';

const app = express();

setupMiddlewares(app);
app.disable('x-powered-by');
app.use(express.json());
app.use(helmet());
app.use(router);

export default app;
