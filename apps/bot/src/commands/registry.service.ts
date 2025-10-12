import { Injectable, Logger } from '@nestjs/common';
import {
  CacheType,
  ChatInputCommandInteraction,
  Collection,
  Interaction,
  RESTPostAPIChatInputApplicationCommandsJSONBody,
  SlashCommandBuilder
} from 'discord.js';

export type SlashCommandHandler = (
  interaction: ChatInputCommandInteraction<CacheType>
) => Promise<void>;

interface SlashCommandDefinition {
  data: SlashCommandBuilder;
  handler: SlashCommandHandler;
}

@Injectable()
export class CommandRegistry {
  private readonly logger = new Logger(CommandRegistry.name);
  private readonly commands = new Collection<string, SlashCommandDefinition>();

  constructor() {
    this.registerDefaultCommands();
  }

  getSlashCommands(): RESTPostAPIChatInputApplicationCommandsJSONBody[] {
    const commands = Array.from(this.commands.values()) as SlashCommandDefinition[];
    return commands.map((command) => command.data.toJSON());
  }

  async handleInteraction(interaction: Interaction<CacheType>) {
    if (!interaction.isChatInputCommand()) {
      return;
    }

    const command = this.commands.get(interaction.commandName);
    if (!command) {
      this.logger.warn(`Unknown command ${interaction.commandName}`);
      return;
    }

    await command.handler(interaction as ChatInputCommandInteraction<CacheType>);
  }

  private registerDefaultCommands() {
    const ping = new SlashCommandBuilder()
      .setName('ping')
      .setDescription('Check if the ChainOps orchestrator is alive');

    this.commands.set(ping.name, {
      data: ping,
  handler: async (interaction: ChatInputCommandInteraction) => {
        await interaction.reply({
          content: '🏗️ ChainOps orchestrator online and awaiting orders.',
          ephemeral: true
        });
      }
    });
  }
}
