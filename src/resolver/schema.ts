import { UserInputError } from 'apollo-server'
import { QueryResolvers, NodeResolvers } from '~/generated/graphql'
import { decode, Type, DecodedGqlId } from '~/rule/graphql/id'
import { storeLoader } from '~/logic/store'

const Node: NodeResolvers = {
  // Make sure the enum Type's values are identical with those of GraphQL
  __resolveType: ({ id }) => decode(id).type,
}

async function resolveNodeImpl(decodedGqlId: DecodedGqlId, id: string) {
  if (decodedGqlId.type === Type.STORE) {
    const store = await storeLoader.load(decodedGqlId.value)
    if (!store) {
      return null
    }
    return { ...store, id }
  }
  throw new UserInputError(`Invalid Node ID. Type name is not valid.`)
}

const Query: QueryResolvers = {
  node: async (_, { id }) => {
    const decodedGqlId = decode(id)
    return resolveNodeImpl(decodedGqlId, id)
  },
  nodes: async (_, { ids }) => {
    return Promise.all(
      ids
        .map((id) => ({ decodedGqlId: decode(id), id }))
        .map(({ decodedGqlId, id }) => resolveNodeImpl(decodedGqlId, id)),
    )
  },
}
export default {
  Query,
  Node,
}
