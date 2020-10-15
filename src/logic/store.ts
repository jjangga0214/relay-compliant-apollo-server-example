import DataLoader from 'dataloader'
import axios from 'axios'
import deepmerge from 'deepmerge'
import Store from '~/model/store'

export interface Coordinate {
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

export async function findOne(name: string) {
  const one = Store.findOne(name)
  if (!one) {
    return one
  }
  const coordinate = await storeCoordinateLoader.load(one.postcode)
  return deepmerge(one, coordinate)
}
