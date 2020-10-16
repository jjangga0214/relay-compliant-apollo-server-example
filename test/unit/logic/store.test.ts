import axios from 'axios'
import { storeCoordinateLoader } from '~/logic/store'

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
})
