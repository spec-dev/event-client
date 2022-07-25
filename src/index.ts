import SpecEventClient from './client'
import { SpecEventClientOptions } from './lib/types'

/**
 * Creates a new Spec Event Client.
 */
const createEventClient = (options?: SpecEventClientOptions): SpecEventClient => {
    return new SpecEventClient(options)
}

export { createEventClient, SpecEventClient, SpecEventClientOptions }
