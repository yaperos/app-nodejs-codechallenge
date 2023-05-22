/* eslint-disable no-unused-vars */
export interface SubscriptionOptions{
  topic: string;
  fromBeginning?: boolean;
}

export interface EventStreamer {
  closeConnections(): Promise<void>
  createSubscription(options: SubscriptionOptions, cb: (message: any) => void): Promise<void>
  sendMessage(topic: string, message: string): Promise<void>
}
