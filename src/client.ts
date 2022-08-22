import config from './lib/config'
import { SpecEventClientOptions, EventCallback } from './lib/types'
import { create as createSocket, AGClientSocket } from 'socketcluster-client'
import logger from './lib/logger'
import { AGAuthEngine, AuthToken, SignedAuthToken } from 'socketcluster-client/lib/auth'

const DEFAULT_OPTIONS = {
    hostname: config.HOSTNAME,
    port: config.PORT,
    oneSubPerChannel: true,
    signedAuthToken: null,
    onConnect: () => {},
}

/**
 * Spec Event Client.
 *
 * A Javascript client for subscribing to Spec's event network.
 */
export default class SpecEventClient {
    socket: AGClientSocket

    channelSubs: Set<string>

    protected hostname: string
    protected port: number
    protected oneSubPerChannel: boolean
    protected signedAuthToken: string | null
    protected onConnect: () => void

    /**
     * Create a new client instance.
     */
    constructor(options?: SpecEventClientOptions) {
        const settings = { ...DEFAULT_OPTIONS, ...options }
        this.hostname = settings.hostname
        this.port = settings.port
        this.oneSubPerChannel = settings.oneSubPerChannel
        this.signedAuthToken = settings.signedAuthToken
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

    async off(channelName: string) {
        await this.socket.unsubscribe(channelName)
        this.channelSubs.delete(channelName)
    }

    _initSocket(): AGClientSocket {
        const options: AGClientSocket.ClientOptions = {
            hostname: this.hostname,
            port: this.port,
        }

        if (this.signedAuthToken) {
            options.authEngine = this._serverSideAuthEngine()
        }

        const socket = createSocket(options)

        ;(async () => {
            for await (let event of socket.listener('connect')) {
                logger.info('Socket connected.')
                this.onConnect()
            }
        })()

        return socket
    }

    _serverSideAuthEngine(): AGAuthEngine {
        return {
            saveToken: async (
                name: string,
                token: AuthToken | SignedAuthToken,
                options?: { [key: string]: any }
            ) => this.signedAuthToken as string,
            removeToken: async (name: string) => null,
            loadToken: async (name: string) => this.signedAuthToken,
        }
    }
}
