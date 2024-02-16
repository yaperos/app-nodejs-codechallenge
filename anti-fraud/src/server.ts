import cors from 'cors';
import express from 'express';

export const startServer = async (app: express.Application) => {
  app.use(cors());
  app.disable('x-powered-by');
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  app.get('/', async (req, res) => {
    res.json({ message: 'Hello World' });
  });
};
