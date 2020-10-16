import _data from './stores.json'

export interface Store {
  name: string
  postcode: string
}

export const data: readonly Store[] = _data

export default {
  findMany(names: readonly string[]) {
    // This is O(n), but in production, real database should be indexed.
    return data.filter((store) => names.includes(store.name))
  },
  findOne(name: string) {
    // This is O(n), but in production, real database should be indexed.
    return data.find((store) => store.name === name) || null
  },
  // paginate,
  totalCount() {
    return data.length
  },
}
