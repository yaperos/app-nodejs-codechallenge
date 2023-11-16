const express = require('express');
const router = express.Router();

const { create, getOne } = require('../controller/transactionController');

router.post('/create', create);
router.get('/:id', getOne);

module.exports = router;