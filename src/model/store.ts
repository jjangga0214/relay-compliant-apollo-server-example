import _data from './stores.json'

export interface Store {
  name: string
  postcode: string
}

const data: readonly Store[] = _data

function paginate({
  afterIndex = -1,
  beforeIndex = data.length,
  first,
  last,
}: {
  afterIndex?: number
  beforeIndex?: number
  first?: number | null | undefined
  last?: number | null | undefined
}) {
  if (afterIndex < -1) {
    throw new Error(`'afterIndex' has to be greater than or equal to -1.`)
  } else if (beforeIndex < 0) {
    throw new Error(`'beforeIndex' has to be greater than or equal to 0.`)
  }
  const between = data.slice(afterIndex + 1, beforeIndex)

  let edges: { cursor: number; node: Store }[]

  if (first) {
    if (first < 0) {
      throw new Error(`'first' has to be greater than 0.`)
    }
    edges = between
      .slice(0, first)
      .map((el, index) => ({ cursor: afterIndex + 1 + index, node: el }))
  } else if (last) {
    if (last < 0) {
      throw new Error(`'last' has to be greater than 0.`)
    }
    edges = between.slice(-last).map((el, index) => ({
      cursor: (beforeIndex - last > 0 ? beforeIndex - last : 0) + index,
      node: el,
    }))
  } else {
    edges = between.map((el, index) => ({
      cursor: afterIndex + 1 + index,
      node: el,
    }))
  }
  const endCursor = edges.length ? edges[edges.length - 1].cursor : null
  const startCursor = edges.length ? edges[0].cursor : null
  const pageInfo = {
    hasNextPage:
      endCursor !== null ? endCursor < data.length : beforeIndex <= data.length,
    endCursor,
    startCursor,
    hasPreviousPage: startCursor !== null ? startCursor > 0 : afterIndex >= 0,
  }

  return {
    edges,
    pageInfo,
  }
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
  paginate,
  totalCount() {
    return data.length
  },
}
