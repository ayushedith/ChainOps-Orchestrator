import { Logger as NestLogger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { LoggerErrorInterceptor, Logger as PinoLogger } from 'nestjs-pino';
import { DiscordBootstrapService } from './commands/discord.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    bufferLogs: true
  });
  const logger = app.get(PinoLogger);
  app.useLogger(logger);
  app.useGlobalInterceptors(new LoggerErrorInterceptor());

  const config = app.get(ConfigService);
  const port = config.get<number>('http.port', 3001);

  await app.listen(port);
  const discordService = app.get(DiscordBootstrapService);
  await discordService.init();

  logger.log(`ChainOps bot listening on port ${port}`);
}

bootstrap().catch((error) => {
  const logger = new NestLogger('Bootstrap');
  logger.error('Failed to bootstrap bot', error as Error);
  process.exit(1);
});
