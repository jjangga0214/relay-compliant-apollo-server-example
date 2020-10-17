import { isPointWithinRadius } from 'geolib'
import { UserInputError } from 'apollo-server'
import { GqlQueryResolvers, GqlStoreResolvers } from '~/generated/graphql'
import { validatePaginationArgs } from '~/rule/graphql/connection'
import { decode, encode, Type } from '~/rule/graphql/id'
import { storeCoordinateLoader, paginate } from '~/logic/store'
import Stores from '~/model/store'

const Query: GqlQueryResolvers = {
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

    const { edges, pageInfo } = await paginate({
      afterIndex,
      beforeIndex,
      first,
      last,
      mapper: async ({ cursor, node }) => {
        const coordinate = await storeCoordinateLoader.load(node.postcode)
        if (!coordinate) {
          return { cursor, node }
        }
        const { latitude, longitude } = coordinate
        return {
          cursor,
          node: {
            ...node,
            latitude,
            longitude,
          },
        }
      },
      where: async (edge) => {
        if (nearByInput) {
          const centerCoordinate = await storeCoordinateLoader.load(
            nearByInput.postcode,
          )
          if (!centerCoordinate) {
            throw new UserInputError('Malformed or unsupported postcode.')
          }
          const storeCoordinate = await storeCoordinateLoader.load(
            edge.node.postcode,
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
      edges: edges
        .map(({ node, cursor }) => ({
          node,
          cursor: encode({ type: Type.STORE, value: cursor.toString() }),
        }))
        .sort((former, latter) => {
          if (
            former.node.latitude === null ||
            former.node.latitude === undefined
          ) {
            return +1
          }
          if (
            latter.node.latitude === null ||
            latter.node.latitude === undefined
          ) {
            return -1
          }
          return (
            (latter.node.latitude as number) - (former.node.latitude as number)
          )
        }),
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

const Store: GqlStoreResolvers = {
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
