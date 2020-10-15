import { encode, decode, Type } from '~/rule/graphql/id'

describe("'encode' and 'decode' opaque identifier to/from GraphQL.", () => {
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
  describe('decode: should throw an Error if opaque identifier does not follow rules.', () => {
    it('when there is no DELIMITER.', () => {
      expect.hasAssertions()
      expect(() => decode('U1RPUxvLCB3b3JsZCE=')).toThrow()
    })
    it('when there is invalid Type name.', () => {
      expect.hasAssertions()
      expect(() => decode('cmVfX2hlbGxvLCB3b3JsZCE=')).toThrow()
    })
  })
})
