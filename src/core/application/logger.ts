import { pino } from 'pino';
import { appContext } from '@/core/application/app-context';

const pinoLogger = pino({
  messageKey: 'message',
  formatters: {
    level(label) {
      return { level: label };
    },
  },
  base: undefined,
  timestamp: pino.stdTimeFunctions.isoTime,
});

function addLoggerParams() {
  const store = appContext.getStore();

  return {
    ...(store?.traceId && { 'trace-id': store.traceId }),
    ...(store?.request && {
      url: store.request.url,
      method: store.request.method,
    }),
  };
}

export const logger = {
  info: (msg: string) => {
    pinoLogger.info(addLoggerParams(), msg);
  },
  error(error: unknown, msg: string) {
    pinoLogger.error(addLoggerParams(), msg, error);
  },
  warn(error: unknown, msg: string) {
    pinoLogger.warn(addLoggerParams(), msg, error);
  },
};
