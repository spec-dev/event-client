import SpecEventClient from './client'

/**
 * Creates a new Spec Event Client.
 */
const createEventClient = (): SpecEventClient => {
    return new SpecEventClient()
}

export { createEventClient, SpecEventClient }
