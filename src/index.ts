import { ApolloServer, ServerInfo } from 'apollo-server'
import { loadSchemaSync } from '@graphql-tools/load'
import { GraphQLFileLoader } from '@graphql-tools/graphql-file-loader'
import { addResolversToSchema } from '@graphql-tools/schema'
import deepmerge from 'deepmerge'
import { Resolvers } from '~/generated/graphql'
import schemaResolvers from '~/resolver/schema'
import storeResolvers from '~/resolver/stores'

const resolvers: Resolvers = deepmerge.all([schemaResolvers, storeResolvers])

const schema = loadSchemaSync('graphql/schema/**/*.graphql', {
  loaders: [new GraphQLFileLoader()],
})

const schemaWithResolvers = addResolversToSchema({
  schema,
  resolvers,
})

const server = new ApolloServer({
  schema: schemaWithResolvers,
  resolvers,
  /*
  ref: https://www.apollographql.com/docs/apollo-server/api/apollo-server/#playground  
  For convenience, playground is to be hosted even on production in this example.
  In real case, I recommend to remove the next line. 
  */
  playground: true,
})

// The `listen` method launches a web server.
server
  .listen({
    port: process.env.PORT,
  })
  .then(({ url }: ServerInfo) => {
    console.log(`🚀  Server ready at ${url}`)
  })
