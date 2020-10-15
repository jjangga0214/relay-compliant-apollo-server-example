import { QueryResolvers } from '~/generated/graphql'

const Query: QueryResolvers = {
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
}

export default {
  Query,
}
