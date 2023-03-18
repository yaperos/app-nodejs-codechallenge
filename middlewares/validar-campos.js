const { response } = require('express');
const { validationResult } = require('express-validator');

const validarCampos = (req, res = response, next) => {

    const validaciones = validationResult(req);

    if (!validaciones.isEmpty()) {

        return res.status(404).json({
            ok: false,
            msg: validaciones.mapped()
        });
    }

    next();
}

module.exports = {
    validarCampos
}