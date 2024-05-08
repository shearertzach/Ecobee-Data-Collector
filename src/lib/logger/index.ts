import chalk from 'chalk'

export const authLogger = (message: string) => {
    const prefix = chalk.red.bold.underline('[Authentication]')
    console.log(prefix, message)
}

export const revisionLogger = (message: string) => {
    const prefix = chalk.yellowBright.bold.underline('[Revision]')
    console.log(prefix, message)
}

export const databaseLogger = (message: string) => {
    const prefix = chalk.greenBright.bold.underline('[Database]')
    console.log(prefix, message)
}

export const handlerLogger = (message: string) => {
    const prefix = chalk.blueBright.bold.underline('[Handler]')
    console.log(prefix, message)
}

export const consoleLogger = (message: string) => {
    const prefix = chalk.gray.bold.underline('[Console]')
    console.log(prefix, message)
}

export const thermostatLogger = (message: string) => {
    const prefix = chalk.magentaBright.bold.underline('[Thermostat]')
    console.log(prefix, message)
}