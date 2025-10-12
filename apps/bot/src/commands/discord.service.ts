import { Inject, Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { CacheType, Client, Interaction, REST, Routes } from 'discord.js';
import { CommandRegistry } from './registry.service';

@Injectable()
export class DiscordBootstrapService {
  private readonly logger = new Logger(DiscordBootstrapService.name);
  private readonly rest: REST;

  constructor(
    @Inject(Client) private readonly client: Client,
    private readonly config: ConfigService,
    private readonly registry: CommandRegistry
  ) {
    const token = this.config.get<string>('discord.token');
    this.rest = new REST({ version: '10' }).setToken(token ?? '');
  }

  async init() {
    const clientId = this.config.get<string>('discord.clientId');
    if (!clientId) {
      throw new Error('Discord client id missing');
    }

    const commands = this.registry.getSlashCommands();
    this.logger.log(`Registering ${commands.length} application commands`);
    await this.rest.put(Routes.applicationCommands(clientId), { body: commands });

    this.client.on('ready', () => {
      this.logger.log(`Logged in as ${this.client.user?.tag}`);
    });

    this.client.on('interactionCreate', async (interaction: Interaction<CacheType>) => {
      await this.registry.handleInteraction(interaction);
    });
  }
}
