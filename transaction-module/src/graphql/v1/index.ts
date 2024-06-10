import { ApolloServer } from '@apollo/server'
import { resolvers } from './transactions/resolver'
import { typeDefinitions } from './transactions/typeDefs'
import { startStandaloneServer } from '@apollo/server/standalone'

const server = new ApolloServer({ typeDefs: typeDefinitions, resolvers, csrfPrevention: true })

async function startServer (): Promise<void> {
  await startStandaloneServer(server, { listen: { port: 4000 } })
  console.log('Graphql running on port 4000')
}

export default startServer()
