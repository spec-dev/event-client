import config from './config'

class Logger {
    info(...args: any[]) {
        config.DEBUG && console.log(...args)
    }
    warn(...args: any[]) {
        config.DEBUG && console.warn(...args)
    }
    error(...args: any[]) {
        console.error(...args)
    }
}

const logger: Logger = new Logger()

export default logger
