import pino from 'pino';

const level = process.env.LOG_LEVEL ?? (process.env.CI ? 'info' : 'debug');

const transport = process.env.CI
  ? undefined
  : pino.transport({
      target: 'pino-pretty',
      options: {
        colorize: true,
        translateTime: 'SYS:standard',
        ignore: 'pid,hostname',
      },
    });

export const logger = pino(
  {
    level,
    base: undefined, // omit pid/hostname for cleaner test logs
    timestamp: pino.stdTimeFunctions.isoTime,
  },
  transport
);
