import { Request, Response, NextFunction } from 'express';
import { TransactionService } from '../application/TransactionService';
import { TransactionRepository } from '../infrastructure/repository/TransactionRepository';

export class TransactionController {
    private transactionService: TransactionService;

    constructor() {
        const transactionRepository = new TransactionRepository(); 
        this.transactionService = new TransactionService(transactionRepository); 
    }

    /**
     * @swagger
     * /transactions:
     *   post:
     *     summary: Crear una nueva transacción
     *     tags: [Transacciones]
     *     security:
     *       - BearerAuth: []
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             type: object
     *             properties:
     *               amount:
     *                 type: number
     *                 example: 100
     *               description:
     *                 type: string
     *                 example: "Pago de servicios"
     *     responses:
     *       201:
     *         description: Transacción creada exitosamente
     *       400:
     *         description: Error en los datos de entrada
     *       500:
     *         description: Error interno del servidor
     */
    createTransaction = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            
            const userId = (req as any).user.userId;
            
            const transaction = await this.transactionService.createTransaction(req.body, userId);

            res.status(201).json(transaction);
        } catch (error) {
            next(error);
        }
    }

    /**
     * @swagger
     * /transactions/{id}:
     *   get:
     *     summary: Obtener una transacción por ID
     *     tags: [Transacciones]
     *     parameters:
     *       - in: path
     *         name: id
     *         required: true
     *         schema:
     *           type: string
     *         description: ID de la transacción
     *     responses:
     *       200:
     *         description: Transacción obtenida exitosamente
     *       404:
     *         description: Transacción no encontrada
     *       500:
     *         description: Error interno del servidor
     */
    getTransactionById = async (req: Request<{ id: string }>, res: Response, next: NextFunction): Promise<void> => {
        try {
            // ID Opcional
            const { id } = req.query; 

            const transaction = await this.transactionService.obtainTransactions(id as string | undefined);

            res.status(200).json(transaction);
        } catch (error) {
            next(error);
        }
    }
}
