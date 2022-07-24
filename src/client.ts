import config from './lib/config'
import { SpecEventClientOptions, EventCallback } from './lib/types'
import { create as createSocket, AGClientSocket } from 'socketcluster-client'

const DEFAULT_OPTIONS = {
    hostname: config.HOSTNAME,
    port: config.PORT,
}

/**
 * Spec Event Client.
 *
 * A Javascript client for publishing and subscribing to Spec's event network.
 */
export default class SpecEventClient {
    socket: AGClientSocket

    protected hostname: string
    protected port: number

    /**
     * Create a new Spec client instance.
     */
    constructor(options?: SpecEventClientOptions) {
        const settings = { ...DEFAULT_OPTIONS, ...options }
        this.hostname = settings.hostname
        this.port = settings.port
        this.socket = this._initSocket()
    }

    on(event: string, cb: EventCallback) {
        ;(async () => {
            for await (const data of this.socket.subscribe(event)) {
                cb(data)
            }
        })()
    }

    _initSocket(): AGClientSocket {
        return createSocket({
            hostname: this.hostname,
            port: this.port,
        })
    }
}
