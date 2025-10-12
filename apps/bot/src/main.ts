import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { LoggerErrorInterceptor } from 'nestjs-pino';
import { DiscordBootstrapService } from './commands/discord.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    bufferLogs: true
  });
  app.useLogger(app.get(Logger));
  app.useGlobalInterceptors(new LoggerErrorInterceptor());

  const config = app.get(ConfigService);
  const port = config.get<number>('http.port', 3001);

  await app.listen(port);
  const discordService = app.get(DiscordBootstrapService);
  await discordService.init();

  Logger.log(`ChainOps bot listening on port ${port}`);
}

bootstrap().catch((error) => {
  Logger.error('Failed to bootstrap bot', error);
  process.exit(1);
});
