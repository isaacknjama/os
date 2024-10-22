import { Module } from '@nestjs/common';
import { LoggerModule as PinoLoggerModule } from 'nestjs-pino';

@Module({
  imports: [
    PinoLoggerModule.forRoot({
      pinoHttp: {
        transport: {
          target: 'pino-pretty',
          options: {
            singleLine: true,
          },
        },
        redact: {
          paths: ['req.headers', 'res.headers'],
          remove: true,
        },
      },
    }),
  ],
})
export class LoggerModule {}
