import { type LoggerOptions, pino } from 'pino';
import { type LogData, pinoLambdaDestination, PinoLogFormatter } from 'pino-lambda';
import { Environment, NODE_ENV } from '@repo/mode';

const optionsOrStream: LoggerOptions = {
  base: undefined,
  transport: {
    targets: [
      { target: NODE_ENV === Environment.Production ? 'pino/file' : 'pino-pretty', options: { destination: 1 } },
    ],
  },
};

class CustomLogFormatter extends PinoLogFormatter {
  format(data: LogData & { pid?: string; hostname?: string }): string {
    delete data.pid;
    delete data.hostname;
    return super.format(data);
  }
}

export const logger =
  process.env.IS_LAMBDA === 'true'
    ? pino(
        pinoLambdaDestination({
          formatter: new CustomLogFormatter(),
        }),
      )
    : pino(optionsOrStream);

export { lambdaRequestTracker } from 'pino-lambda';
