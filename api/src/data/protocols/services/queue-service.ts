/* eslint-disable @typescript-eslint/ban-types */
export interface IQueueSenderService<T, U> {
	send(message: T, topic: string): Promise<U>;
}

export interface IQueueSubscribeReceiver {
	subscribeReceiver(topic: string): Promise<void>;
}
