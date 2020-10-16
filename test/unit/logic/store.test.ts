import axios from 'axios'
import { storeCoordinateLoader, paginate } from '~/logic/store'

const mockedAxios = axios as jest.Mocked<typeof axios>
jest.mock('axios')

describe('read store data with coordinate dynamically loaded.', () => {
  it('storeCoordinateLoader.loadMany', async () => {
    mockedAxios.post.mockResolvedValue({
      data: {
        result: [
          {
            result: {
              latitude: 51.387939,
              longitude: -0.41812,
            },
          },
          {
            result: {
              latitude: 50.837916,
              longitude: -0.17436,
            },
          },
        ],
      },
    })

    expect.hasAssertions()
    expect(
      await storeCoordinateLoader.loadMany(['Walton_On_Thames', 'Hove']),
    ).toStrictEqual([
      {
        latitude: 51.387939,
        longitude: -0.41812,
      },
      {
        latitude: 50.837916,
        longitude: -0.17436,
      },
    ])
  })

  it('paginate', async () => {
    expect(await paginate({ first: 3, afterIndex: 2 })).toStrictEqual({
      edges: [
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
      ],
      pageInfo: {
        endCursor: 5,
        hasNextPage: true,
        hasPreviousPage: true,
        startCursor: 3,
      },
    })

    expect(await paginate({ first: 100, afterIndex: 92 })).toStrictEqual({
      edges: [
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
      ],
      pageInfo: {
        endCursor: 94,
        hasNextPage: true,
        hasPreviousPage: true,
        startCursor: 93,
      },
    })

    expect(await paginate({ first: 2 })).toStrictEqual({
      edges: [
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
      ],
      pageInfo: {
        endCursor: 1,
        hasNextPage: true,
        hasPreviousPage: false,
        startCursor: 0,
      },
    })

    expect(await paginate({ first: 10, afterIndex: 10000 })).toStrictEqual({
      edges: [],
      pageInfo: {
        endCursor: null,
        hasNextPage: true,
        hasPreviousPage: true,
        startCursor: null,
      },
    })
  })
})
