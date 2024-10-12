import { Injectable } from "@nestjs/common";
import { CreateTransactionDto } from "./dto/CreateTransaction.dto";
import { InjectModel } from "@nestjs/mongoose";
import { Transaction } from "../../database/Transaction.schema";
import { Model } from "mongoose";
import { TransactionStatus } from "../../database/TransactionStatus.schema";
import { ETransactionStatus } from "../../enum/TransactionStatus.enum";
import { ErrorHandler } from "../../classes/ErrorHandler.class";
import { GuidAdapter } from "../../classes/GuidAdapter.class";
import { AppLoggerAdapter } from "../../classes/AppLoggerAdapter.class";
import { TransactionType } from "../../database/TransactionType.schema";

@Injectable()
export class TransactonService {
	constructor(
		@InjectModel(Transaction.name) private transactionModel: Model<Transaction>,
		@InjectModel(TransactionStatus.name) private transactionStatusModel: Model<TransactionStatus>,
		@InjectModel(TransactionType.name) private transactionTypeModel: Model<TransactionType>,
	) {}

	/**
	 * Look for transaction type object id into db
	 * @param logger 
	 * @param statusCode 
	 * @returns transactionTypeId
	 */
	private async getTypeId(
		logger: AppLoggerAdapter,
		code: number
	): Promise<string> {
		try {

			logger.logInfo(`Looking for transaction type id: ${code}`);
			// look up for the status id into db
			const trxTypeObject = await this.transactionTypeModel.findOne({ code });
			
			// Throw exception if pending status record does not exists in database
			if(!trxTypeObject) {
				logger.logError('transaction type id not found');
				
				ErrorHandler.throwNotFoundException(
					'Couldn\'t find transaction type record'
				);
			}
			logger.logInfo('transaction type id found');

			return trxTypeObject.id;
		} catch (error) {
			ErrorHandler.throwInternalServerErrorException(
				'Cannot get transaction type, please try again.'
			);
		}
	}

	/**
	 * Look for status object id into db
	 * @param logger 
	 * @param statusCode 
	 * @returns transactionStatusId
	 */
	private async getStatusId(
		logger: AppLoggerAdapter,
		statusCode: ETransactionStatus
	): Promise<string> {
		try {

			logger.logInfo('Looking for status id');
			// look up for the status id into db
			const trxStatusObject = await this.transactionStatusModel.findOne({
				code: statusCode
			});
			
			// Throw exception if pending status record does not exists in database
			if(!trxStatusObject) {
				logger.logError('status id not found');

				ErrorHandler.throwNotFoundException(
					'Couldn\'t find status record'
				);
			}
			logger.logInfo('status id found');

			return trxStatusObject.id;
		} catch (error) {
			ErrorHandler.throwInternalServerErrorException(
				'Cannot get transaction status, please try again.'
			);
		}
	}
	
	/**
	 * Create new Transaction into db
	 * @param data 
	 * @returns 
	 */
	public async createTransaction(
		logger: AppLoggerAdapter, 
		data: CreateTransactionDto
	): Promise<Transaction> {

		try {

			if(!GuidAdapter.isGuid(data.accountExternalIdDebit)) {
				logger.logError('Validating accountExternalIdDebit failed', {
					id: data.accountExternalIdDebit
				});

				ErrorHandler.throwBadRequestException(
					'accountExternalIdDebit is not a valid id'
				);
			}
			logger.logInfo('Validating accountExternalIdDebit success', {
				id: data.accountExternalIdDebit
			});

			if(!GuidAdapter.isGuid(data.accountExternalIdCredit)) {
				logger.logError('Validating accountExternalIdCredit failed', {
					id: data.accountExternalIdCredit
				});

				ErrorHandler.throwBadRequestException(
					'accountExternalIdCredit is not a valid id'
				);
			}
			logger.logInfo('Validating accountExternalIdCredit success', {
				id: data.accountExternalIdCredit
			});

			// look up for transaction id into db
			const trxTypeId = await this.getTypeId(logger, data.tranferTypeId);

			// look up for the PENDING status id into db
			const pendingTrxStatusId = await this.getStatusId(logger, ETransactionStatus.PENDING);
	
			logger.logInfo('Creating transaction into db');
			const createdRecord = await this.transactionModel.create({
				...data,
				transactionType: trxTypeId,
				transactionStatus: pendingTrxStatusId,
				transactionExternalId: GuidAdapter.create()
			});

			if(!createdRecord) {
				ErrorHandler.throwInternalServerErrorException(
					'Could not be possible to create the transaction, please try again.'
				);
			}
			logger.logInfo('transaction created');
			return createdRecord;
		} catch (error) {
			logger.logError('An error has ocurred during creation', {
				error: error
			});

			ErrorHandler.throwInternalServerErrorException(
				'Cannot create transaction, please try again.'
			);
		}
	}

	/**
	 * Retrieve a transaction by its Id
	 * @param transactionId 
	 * @returns Transaction object
	 */
	public async getTransactionByExternalId(
		logger: AppLoggerAdapter,
		transactionId: string
	): Promise<Transaction> {
		try {

			logger.logInfo('Looking for transaction into db');
			// Retrieve data from database
			const trx = await this.transactionModel
			.findOne({transactionExternalId: transactionId}, {
				_id: 0,
				accountExternalIdDebit: 0,
				accountExternalIdCredit: 0,
				updatedAt: 0,
				isClosed: 0,
				__v: 0,
			})
			.populate('transactionType', {
				_id: 0,
				code: 0,
				__v: 0,
			})
			.populate('transactionStatus', {
				_id: 0,
				code: 0,
				__v: 0,
			});

			// Throw exception if the resquested transaction does not exists
			if(!trx) {
				logger.logError('Couldn\'t find the reuested transaction');

				ErrorHandler.throwNotFoundException(
					'The requested transaction does not exists'
				);
			}
			logger.logInfo('Transaction found successfully');

			return trx;
		} catch (error) {
			logger.logError('An error has ocurred during the process', {
				error: error
			});

			ErrorHandler.throwInternalServerErrorException(
				'Cannot get the requested transaction, please try again.'
			);
		}
	}

	/**
	 * Update a transaction status by its Id
	 * @param transactionId 
	 * @returns Updated Transaction object
	 */
	public async updateTransactionStatus(
		logger: AppLoggerAdapter,
		transactionId: string,
		newStatus: ETransactionStatus
	): Promise<boolean> {
		try {
			// look up for the PENDING status id into d			
			const trxStatusId = await this.getStatusId(logger, newStatus);
			
			logger.logInfo('Looking for transaction into db');
			const trx = await this.transactionModel.findOne(
				{ transactionExternalId: transactionId }
			);

			// throw exception if transaction does't exists
			if(!trx) {
				logger.logError('Couldn\'t find the reuested transaction');

				ErrorHandler.throwNotFoundException(
					'the transaction could not be found'
				);
			}

			// throw exception if transaction does't exists
			if(trx.isClosed) {
				logger.logError('Couldn\'t update this transaction');

				ErrorHandler.throwForbiddenException(
					'the requested transaction is not updateable because is currently closed'
				);
			}

			logger.logInfo('Updating transaction');
			await this.transactionModel.findOneAndUpdate(
				{ transactionExternalId: transactionId }, 
				{ 
					transactionStatus: trxStatusId,
					isClosed: true
				}, 
				{ new: true }
			);
			logger.logInfo('Update successful');

			return true;
		} catch (error) {
			logger.logError('An error has ocurred during updating', {
				error: error
			});

			ErrorHandler.throwInternalServerErrorException(
				'Cannot update the requested transaction, please try again.'
			);
		}
	}
}