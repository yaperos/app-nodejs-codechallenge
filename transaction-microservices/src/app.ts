import express from 'express';
import router from './router';

const app = express();

app.disable('etag');
app.use(express.json());
app.use(router);

export default app;
