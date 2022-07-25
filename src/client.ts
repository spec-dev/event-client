import config from './lib/config'
import { SpecEventClientOptions, EventCallback } from './lib/types'
import { create as createSocket, AGClientSocket } from 'socketcluster-client'
import logger from './lib/logger'

const DEFAULT_OPTIONS = {
    hostname: config.HOSTNAME,
    port: config.PORT,
    oneSubPerChannel: true,
    onConnect: () => {},
}

/**
 * Spec Event Client.
 *
 * A Javascript client for publishing and subscribing to Spec's event network.
 */
export default class SpecEventClient {
    socket: AGClientSocket

    channelSubs: Set<string>

    protected hostname: string
    protected port: number
    protected oneSubPerChannel: boolean
    protected onConnect: () => void

    /**
     * Create a new Spec client instance.
     */
    constructor(options?: SpecEventClientOptions) {
        const settings = { ...DEFAULT_OPTIONS, ...options }
        this.hostname = settings.hostname
        this.port = settings.port
        this.oneSubPerChannel = settings.oneSubPerChannel
        this.onConnect = settings.onConnect
        this.channelSubs = new Set<string>()
        this.socket = this._initSocket()
    }

    on(channelName: string, cb: EventCallback) {
        if (this.oneSubPerChannel && this.channelSubs.has(channelName)) {
            logger.warn(`Already subscribed to channel ${channelName}.`)
            return
        }
        
        ;(async () => {
            const channel = this.socket.subscribe(channelName)
            logger.info(`Subscribed to channel ${channelName}.`)

            for await (const data of channel) {
                cb(data)
            }
        })()

        this.channelSubs.add(channelName)
    }

    _initSocket(): AGClientSocket {
        const socket = createSocket({
            hostname: this.hostname,
            port: this.port,
        })

        ;(async () => {
            for await (let event of socket.listener('connect')) {
                logger.info('Socket connected.')
                this.onConnect()
            }
        })()

        return socket
    }
}
