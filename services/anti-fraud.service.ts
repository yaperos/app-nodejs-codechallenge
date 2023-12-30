import type {Context, Service, ServiceSchema} from 'moleculer';
import type {CheckTransactionResponse} from './transaction.service';

export interface CheckTransactionRequest {
	transactionExternalId: string;
	value: number
}

interface AntiFraudSettings {
	defaultName: string;
}

type AntiFraudThis = Service<AntiFraudSettings>;

const AntiFraudService: ServiceSchema<AntiFraudSettings> = {
	name: 'anti-fraud',
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
	actions: {},

	/**
	 * Events
	 */
	events: {
		'check.request': {
			async handler(ctx: Context<CheckTransactionRequest>) {
				console.log('check.request', ctx.params);
				const checkResponse = {
					transactionExternalId: ctx.params.transactionExternalId,
					transactionStatus: 'approved'
				}
				if (ctx.params.value > 1000) {
					checkResponse.transactionStatus = 'rejected';
				}
				await ctx.emit<CheckTransactionResponse>('check.response', checkResponse, ['transaction']);
			}
		}
	},

	/**
	 * Methods
	 */
	methods: {},

	/**
	 * Service created lifecycle event handler
	 */
	created(this: AntiFraudThis) {},

	/**
	 * Service started lifecycle event handler
	 */
	async started(this: AntiFraudThis) {},

	/**
	 * Service stopped lifecycle event handler
	 */
	async stopped(this: AntiFraudThis) {},
};

export default AntiFraudService;
