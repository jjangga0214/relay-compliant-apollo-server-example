import { ApolloServer, ServerInfo } from 'apollo-server'
import { loadSchemaSync } from '@graphql-tools/load'
import { GraphQLFileLoader } from '@graphql-tools/graphql-file-loader'
import { addResolversToSchema } from '@graphql-tools/schema'
import { Resolvers } from '~/generated/graphql'

const resolvers: Resolvers = {
  Query: {
    node: (_, { id }) => {
      console.log(id)
      return {
        id: '111',
        latitude: -1.1,
        longitude: 1.1,
        name: 'hello, world!',
        postcode: 'BCG GBC',
      }
    },
    stores: (_, { after, before, first, last }) => {
      console.log(after, before, first, last)
      return {
        edges: [],
        pageInfo: {
          hasNextPage: false,
          hasPreviousPage: false,
        },
        totalCount: 0,
      }
    },
  },
  Node: {
    __resolveType: () => 'Store',
  },
}

const schema = loadSchemaSync('graphql/schema/**/*.graphql', {
  loaders: [new GraphQLFileLoader()],
})

const schemaWithResolvers = addResolversToSchema({
  schema,
  resolvers,
})

const server = new ApolloServer({
  schema: schemaWithResolvers,
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
