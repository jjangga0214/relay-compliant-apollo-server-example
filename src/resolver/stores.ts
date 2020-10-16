import { isPointWithinRadius } from 'geolib'
import { UserInputError } from 'apollo-server'
import { QueryResolvers, StoreResolvers } from '~/generated/graphql'
import { validatePaginationArgs } from '~/rule/graphql/connection'
import { decode, encode, Type } from '~/rule/graphql/id'
import { storeCoordinateLoader } from '~/logic/store'
import Stores from '~/model/store'

const Query: QueryResolvers = {
  stores: async (_, { after, before, first, last, nearByInput }, __, info) => {
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

    const { edges, pageInfo } = await Stores.paginate({
      afterIndex,
      beforeIndex,
      first,
      last,
      where: async (store) => {
        if (nearByInput) {
          const centerCoordinate = await storeCoordinateLoader.load(
            nearByInput.postcode,
          )
          if (!centerCoordinate) {
            throw new UserInputError('Malformed or unsupported postcode.')
          }
          const storeCoordinate = await storeCoordinateLoader.load(
            store.postcode,
          )
          // Some store's postcode can be unsupported from API.
          if (!storeCoordinate) {
            return false
          }
          return isPointWithinRadius(
            centerCoordinate,
            storeCoordinate,
            nearByInput.radius,
          )
        }
        return true
      },
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
