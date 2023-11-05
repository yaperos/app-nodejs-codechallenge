"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TransactionController = void 0;
const index_1 = require("./index");
class TransactionController {
    constructor() {
        this.getAll = async (req, res, next) => {
            try {
                const aTransactionService = new index_1.TransactionService();
                const params = { ...req.query };
                const response = await aTransactionService.getAll(params);
                return res.status(200).json({ data: response });
            }
            catch (error) {
                next(error);
            }
        };
        this.create = async (req, res, next) => {
            try {
                const aTransactionService = new index_1.TransactionService();
                const params = { ...req.body };
                const response = await aTransactionService.create(params);
                return res.status(200).json({ data: response });
            }
            catch (error) {
                next(error);
            }
        };
    }
}
exports.TransactionController = TransactionController;
