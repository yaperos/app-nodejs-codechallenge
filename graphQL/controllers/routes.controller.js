const sql = require("./sql.controller");
const parametros = require("./params.controller").parametros;
require("dotenv").config();

exports.readTransaction = async function (req, res) {
    let paramData = req.body;
    let data = await sql
        .query(
            paramData.SpName, parametros({ paramsSecurity: paramData.paramsSQL }
            ))
        .then((response) => {
            return response;
        })
        .catch((err) => {
            {
                console.log('error', err)
                return null;
            }
        });
    response(req, res, 'Transaction info', null, data);
}

exports.antifraud = async function (req, res, next) {
    try {
        let paramData = req.body;
        paramData = paramData.paramsSQL;
        let value = 0;
        for (let i = 0; i < paramData.length; i++) {
            const element = paramData[i];
            if (element.spName === 'cash') {
                value = element.spParam;
                break;
            }
        }
        if (value <= 1000 && value > 0) {
            response(req, res, 'Transaction Pending', 1, null);
        } else {
            response(req, res, 'Transaction reject because over 1000', 3, null);
        }
    } catch (error) {
        next(error);
    }
}
exports.approvedTransaction = async function (req, res, next) {
    let paramData = req.body;
    let data = await sql
        .query(
            paramData.SpName, parametros({ paramsSecurity: paramData.paramsSQL }))
        .then((response) => {
            return response;
        })
        .catch((err) => {
            {
                console.log('error', err)
                return null;
            }
        });
    if (paramData.paramsSQL[1].spParam == 2) {
        response(req, res, 'Transaction approved', 2, null);
    } else {
        response(req, res, 'Transaction Reject', 3, null);
    }
}

let response = (req, res, msg, state, data) => {
    return new Promise((resolve, reject) => {
        try {
            res.status(200).json({ msg: msg, state: state, data: data });
            resolve(200);
        } catch (error) {
            console(error)
        }
    });
};