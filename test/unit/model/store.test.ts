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

  it('paginate', () => {
    expect(Stores.paginate({ first: 3, afterIndex: 2 })).toStrictEqual([
      {
        cursor: 3,
        node: {
          name: 'Rustington',
          postcode: 'BN16 3RT',
        },
      },
      {
        cursor: 4,
        node: {
          name: 'Eastbourne',
          postcode: 'BN23 6QD',
        },
      },
      {
        cursor: 5,
        node: {
          name: 'Hove',
          postcode: 'BN3 7PN',
        },
      },
    ])

    expect(Stores.paginate({ first: 100, afterIndex: 92 })).toStrictEqual([
      {
        cursor: 93,
        node: {
          name: 'Watford',
          postcode: 'WD17 2SF',
        },
      },
      {
        cursor: 94,
        node: {
          name: 'Borehamwood',
          postcode: 'WD6 4PR',
        },
      },
    ])

    expect(Stores.paginate({ first: 2 })).toStrictEqual([
      {
        cursor: 0,
        node: {
          name: 'St_Albans',
          postcode: 'AL1 2RJ',
        },
      },
      {
        cursor: 1,
        node: {
          name: 'Hatfield',
          postcode: 'AL9 5JP',
        },
      },
    ])

    expect(Stores.paginate({ first: 10, afterIndex: 10000 })).toStrictEqual([])
  })
  /**
   * TODO: add tests for Store.findBackward
   */
})
