import { encode, decode, Type } from '~/rule/graphql/id'

describe('encode and decode opaque identifier to/from GraphQL.', () => {
  it('encode', () => {
    expect.hasAssertions()
    expect(
      encode({
        type: Type.STORE,
        value: 'hello, world!',
      }),
    ).toStrictEqual('U3RvcmVfX2hlbGxvLCB3b3JsZCE=')
  })

  it('decode', () => {
    expect.hasAssertions()
    expect(decode('U3RvcmVfX2hlbGxvLCB3b3JsZCE=')).toStrictEqual({
      type: Type.STORE,
      value: 'hello, world!',
    })
  })

  it('decode: should throw an Error if opaque identifier does not follow rules.', () => {
    expect.hasAssertions()
    expect(() => {
      decode('U1RPUxvLCB3b3JsZCE=') // e.g. When there is no DELIMITER.
    }).toThrow()
  })
})
