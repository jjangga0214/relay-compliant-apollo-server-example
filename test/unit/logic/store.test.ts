import axios from 'axios'
import { storeLoader } from '~/logic/store'

const mockedAxios = axios as jest.Mocked<typeof axios>
jest.mock('axios')

describe('read store data with various arguments combination.', () => {
  it('storeLoader.loadMany', async () => {
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
      await storeLoader.loadMany(['Walton_On_Thames', 'Hove']),
    ).toStrictEqual([
      {
        name: 'Walton_On_Thames',
        postcode: 'KT12 2SS',
        latitude: 51.387939,
        longitude: -0.41812,
      },
      {
        name: 'Hove',
        postcode: 'BN3 7PN',
        latitude: 50.837916,
        longitude: -0.17436,
      },
    ])
  })
})
