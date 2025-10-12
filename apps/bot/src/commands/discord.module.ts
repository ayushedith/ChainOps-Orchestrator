import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { DiscordClientProvider } from './discord.provider';
import { DiscordBootstrapService } from './discord.service';
import { CommandRegistry } from './registry.service';

@Module({
  imports: [ConfigModule],
  providers: [DiscordClientProvider, DiscordBootstrapService, CommandRegistry],
  exports: [DiscordBootstrapService]
})
export class DiscordModule {}
