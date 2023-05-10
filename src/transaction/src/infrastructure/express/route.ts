import express, { Request, Response } from "express";
import { TransactionDetail, TransactionSave } from "../../application";
import { KafkaInstance } from "../kafka";
import { PostgreSQLRepository } from "../sequelize";

const route = express.Router();

route.post('/', async (req: Request, res: Response) => {
    try {
        const repository = new PostgreSQLRepository()
        const kafka = KafkaInstance.getInstance();
        const transactionSave = new TransactionSave(repository, kafka)
        const { httpCode, data } = await transactionSave.run(req.body)
        res.status(httpCode).send(data);
    } catch (error) {
        console.log(error)
        res.status(500).send(error);
    }
});

route.get('/:id', async (req: Request, res: Response) => {
    try {
        const repository = new PostgreSQLRepository()
        const transactionDetail = new TransactionDetail(repository)
        const { httpCode, data } = await transactionDetail.run(req.params)
        res.status(httpCode).send(data);
    } catch (error) {
        console.log(error)
        res.status(500).send(error);
    }
});

export { route }