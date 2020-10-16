import Stores from '~/model/store'

describe('read store data with various arguments combination.', () => {
  it('findOne', () => {
    expect.hasAssertions()
    expect(Stores.findOne('Worthing')).toStrictEqual({
      name: 'Worthing',
      postcode: 'BN14 9GB',
    })
  })

  it('findMany', () => {
    expect.hasAssertions()
    expect(Stores.findMany(['Worthing', 'Rustington', 'Hove'])).toStrictEqual([
      {
        name: 'Worthing',
        postcode: 'BN14 9GB',
      },
      {
        name: 'Rustington',
        postcode: 'BN16 3RT',
      },
      {
        name: 'Hove',
        postcode: 'BN3 7PN',
      },
    ])
  })
})
