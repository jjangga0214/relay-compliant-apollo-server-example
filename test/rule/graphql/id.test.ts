import { encode, decode } from '~/rule/graphql/id'

describe('Encode and decode opaque identifier to/from GraphQL.', () => {
  it('encode ', () => {
    expect.hasAssertions()
    expect(
      encode({
        type: 'STORE',
        value: 'hello, world!',
      }),
    ).toStrictEqual('U1RPUkVfX2hlbGxvLCB3b3JsZCE=')
  })

  it('decode', () => {
    expect.hasAssertions()
    expect(decode('U1RPUkVfX2hlbGxvLCB3b3JsZCE=')).toStrictEqual({
      type: 'STORE',
      value: 'hello, world!',
    })

    expect(() => {
      decode('U1RPUxvLCB3b3JsZCE=')
    }).toThrow()
  })
})
