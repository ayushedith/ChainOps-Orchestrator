import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ScheduleModule } from '@nestjs/schedule';
import { TerminusModule } from '@nestjs/terminus';
import { LoggerModule } from 'nestjs-pino';
import { DiscordModule } from './commands/discord.module';
import { HealthModule } from './infra/health.module';
import configuration from './config/configuration';
import { PrismaModule } from './prisma/prisma.module';
import { DeploymentsModule } from './deployments/deployments.module';

@Module({
  imports: [
    LoggerModule.forRoot({
      pinoHttp: {
        level: process.env.NODE_ENV === 'production' ? 'info' : 'debug',
        transport:
          process.env.NODE_ENV === 'production'
            ? undefined
            : {
                target: 'pino-pretty',
                options: { colorize: true, singleLine: true }
              }
      }
    }),
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env.local', '.env', '../../.env.local', '../../.env'],
      load: [configuration]
    }),
    ScheduleModule.forRoot(),
    TerminusModule,
    PrismaModule,
    DiscordModule,
    HealthModule,
    DeploymentsModule
  ]
})
export class AppModule {}
