require("dotenv").config();
const CryptoJS = require("crypto-js");
const parametros = require("../controllers/params.controller").parametros;
const sql = require("../controllers/sql.controller");

async function login(req, res) {
    let paramData = req.body;
    const paramsSecurity = get(paramData.params);
    let data = await sql
    .query(
        'login', parametros({ paramsSecurity }, paramData.sp))
    .then((resultado) => {
        return resultado;
    })
    .catch((err) => {
        {
            console.log('error', err)
            return null;
        }
    });
    if (data == null || data.length == 0) {
        response(2, req, res, data);
    } else {
        response(1, req, res, data);
    }
}
let response = (tipo, req, res, resultado) => {
    return new Promise((resolve, reject) => {
        if (tipo == 1) {
            res.status(200).json({ code: 200, data: set(JSON.stringify(resultado)) });
            resolve(200);
        } else {
            res.status(200).json({ code: 400, msg: 'Credenciales invalidas' });
            resolve(200);
        }
    });
};
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

module.exports = { login };