"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TransactionStatusController = void 0;
const index_1 = require("./index");
class TransactionStatusController {
    constructor() {
        this.getAll = async (req, res, next) => {
            try {
                const aTransactionStatusService = new index_1.TransactionStatusService();
                const params = { ...req.query };
                const response = await aTransactionStatusService.getAll(params);
                return res.status(200).json({ data: response });
            }
            catch (error) {
                next(error);
            }
        };
        this.create = async (req, res, next) => {
            try {
                const aTransactionStatusService = new index_1.TransactionStatusService();
                const params = { ...req.body };
                const response = await aTransactionStatusService.create(params);
                return res.status(200).json({ data: response });
            }
            catch (error) {
                next(error);
            }
        };
    }
}
exports.TransactionStatusController = TransactionStatusController;
