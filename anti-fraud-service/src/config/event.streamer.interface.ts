/* eslint-disable no-unused-vars */

/**
 * Event Streamer subscription options
 */
interface SubscriptionOptions {
  /** Topic the consumer will get subscribed to */
  topic: string;
  /**
   * If set to true, it will process all the pending messages
   * made even before the consumer creation. Default {true}
  */
  fromBeginning?: boolean;
}

/**
 * EventStreamer definition
 */
interface EventStreamer {
  /**
   * Closes all existing consumer connections of the EventStreamer
   */
  closeConnections(): Promise<void>

  /**
   * Creates a new consumer that gets subscribed to topic specified in {options}
   * @param {SubscriptionOptions} options Subscription creation options
   * @param {Function} cb Callback function that will be called when a new message is received
   */
  createSubscription(options: SubscriptionOptions, cb: (message: any) => void): Promise<void>

  /**
   * Sends a new message to specified topic
   * @param {string} topic Topic to send the message
   * @param {string} message Message to send
   */
  sendMessage(topic: string, message: string): Promise<void>
}

export { SubscriptionOptions, EventStreamer };
