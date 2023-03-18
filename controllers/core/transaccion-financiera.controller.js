const { response } = require('express');
const logger = require('../../helpers/logger');
const { getMessage } = require('../../helpers/messages');
const TransaccionFinanciera = require('../../models/core/transaccion-financiera.model');
const { transactionStatus } = require('../../helpers/enums.js');

const insert = async(req, res = response) => {

    //Uso para cuidar transacciones, para el caso de mongoDB se debe configurar un replicaSet
    // const session = await OperacionFinanciera.startSession();
    // session.startTransaction();

    try {

        // const opts = { session };

        const transaccion_financiera = new TransaccionFinanciera(req.body);

        if (transaccion_financiera.value >= 1000 || transaccion_financiera.value < 0)
            transaccion_financiera.transactionStatusId = transactionStatus.Rejected.value;
        // else
        //TODO: comunicación con el microservicio antifraude

        // const modelo = await transaccion_financiera.save(opts);
        const modelo = await transaccion_financiera.save();

        // await session.commitTransaction();
        // session.endSession();

        return res.json({
            ok: true,
            msg: getMessage('msgInsertOk')
        });
    } catch (error) {

        // await session.abortTransaction();
        // session.endSession();

        const controller = "transaccion-financiera.controller.js -> insert";
        logger.logError(controller, req, error);

        return res.status(500).json({
            ok: false,
            msg: getMessage('msgError500')
        });
    }
}

const update = async(req, res = response) => {

    const id = req.params.id;
    const {
        transactionStatusId
    } = req.body;

    //Uso para cuidar transacciones, para el caso de mongoDB se debe configurar un replicaSet
    // const session = await OperacionFinanciera.startSession();
    // session.startTransaction();

    try {

        // const opts = { session };

        const transaccion_financiera = await TransaccionFinanciera.findById(id);

        transaccion_financiera.transactionStatusId = transactionStatusId;

        // const modelo = await transaccion_financiera.save(opts);
        const modelo = await transaccion_financiera.save();

        // await session.commitTransaction();
        // session.endSession();

        return res.json({
            ok: true,
            msg: getMessage('msgUpdateOk')
        });

    } catch (error) {

        // await session.abortTransaction();
        // session.endSession();

        const controller = "transaccion-financiera.controller.js -> update";
        logger.logError(controller, req, error);

        return res.status(500).json({
            ok: false,
            msg: getMessage('msgError500')
        });
    }
}

const getById = async(req, res) => {
    try {
        const id = req.params.id;
        const modelo = await TransaccionFinanciera.findById(id);

        res.json({
            ok: true,
            modelo,
        });
    } catch (error) {

        const controller = "transaccion-financiera.controller.js -> getById";
        logger.logError(controller, req, error);

        return res.status(500).json({
            ok: false,
            msg: getMessage('msgError500')
        });
    }
};

module.exports = {
    insert,
    update,
    getById,
}