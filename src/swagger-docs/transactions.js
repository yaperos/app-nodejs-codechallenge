/**
 * @swagger
 * components:
 *   schemas:
 *     Transaction:
 *       type: object
 *       properties:
 *         transactionExternalId:
 *           type: string
 *           format: uuid
 *         transactionType:
 *           type: object
 *           properties:
 *             name:
 *               type: string
 *               description: Empty string on creation, "TRANSFER" on retrieval
 *         transactionStatus:
 *           type: object
 *           properties:
 *             name:
 *               type: string
 *               description: "pending | approved | rejected"
 *         value:
 *           type: number
 *         createdAt:
 *           type: string
 *           format: date-time
 * 
 *     TransactionCreateInput:
 *       type: object
 *       required:
 *         - accountExternalIdDebit
 *         - accountExternalIdCredit
 *         - tranferTypeId
 *         - value
 *       properties:
 *         accountExternalIdDebit:
 *           type: string
 *           example: "123-1345-1245-222"
 *         accountExternalIdCredit:
 *           type: string
 *           example: "123-1345-1245-111"
 *         tranferTypeId:
 *           type: integer
 *           example: 1
 *         value:
 *           type: number
 *           example: 500
 */

/**
 * @swagger
 * /transactions:
 *   post:
 *     summary: Create a new transaction
 *     tags:
 *       - Transactions
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/TransactionCreateInput'
 *     responses:
 *       201:
 *         description: Transaction created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Transaction'
 *       400:
 *         description: Missing required fields
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Missing required fields"
 */

/**
 * @swagger
 * /transactions/{transactionId}:
 *   get:
 *     summary: Retrieve a transaction by ID
 *     tags:
 *       - Transactions
 *     parameters:
 *       - in: path
 *         name: transactionId
 *         required: true
 *         schema:
 *           type: string
 *         description: UUID of the transaction
 *     responses:
 *       200:
 *         description: Transaction found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Transaction'
 *       404:
 *         description: Transaction not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Transaction not found"
 */
