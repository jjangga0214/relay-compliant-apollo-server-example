import Store from '~/model/store'

describe('read store data with various arguments combination.', () => {
  it('findOne', () => {
    expect.hasAssertions()
    expect(Store.findOne('Worthing')).toStrictEqual({
      name: 'Worthing',
      postcode: 'BN14 9GB',
    })
  })
  it('findForward', () => {
    expect(Store.findForward({ first: 3, afterIndex: 2 })).toStrictEqual([
      {
        name: 'Rustington',
        postcode: 'BN16 3RT',
      },
      {
        name: 'Eastbourne',
        postcode: 'BN23 6QD',
      },
      {
        name: 'Hove',
        postcode: 'BN3 7PN',
      },
    ])

    expect(Store.findForward({ first: 100, afterIndex: 92 })).toStrictEqual([
      {
        name: 'Watford',
        postcode: 'WD17 2SF',
      },
      {
        name: 'Borehamwood',
        postcode: 'WD6 4PR',
      },
    ])

    expect(Store.findForward({ first: 2 })).toStrictEqual([
      {
        name: 'St_Albans',
        postcode: 'AL1 2RJ',
      },
      {
        name: 'Hatfield',
        postcode: 'AL9 5JP',
      },
    ])

    expect(Store.findForward({ first: 10, afterIndex: 10000 })).toStrictEqual(
      [],
    )
  })
  /**
   * TODO: add tests for Store.findBackward
   */
})
