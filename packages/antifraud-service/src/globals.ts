import MessageManagerFactory from './core/factory/messageManager.factory'
import { type MessageManager } from './core/messages/messageManager'

export const transactionMessageManagerInstance: MessageManager = MessageManagerFactory.getKafkaManagerInstance()
