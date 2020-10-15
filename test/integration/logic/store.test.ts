import { storeCoordinateLoader } from '~/logic/store'

describe('fetch coordinates by postcode in batch.', () => {
  it('loadMany', async () => {
    expect.hasAssertions()

    expect(
      await storeCoordinateLoader.loadMany(['OX49 5NU', 'M32 0JG']),
    ).toMatchObject([
      { longitude: -1.069752, latitude: 51.655929 },
      { longitude: -2.302836, latitude: 53.455654 },
    ])
  })
})
