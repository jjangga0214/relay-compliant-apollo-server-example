import DataLoader from 'dataloader'
import axios from 'axios'
import deepmerge from 'deepmerge'
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

export const storeLoader = new DataLoader(async (names: readonly string[]) => {
  // A dataloader has to match sequence of output and input.
  const many = Store.findMany(names).sort((former, latter) => {
    return names.indexOf(former.name) - names.indexOf(latter.name)
  })

  return many.map(async (one) => {
    const coordinate = await storeCoordinateLoader.load(one.postcode)
    return deepmerge(one, coordinate)
  })
})
