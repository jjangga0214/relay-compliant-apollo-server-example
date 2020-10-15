import { QueryResolvers, StoreResolvers } from '~/generated/graphql'
import { encode, Type } from '~/rule/graphql/id'
import { validatePaginationArgs } from '~/rule/graphql/connection'
import { storeCoordinateLoader } from '~/logic/store'

const Query: QueryResolvers = {
  stores: (_, { after, before, first, last }, __, info) => {
    validatePaginationArgs({
      paginationArgs: { after, before, first, last },
      conectionName: 'stores',
      info,
    })

    return {
      edges: [
        {
          node: {
            name: 'Hatfield',
            postcode: 'AL9 5JP',
          },
          cursor: '1',
        },
        {
          node: {
            name: 'Hove',
            postcode: 'BN14 9GB',
          },
          cursor: '2',
        },
        {
          node: {
            name: 'Rustington',
            postcode: 'BN16 3RT',
          },
          cursor: '3',
        },
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
  id: ({ name }) => encode({ type: Type.STORE, value: name as string }),
  latitude: async ({ postcode }) =>
    (await storeCoordinateLoader.load(postcode as string)).latitude,
  longitude: async ({ postcode }) =>
    (await storeCoordinateLoader.load(postcode as string)).longitude,
}
export default {
  Query,
  Store,
}
