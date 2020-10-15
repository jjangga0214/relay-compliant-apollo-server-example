import { QueryResolvers, NodeResolvers } from '~/generated/graphql'

const Node: NodeResolvers = {
  // Resolve to constant, as currently there is only one type('Store') that implements 'Node'.
  __resolveType: () => 'Store',
}

const Query: QueryResolvers = {
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
}
export default {
  Query,
  Node,
}
