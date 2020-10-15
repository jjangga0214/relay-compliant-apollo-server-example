import { SchemaDirectiveVisitor, UserInputError } from 'apollo-server'
import {
  GraphQLField,
  GraphQLObjectType,
  GraphQLInterfaceType,
  GraphQLArgument,
} from 'graphql'

export class MinDirective extends SchemaDirectiveVisitor {
  public visitArgumentDefinition(
    argument: GraphQLArgument,
    details: {
      field: GraphQLField<any, any>
      objectType: GraphQLObjectType | GraphQLInterfaceType
    },
  ) {
    // preparing the resolver
    const originalResolver = details.field.resolve
    const directiveArgs = this.args as { value: number } // e.g. "value" of => @min("value")
    // eslint-disable-next-line no-param-reassign
    details.field.resolve = async (...resolveArgs) => {
      const args = resolveArgs[1] // (parent, args, context, info)
      const valueToValidate = args[argument.name] // e.g. argument.name === "min"
      if (
        typeof valueToValidate === 'number' &&
        valueToValidate < directiveArgs.value
      ) {
        throw new UserInputError(
          `The value of '${argument.name}' has to be greater than or equal to ${directiveArgs.value}, but received ${valueToValidate}.`,
        )
      }
      return originalResolver
        ? originalResolver.apply(this, resolveArgs)
        : undefined
    }
  }
}
