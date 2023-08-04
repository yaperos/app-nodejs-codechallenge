'use strict';

import { createTransaction } from '../controllers/TransactionController';
import { validationTransaction } from '../middleware/ValidationTransactionMiddleware';

let express = require('express'),
    router = express.Router();

/* GET users listing. */
router.post('/', [validationTransaction],createTransaction);

export {router}