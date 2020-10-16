import { QueryResolvers, StoreResolvers } from '~/generated/graphql'
import { validatePaginationArgs } from '~/rule/graphql/connection'
import { decode, encode, Type } from '~/rule/graphql/id'
import { storeCoordinateLoader } from '~/logic/store'
import Stores from '~/model/store'

const Query: QueryResolvers = {
  stores: (_, { after, before, first, last }, __, info) => {
    validatePaginationArgs({
      paginationArgs: { after, before, first, last },
      conectionName: 'stores',
      info,
    })

    const result = {
      totalCount: Stores.totalCount(),
    }
    const afterIndex = after ? parseInt(decode(after as string).value, 10) : -1
    const beforeIndex = before
      ? parseInt(decode(before as string).value, 10)
      : result.totalCount

    if (!first && !last) {
      return result
    }

    const { edges, pageInfo } = Stores.paginate({
      afterIndex,
      beforeIndex,
      first,
      last,
    })

    return {
      ...result,
      edges: edges.map(({ node, cursor }) => ({
        node,
        cursor: encode({ type: Type.STORE, value: cursor.toString() }),
      })),
      pageInfo: {
        ...pageInfo,
        endCursor: pageInfo.endCursor
          ? encode({ type: Type.STORE, value: pageInfo.endCursor.toString() })
          : null,
        startCursor: pageInfo.startCursor
          ? encode({ type: Type.STORE, value: pageInfo.startCursor.toString() })
          : null,
      },
    }
  },
}

const Store: StoreResolvers = {
  id: ({ name }) => encode({ type: Type.STORE, value: name as string }),
  latitude: async ({ postcode }) => {
    const coordinate = await storeCoordinateLoader.load(postcode as string)
    return coordinate ? coordinate.latitude : undefined
  },
  longitude: async ({ postcode }) => {
    const coordinate = await storeCoordinateLoader.load(postcode as string)
    return coordinate ? coordinate.longitude : undefined
  },
}
export default {
  Query,
  Store,
}
