import { AGClientSocket } from 'socketcluster-client'
import { SpecEvent } from '@spec.types/spec'

export type StringKeyMap = { [key: string]: any }

export type SpecEventClientOptions = AGClientSocket.ClientOptions & {
    oneSubPerChannel?: boolean
    signedAuthToken?: string | null
    onConnect?: () => void
}

export type EventCallback = (event: SpecEvent) => void

export {
    SpecEvent,
    SpecEventOrigin,
    Timestamp,
    ChainId,
    BlockNumber,
    BlockHash,
    TransactionHash,
    Address,
} from '@spec.types/spec'
