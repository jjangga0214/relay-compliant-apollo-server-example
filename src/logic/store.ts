import DataLoader from 'dataloader'
import axios from 'axios'
import Store from '~/model/store'

interface Coordinate {
  longitude: number
  latitude: number
}

async function fetchCoordinate(
  postcodes: readonly string[],
): Promise<Coordinate[]> {
  const {
    data: { result },
  } = (await axios.post('https://api.postcodes.io/postcodes', {
    postcodes,
  })) as { data: { result: { result: Coordinate }[] } }
  return result.map((el) => el.result)
}

export const storeCoordinateLoader = new DataLoader(fetchCoordinate)

/**
 * As there are not many types, storeLoader is not useful,
 * because Store.findMany can replace it, as there's no need for batch, actually.
 * However, this is implemented as an example.
 */
export const storeLoader = new DataLoader((names: readonly string[]) => {
  return Promise.resolve(
    Store.findMany(names).sort(
      // A dataloader has to match sequence of output and input.
      (former, latter) =>
        names.indexOf(former.name) - names.indexOf(latter.name),
    ),
  )
})
