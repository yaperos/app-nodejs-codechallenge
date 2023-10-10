import { Consumer, KafkaClient, Message, Producer } from 'kafka-node';

import { ConnectionSettings } from './connectionSettings';

export class KafkaConnection {
	private readonly connectionSettings: ConnectionSettings;
	private consumer?: Consumer;
	private producer?: Producer;

	constructor(params: { connectionSettings: ConnectionSettings }) {
		this.connectionSettings = params.connectionSettings;
	}

	async connect() {
		const { hostname, port } = this.connectionSettings.connection;
		const kafkaClient = new KafkaClient({
			kafkaHost: `${hostname}:${port}`
		});
		await new Promise((resolve, reject) => {
			kafkaClient.once('ready', () => {
				this.producer = new Producer(kafkaClient);
				this.consumer = new Consumer(kafkaClient, [], {});
				resolve(null);
			});
			kafkaClient.once('error', error => {
				reject(error);
			});
		});
	}

	async publish(params: { topic: string; message: Buffer }) {
		return new Promise((resolve, reject) => {
			if (!this.producer) {
				reject();

				return;
			}
			this.producer.send([{ topic: params.topic, messages: params.message }], (error, data) => {
				if (error) {
					reject(error);
				} else {
					resolve(data);
				}
			});
		});
	}

	async consume(topic: string, onMessage: (message: Message) => void) {
		await new Promise((resolve, reject) => {
			if (!this.consumer) {
				reject();

				return;
			}
			this.consumer.addTopics([topic], () => {});
			this.consumer.on('message', message => {
				onMessage(message);
				resolve(message);
			});
		});
	}
}
