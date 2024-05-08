import { parseArgs } from "./index";

const args = parseArgs(process.argv.slice(2))

const checkForLogger = (loggerName: string) => {
    const logger = args.find((arg) => arg.name == loggerName)

    if (logger) return logger.value
    return false
}

export const isDBLoggerEnabled = checkForLogger('dblogger')