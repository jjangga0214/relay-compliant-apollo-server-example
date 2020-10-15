import { UserInputError } from 'apollo-server'
import { QueryResolvers, NodeResolvers } from '~/generated/graphql'
import { decode, Type } from '~/rule/graphql/id'
import * as storeLogic from '~/logic/store'

const Node: NodeResolvers = {
  // Make sure the enum Type's values are identical with those of GraphQL
  __resolveType: ({ id }) => decode(id).type,
}

const Query: QueryResolvers = {
  node: async (_, { id }) => {
    const decodedGqlId = decode(id)
    if (decodedGqlId.type === Type.STORE) {
      const store = await storeLogic.findOne(decodedGqlId.value)
      if (!store) {
        return null
      }
      return { ...store, id }
    }
    throw new UserInputError(`Invalid Node ID. Type name is not valid.`)
  },
}
export default {
  Query,
  Node,
}
