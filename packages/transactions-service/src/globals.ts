import { type DataSource } from 'typeorm'
import { type Database } from './core/db/database'
import { DatabaseFactory } from './core/factory/database.factory'
import { type MessageManager } from './core/messages/messageManager'
import MessageManagerFactory from './core/factory/messageManager.factory'

export const databaseInstance: Database<DataSource> = DatabaseFactory.getPostgreSqlInstance()
export const transactionMessageManagerInstance: MessageManager = MessageManagerFactory.getKafkaManagerInstance()
