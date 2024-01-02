const express = require('express')

const { expressValidator } = require('../utils/joiValidator')
const asyncHandler = require('../utils/asyncHandler')
const { logger } = require('../utils/logger')

const { createTransferSchema, getTransactionSchema } = require('./transactions.schema')
const createTransfer = require('../app/createTransfer')
const getTransaction = require('../app/getTransaction')
// const sendFileSftp = require('../app/sftp/sendFile')

const router = express.Router()

router.post(
  '/transfer',
  expressValidator.body(createTransferSchema.Body),
  asyncHandler(
    async (
      req,
      res,
    ) => {
      const {
        accountExternalIdDebit, accountExternalIdCredit, transferTypeId, value,
      } = req.body
      const transaction = await createTransfer({
        accountExternalIdDebit,
        accountExternalIdCredit,
        transferTypeId,
        value,
      })

      res.status(201).json({
        message: 'Transfer created successfully',
        data: transaction,
      })
    },
  ),
)

router.get(
  '/:transactionExternalId',
  expressValidator.params(getTransactionSchema.Params),
  asyncHandler(
    async (
      req,
      res,
    ) => {
      const {
        transactionExternalId,
      } = req.params
      const transaction = await getTransaction(transactionExternalId)

      res.status(200).json({
        message: 'Transaction retrieved successfully',
        data: transaction,
      })
    },
  ),
)

module.exports = router
