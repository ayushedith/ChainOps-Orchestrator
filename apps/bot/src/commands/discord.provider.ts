import { Provider } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Client, GatewayIntentBits, Partials } from 'discord.js';

export const DiscordClientProvider: Provider = {
  provide: Client,
  inject: [ConfigService],
  useFactory: async (config: ConfigService) => {
    const client = new Client({
      intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages],
      partials: [Partials.Channel]
    });

    const token = config.get<string>('discord.token');
    if (!token) {
      throw new Error('Missing Discord bot token');
    }

    await client.login(token);
    return client;
  }
};
