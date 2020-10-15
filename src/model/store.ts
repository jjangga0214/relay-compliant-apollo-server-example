import _data from './stores.json'

export interface Store {
  name: string
  postcode: string
}

const data: readonly Store[] = _data

interface FindForwardOption {
  first: number
  afterIndex?: number
}

function findForward({ first, afterIndex = -1 }: FindForwardOption) {
  if (afterIndex < -1) {
    throw new Error("'afterIndex' should be greater than or equal to -1.")
  }
  if (first <= 0) {
    throw new Error("'first' should be greater than 0.")
  }
  return data.slice(afterIndex + 1, afterIndex + 1 + first)
}

interface FindBackwardOption {
  last: number
  beforeIndex?: number
}

function findBackward({ last, beforeIndex = data.length }: FindBackwardOption) {
  if (beforeIndex > data.length) {
    throw new Error(
      "'beforeIndex' should be less than or equal to size of total dataset.",
    )
  }
  if (last <= 0) {
    throw new Error("'last' should be greater than 0.")
  }
  let start = beforeIndex - last
  start = start < 0 ? 0 : start
  return data.slice(start, beforeIndex)
}
export default {
  findMany(names: readonly string[]) {
    // This is O(n), but in production, real database should be indexed.
    return data.filter((store) => names.includes(store.name))
  },
  findOne(name: string) {
    // This is O(n), but in production, real database should be indexed.
    return data.find((store) => store.name === name) || null
  },
  findForward,
  findBackward,
}
