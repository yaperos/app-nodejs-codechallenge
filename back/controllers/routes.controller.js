const sql = require("./sql.controller");
const parametros = require("./params.controller").parametros;
require("dotenv").config();
const CryptoJS = require("crypto-js");
var nodemailer = require('nodemailer');

let response = (tipo, req, res, resultado) => {
    return new Promise((resolve, reject) => {
        if (tipo == 1) {
            if (resultado == null) {
                res.status(200).json({ code: 200, data: null });
            } else {
                res.status(200).json({ code: 200, data: set(JSON.stringify(resultado)) });
            }
            resolve(200);
        } else if (tipo == 2) {
            res.status(200).json({
                msg: "Respuesta sin resultado",
                code: 404
            });
            resolve(200);
        } else if (tipo == 3) {
            res.status(200).json({ code: 200, msg: "Email Send" });
        }
        else if (tipo == 4) {
            res.status(200).json({ code: 410, msg: "Email don't Send" });
        }
    });
};

exports.putDinamicCall = async function (req, res) {
    let paramData = req.body;
    let data = await sql
        .query(
            paramData.SpName, parametros({ paramsSecurity: get(paramData.paramsSQL) }, paramData.sp))
        .then((resultado) => {
            return resultado;
        })
        .catch((err) => {
            {
                console.log('error', err)
                return null;
            }
        });
    if (data == null) {
        response(2, req, res, data);
    } else {
        response(1, req, res, data);
    }
}

/* metodos de seguridad para los servicios */
function set(value) {
    var key = CryptoJS.enc.Utf8.parse(process.env.KEY);
    var iv = CryptoJS.enc.Utf8.parse(process.env.IV);
    if (value != null) {
        var encrypted = CryptoJS.AES.encrypt(CryptoJS.enc.Utf8.parse(value.toString()), key,
            {
                keySize: 128 / 8,
                iv: iv,
                mode: CryptoJS.mode.CBC,
                padding: CryptoJS.pad.Pkcs7
            });
        return encrypted.toString();
    } else {
        return null;
    }
}
//The get method is use for decrypt the value.
function get(value) {
    var key = CryptoJS.enc.Utf8.parse(process.env.KEY);
    var iv = CryptoJS.enc.Utf8.parse(process.env.IV);
    if (value != null) {
        value.forEach(param => {
            Object.keys(param).forEach(index => {
                if (param[index] != null && param[index] != undefined) {
                    var decrypted = CryptoJS.AES.decrypt(param[index], key, {
                        keySize: 128 / 8,
                        iv: iv,
                        mode: CryptoJS.mode.CBC,
                        padding: CryptoJS.pad.Pkcs7
                    });
                    param[index] = decrypted.toString(CryptoJS.enc.Utf8);
                }
            });
        });
        return value;
    } else {
        return null;
    }
}
