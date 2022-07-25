export type SpecEventClientOptions = {
    hostname?: string
    port?: number
    oneSubPerChannel?: boolean
    onConnect?: () => void
}

export type EventCallback = (data: any) => void
