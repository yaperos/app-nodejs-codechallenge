import type {ActionParamTypes, Context, Service, ServiceSchema} from 'moleculer';
import {Errors} from 'moleculer';
import {v4 as uuid} from 'uuid';
import type {QueryTransaction, TransactionEntity} from './storage.service';

export interface StartTransactionParams {
	accountExternalIdDebit: string;
	accountExternalIdCredit: string;
	transferTypeId: number;
	value: number;
}

export interface CheckTransactionResponse {
	transactionExternalId: string;
	transactionStatus: string
}

interface TransactionStatus {
	transactionExternalId: string,
  transactionType: {
    name: string,
  },
  transactionStatus: {
    name: string
  },
  value: number,
  createdAt: Date
}

const startTransactionSchema: {[key in keyof StartTransactionParams]: ActionParamTypes} = {
	accountExternalIdDebit: 'uuid',
	accountExternalIdCredit: 'uuid',
	transferTypeId: 'number',
	value: 'number',
};

interface TransactionSettings {
	defaultName: string;
}

type TransactionThis = Service<TransactionSettings>;

const TransactionService: ServiceSchema<TransactionSettings> = {
	name: 'transaction',
	version: 1,

	/**
	 * Settings
	 */
	settings: {
		defaultName: 'Moleculer',
	},

	/**
	 * Dependencies
	 */
	dependencies: [],

	/**
	 * Actions
	 */
	actions: {
		start: {
			rest: {
				method: 'POST',
				path: '/',
			},
			params: startTransactionSchema,
			async handler(this: TransactionThis, ctx: Context<StartTransactionParams>): Promise<TransactionStatus> {
				const transactionDoc = await ctx.call<TransactionEntity, Partial<TransactionEntity>>('v1.storage.create', {
					accountExternalIdDebit: ctx.params.accountExternalIdDebit,
					accountExternalIdCredit: ctx.params.accountExternalIdCredit,
					transactionExternalId: uuid(), // new random uuid 
					transactionType: ctx.params.transferTypeId.toString(),
					transactionStatus: 'pending',
					value: ctx.params.value,
					createdAt: new Date(),
				});
				await ctx.emit('check.request', {
					transactionExternalId: transactionDoc.transactionExternalId,
					value: transactionDoc.value,
				}, ['anti-fraud']);
				return this.createTransactionStatus(transactionDoc);
			},
		},

		get: {
			rest: 'GET /:transactionExternalId',
			params: {
				transactionExternalId: 'uuid',
			},
			async handler(this: TransactionThis, ctx: Context<{transactionExternalId: string}>): Promise<TransactionStatus> {
				const transactionDoc = await ctx.call<TransactionEntity[], QueryTransaction>('v1.storage.find', {
					query: {transactionExternalId: ctx.params.transactionExternalId},
				});
				if (!transactionDoc.length) {
					console.error(`Not exist a Transaction with External Id ${ctx.params.transactionExternalId}`);
					throw new Errors.MoleculerClientError(`Not exist a Transaction with External Id ${ctx.params.transactionExternalId}`, 404);
				}
				return this.createTransactionStatus(transactionDoc[0]);
			},
		},
	},

	/**
	 * Events
	 */
	events: {
		'check.response': {
			async handler(ctx: Context<CheckTransactionResponse>) {
				console.log('check.response', ctx.params);
				await ctx.call<TransactionEntity[], Partial<TransactionEntity>>('v1.storage.updateStatus', {
					transactionExternalId: ctx.params.transactionExternalId,
					transactionStatus: ctx.params.transactionStatus,
				});
			}
		}
	},

	/**
	 * Methods
	 */
	methods: {
		createTransactionStatus(transaction: TransactionEntity): TransactionStatus {
			return {
				transactionExternalId: transaction.transactionExternalId,
				transactionType: {
					name: transaction.transactionType,
				},
				transactionStatus: {
					name: transaction.transactionStatus,
				},
				value: transaction.value,
				createdAt: transaction.createdAt,
			};
		}
	},

	/**
	 * Service created lifecycle event handler
	 */
	created(this: TransactionThis) {},

	/**
	 * Service started lifecycle event handler
	 */
	async started(this: TransactionThis) {},

	/**
	 * Service stopped lifecycle event handler
	 */
	async stopped(this: TransactionThis) {},
};

export default TransactionService;
