import 'reflect-metadata'
import startApolloServer from './server/server'
import { databaseInstance } from './globals'

async function main (): Promise<void> {
  const { PORT } = process.env
  const port: string | number = PORT ?? 4000
  await startApolloServer(port)
  await databaseInstance.start()
}

void main()
