import config from './lib/config'
import { SpecEventClientOptions, EventCallback, StringKeyMap } from './lib/types'
import { create as createSocket, AGClientSocket } from 'socketcluster-client'
import logger from './lib/logger'
import { AGAuthEngine, AuthToken, SignedAuthToken } from 'socketcluster-client/lib/auth'
import chalk from 'chalk'

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

    options: SpecEventClientOptions

    protected oneSubPerChannel: boolean
    protected signedAuthToken: string | null
    protected onConnect: () => void

    /**
     * Create a new client instance.
     */
    constructor(options?: SpecEventClientOptions) {
        const settings = { ...DEFAULT_OPTIONS, ...(options || {}) }
        if (settings.port === 443 && !settings.hasOwnProperty('secure')) {
            settings.secure = true
        } else if (settings.secure === true && !settings.port) {
            settings.port = 443
        }

        this.options = settings
        this.oneSubPerChannel = settings.oneSubPerChannel
        this.signedAuthToken = settings.signedAuthToken
        this.onConnect = settings.onConnect
        this.channelSubs = new Set<string>()

        if (this.signedAuthToken) {
            this.options.authEngine = this._serverSideAuthEngine()
        }

        this.socket = this._initSocket()
    }

    on(channelName: string, cb: EventCallback, opts?: StringKeyMap) {
        if (this.oneSubPerChannel && this.channelSubs.has(channelName)) {
            logger.warn(`Already subscribed to channel ${channelName}.`)
            return
        }

        ;(async () => {
            const channel = this.socket.subscribe(channelName)
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

    isConnected(): boolean {
        return this.socket?.state === 'open'
    }

    _initSocket(): AGClientSocket {
        const socket = createSocket(this.options)

        ;(async () => {
            for await (let _ of socket.listener('connect')) {
                this.onConnect && this.onConnect()
            }
            for await (let { error } of socket.listener('error')) {
                logger.error(`Socket error ${error}`)
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
