import type {Context, Service, ServiceSchema} from 'moleculer';
import type {DbAdapter, DbServiceSettings, MoleculerDbMethods} from 'moleculer-db';
import type MongoDbAdapter from 'moleculer-db-adapter-mongo';
import type {DbServiceMethods} from '../mixins/db.mixin';
import DbMixin from '../mixins/db.mixin';

export interface TransactionEntity {
	_id: string;
	accountExternalIdDebit: string;
	accountExternalIdCredit: string;
	transactionExternalId: string;
	transactionType: string;
	transactionStatus: string;
	value: number;
	createdAt: Date;
}

export interface QueryTransaction {
	query: Partial<TransactionEntity>;
	limit?: number;
}

export interface ActionUpdateStatusParams {
	transactionExternalId: string;
	transactionStatus: string;
}

interface StorageSettings extends DbServiceSettings {
	indexes?: Record<string, number>[];
}

interface StorageThis extends Service<StorageSettings>, MoleculerDbMethods {
	adapter: DbAdapter | MongoDbAdapter;
}

const TransactionsService: ServiceSchema<StorageSettings> & {methods: DbServiceMethods} = {
	name: 'storage',
	version: 1,

	/**
	 * Mixins
	 */
	mixins: [DbMixin('storage')],

	/**
	 * Settings
	 */
	settings: {
		// Available fields in the responses
		fields: [
			'_id',
			'accountExternalIdDebit',
			'accountExternalIdCredit',
			'transactionExternalId',
			'transactionType',
			'transactionStatus',
			'value',
			'createdAt',
		],

		// Validator for the `create` & `insert` actions.
		entityValidator: {
			accountExternalIdDebit: 'uuid',
			accountExternalIdCredit: 'uuid',
			transactionExternalId: 'uuid',
			transactionType: 'string',
			transactionStatus: {type: 'enum', values: ['pending', 'approved', 'rejected']},
			value: 'number|positive',
			createdAt: 'date|convert',
		},

		indexes: [{transactionExternalId: 1}],
	},

	/**
	 * Action Hooks
	 */
	hooks: {
	},

	/**
	 * Actions
	 */
	actions: {
		/**
		 * The 'moleculer-db' mixin registers the following actions:
		 *  - list
		 *  - find
		 *  - count
		 *  - create
		 *  - insert
		 *  - update
		 *  - remove
		 */

		// --- ADDITIONAL ACTIONS ---

		updateStatus: {
			rest: 'PUT /:transactionExternalId/:transactionStatus',
			params: {
				transactionExternalId: 'uuid',
				transactionStatus: {type: 'enum', values: ['pending', 'approved', 'rejected']},
			},
			async handler(this: StorageThis, ctx: Context<ActionUpdateStatusParams>): Promise<object> {
				// eslint-disable-next-line @typescript-eslint/no-explicit-any
				const doc = await this.adapter.findOne({transactionExternalId: ctx.params.transactionExternalId}) as any;
				doc.transactionStatus = ctx.params.transactionStatus;
				console.log('Inside Storage: updating status... Doc: ', doc);
				await this.adapter.updateById(
					doc._id,
					{$set: {transactionStatus: ctx.params.transactionStatus}}
				);
				console.log('Inside Storage: updated status... Doc: ', doc);
				const json = await this.transformDocuments(ctx, ctx.params, doc);
				await this.entityChanged('updated', json, ctx);

				return json;
			},
		},
	},

	/**
	 * Methods
	 */
	methods: {
		/**
		 * Loading sample data to the collection.
		 * It is called in the DB.mixin after the database
		 * connection establishing & the collection is empty.
		 */
		async seedDB(this: StorageThis) {
		},
	},

	/**
	 * Fired after database connection establishing.
	 */
	async afterConnected(this: StorageThis) {
		if ('collection' in this.adapter) {
			if (this.settings.indexes) {
				await Promise.all(
					this.settings.indexes.map((index) =>
						(<MongoDbAdapter>this.adapter).collection.createIndex(index),
					),
				);
			}
		}
	},
};

export default TransactionsService;
