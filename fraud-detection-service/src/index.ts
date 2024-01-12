import express, { Request, Response } from 'express';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;

app.get('/', (req: Request, res: Response) => {
    res.send('Fraud-Transaction service.');
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT} -- Fraud detection Service`);
});
