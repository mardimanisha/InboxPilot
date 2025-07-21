import { createLogger as createWinstonLogger, format, transports } from 'winston'
import type { Logger } from 'winston'

const { combine, timestamp, json, prettyPrint } = format

const createLogger = (serviceName: string): Logger => {
  const logger = createWinstonLogger({
    level: process.env.NODE_ENV === 'production' ? 'info' : 'debug',
    format: combine(
      timestamp(),
      json(),
      prettyPrint()
    ),
    transports: [
      new transports.Console(),
      new transports.File({ filename: 'error.log', level: 'error' }),
      new transports.File({ filename: 'combined.log' })
    ]
  })

  return logger.child({ service: serviceName })
}

export { createLogger }