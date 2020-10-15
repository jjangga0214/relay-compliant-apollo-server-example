import { Base64 } from 'js-base64'
import { UserInputError } from 'apollo-server'

export const DELIMITER = '__'
export enum Type {
  STORE = 'Store',
}

export interface DecodedGqlId {
  type: Type
  value: string
}

export function encode({ type, value }: DecodedGqlId): string {
  return Base64.encode(`${type}${DELIMITER}${value}`)
}

export function decode(gqlId: string): DecodedGqlId {
  const rawGqlId = Base64.decode(gqlId)
  const delimiterIndex = rawGqlId.indexOf(DELIMITER)
  if (delimiterIndex === -1) {
    throw new UserInputError(
      `Invalid Node ID Format. "${DELIMITER}" is not found from the base64-decoded gqlId. Its format should be "\${TYPE}${DELIMITER}\${VALUE}".`,
    )
  }

  const decodedGqlId: DecodedGqlId = {
    type: rawGqlId.substr(0, delimiterIndex) as Type,
    value: rawGqlId.substr(delimiterIndex + DELIMITER.length),
  }
  // Currently there is only 'STORE' Node.
  if (!Object.values(Type).includes(decodedGqlId.type)) {
    throw new UserInputError(`Invalid Node ID. TYPE name is not valid.`)
  }
  return decodedGqlId
}
