"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TransactionTypesController = void 0;
const index_1 = require("./index");
class TransactionTypesController {
    constructor() {
        this.getAll = async (req, res, next) => {
            try {
                const aTransactionTypesService = new index_1.TransactionTypesService();
                const params = { ...req.query };
                const response = await aTransactionTypesService.getAll(params);
                return res.status(200).json({ data: response });
            }
            catch (error) {
                next(error);
            }
        };
        this.create = async (req, res, next) => {
            try {
                const aTransactionTypesService = new index_1.TransactionTypesService();
                const params = { ...req.body };
                const response = await aTransactionTypesService.create(params);
                return res.status(200).json({ data: response });
            }
            catch (error) {
                next(error);
            }
        };
    }
}
exports.TransactionTypesController = TransactionTypesController;
