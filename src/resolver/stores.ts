import { QueryResolvers, StoreResolvers } from '~/generated/graphql'
import { encode, Type } from '~/rule/graphql/id'

const Query: QueryResolvers = {
  stores: (_, { after, before, first, last }) => {
    console.log([after, before, first, last])
    return {
      edges: [
        // {node: {}, cursor}
      ],
      pageInfo: {
        hasNextPage: false,
        hasPreviousPage: false,
      },
      totalCount: 0,
    }
  },
}

const Store: StoreResolvers = {
  id: ({ name }) => encode({ type: Type.STORE, value: name }),
}
export default {
  Query,
  Store,
}
