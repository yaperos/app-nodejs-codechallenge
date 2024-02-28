import { ApolloDriver, ApolloDriverConfig } from "@nestjs/apollo";
import { Module } from "@nestjs/common";
import { GraphQLModule } from "@nestjs/graphql";
import { ApolloServerPluginLandingPageLocalDefault } from '@apollo/server/plugin/landingPage/default';
import { join } from "path";

@Module({
    imports: [
        GraphQLModule.forRoot<ApolloDriverConfig>({
            driver: ApolloDriver,
            playground: false,
            autoSchemaFile: join(process.cwd(), 'src/domain/schemas/schema.gql'),
            plugins: [
                ApolloServerPluginLandingPageLocalDefault()
            ]
        },
        ),

    ],
    controllers: [],
    providers: [],
})
export class GraphQLConfigModule { }