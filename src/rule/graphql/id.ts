import { Base64 } from 'js-base64'

export const DELIMITER = '__'

export function encode({ type, value }: DecodedGqlId): string {
  return Base64.encode(`${type}${DELIMITER}${value}`)
}

export interface DecodedGqlId {
  type: string
  value: string
}

export function decode(gqlId: string): DecodedGqlId {
  const rawGqlId = Base64.decode(gqlId)
  const delimiterIndex = rawGqlId.indexOf(DELIMITER)
  if (delimiterIndex === -1) {
    throw Error(
      `"${DELIMITER}" is not found from the base64-decoded gqlId. Its format should be "\${TYPE}${DELIMITER}\${VALUE}".`,
    )
  }

  return {
    type: rawGqlId.substr(0, delimiterIndex),
    value: rawGqlId.substr(delimiterIndex + DELIMITER.length),
  }
}
