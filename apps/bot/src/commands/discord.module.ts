import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { DeploymentsModule } from '../deployments/deployments.module';
import { DiscordClientProvider } from './discord.provider';
import { DiscordBootstrapService } from './discord.service';
import { CommandRegistry } from './registry.service';

@Module({
  imports: [ConfigModule, DeploymentsModule],
  providers: [DiscordClientProvider, DiscordBootstrapService, CommandRegistry],
  exports: [DiscordBootstrapService]
})
export class DiscordModule {}
