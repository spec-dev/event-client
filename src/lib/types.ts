import { SpecEvent } from '@spec.types/spec'
export { SpecEvent, SpecEventOrigin } from '@spec.types/spec'
import { AGClientSocket } from 'socketcluster-client'
export type StringKeyMap = { [key: string]: any }

export type SpecEventClientOptions = AGClientSocket.ClientOptions & {
    oneSubPerChannel?: boolean
    signedAuthToken?: string | null
    onConnect?: () => void
}

export type EventCallback =
    | ((event: SpecEvent<StringKeyMap | StringKeyMap[]>) => void)
    | ((events: SpecEvent<StringKeyMap | StringKeyMap[]>[]) => void)
    | ((data: any) => void)
