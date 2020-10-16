import DataLoader from 'dataloader'
import axios from 'axios'
import filterAsync from 'node-filter-async'
import Stores, { data, Store } from '~/model/store'

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
    Stores.findMany(names).sort(
      // A dataloader has to match sequence of output and input.
      (former, latter) =>
        names.indexOf(former.name) - names.indexOf(latter.name),
    ),
  )
})

interface Edge {
  cursor: number
  node: Store & {
    longitude?: number
    latitude?: number
  }
}
export async function paginate({
  afterIndex = -1,
  beforeIndex = Stores.totalCount(),
  first,
  last,
  mapper = (_) => Promise.resolve(_),
  where = (_) => Promise.resolve(true),
}: {
  afterIndex?: number
  beforeIndex?: number
  first?: number | null | undefined
  last?: number | null | undefined
  mapper?: (edge: Edge) => Promise<Edge>
  where?: (edge: Edge) => Promise<boolean>
}) {
  if (afterIndex < -1) {
    throw new Error(`'afterIndex' has to be greater than or equal to -1.`)
  } else if (beforeIndex < 0) {
    throw new Error(`'beforeIndex' has to be greater than or equal to 0.`)
  }

  const between: Edge[] = await filterAsync(
    await Promise.all(
      data
        .slice(afterIndex + 1, beforeIndex)
        .map((el, index) => ({ cursor: afterIndex + 1 + index, node: el }))
        .map(mapper),
    ),
    where,
  )

  let edges: Edge[]

  if (first) {
    if (first < 0) {
      throw new Error(`'first' has to be greater than 0.`)
    }
    edges = between.slice(0, first)
  } else if (last) {
    if (last < 0) {
      throw new Error(`'last' has to be greater than 0.`)
    }
    edges = between.slice(-last)
  } else {
    edges = between
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
