import { UserInputError } from 'apollo-server'
import { GraphQLResolveInfo } from 'graphql'
import { fieldsList } from 'graphql-fields-list'

export interface PaginationArgs {
  after: string | null | undefined
  before: string | null | undefined
  first: number | null | undefined
  last: number | null | undefined
}
export function validatePaginationArgs({
  paginationArgs,
  conectionName,
  info,
  fieldsNonRequiringFirstOrLast = ['totalCount'],
}: {
  paginationArgs: PaginationArgs
  conectionName: string
  info: GraphQLResolveInfo
  fieldsNonRequiringFirstOrLast?: string[]
}): void {
  const { first, last } = paginationArgs
  if (first && last) {
    throw new UserInputError(
      `Passing both 'first' and 'last' to paginate the '${conectionName}' connection is not supported.`,
    )
  }

  // ref: https://github.com/Mikhus/graphql-fields-list
  const directlyQueriedFields = fieldsList(info)
  /**
   * e.g. If only 'totalCount' is queried, 'first' or 'last' are not required.
   * e.g. If 'edges' is queried, either 'first' or 'last' is required.
   */
  const requiresFirstOrLast = !directlyQueriedFields.every((el) =>
    fieldsNonRequiringFirstOrLast.includes(el),
  )

  if (!first && !last && requiresFirstOrLast) {
    throw new UserInputError(
      `You must provide a 'first' or 'last' value to properly paginate the '${conectionName}' connection.`,
    )
  }
}
