const { Router } = require('express');
const { check } = require('express-validator');
const { validarCampos } = require('../../middlewares/validar-campos');
// const { validarJWT } = require('../../../middlewares/validar-jwt');

const { transactionType, transactionStatus } = require('../../helpers/enums.js');

const transactionType_enum = transactionType.enums.map(v => v.value);
const transactionStatus_enum = transactionStatus.enums.map(v => v.value);

const {
    insert,
    update,
    getById,
} = require('../../controllers/core/transaccion-financiera.controller');

const router = Router();

router.post('/', [
    check('accountExternalIdDebit', 'El número de cuenta débito es obligatorio.').notEmpty(),
    check('accountExternalIdDebit', 'El número de cuenta débito debe ser UUID.').isUUID(),
    check('accountExternalIdCredit', 'El número de cuenta crédito es obligatorio.').notEmpty(),
    check('accountExternalIdCredit', 'El número de cuenta crédito debe ser UUID.').isUUID(),
    check('transactionTypeId', 'El tipo de transacción es obligatorio.').notEmpty(),
    check('transactionTypeId', 'El tipo de transacción debe ser un número [1, 2, 3, 4 ó 5].').isNumeric(),
    check('transactionTypeId', 'El tipo de transacción debe ser un número [1, 2, 3, 4 ó 5].').isIn(transactionType_enum),
    check('value', 'El monto de transacción es obligatorio.').notEmpty(),
    check('value', 'El monto de transacción debe ser un número.').isNumeric(),
    validarCampos
], insert);

router.put("/:id", [
    check('transactionStatusId', 'El estado de transacción es obligatorio.').notEmpty(),
    check('transactionStatusId', 'El tipo de transacción debe ser un número [1, 2 ó 3].').isNumeric(),
    check('transactionStatusId', 'El tipo de transacción debe ser un número [1, 2 ó 3].').isIn(transactionStatus),
    validarCampos
], update);

router.get('/:id', getById);

module.exports = router;