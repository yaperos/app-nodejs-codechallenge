import dotenv from 'dotenv';
dotenv.config(); 
import { ApolloServer } from '@apollo/server';
import { startStandaloneServer } from '@apollo/server/standalone';
import { resolvers } from './graphql/resolvers';
import { typeDefs } from './graphql/types';
import { dbConnect } from './config/db';
import Producer from './services/producer';

(async function main() {
    await dbConnect();

    const producer = new Producer();
    await producer.setup()
  
    const server = new ApolloServer({ 
        typeDefs,
        resolvers
    });

    const { url } = await startStandaloneServer(server, {
        listen: { port: 4000 },
        context: async()  => ({
            producer
        })
    });
    
    console.log(`Server Up at: ${url}`);
})() 
