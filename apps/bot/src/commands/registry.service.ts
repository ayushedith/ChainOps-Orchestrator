import { Injectable, Logger } from '@nestjs/common';
import { DeploymentsService } from '../deployments/deployments.service';
import {
  CacheType,
  ChatInputCommandInteraction,
  Collection,
  EmbedBuilder,
  Interaction,
  RESTPostAPIChatInputApplicationCommandsJSONBody,
  SlashCommandBuilder,
  SlashCommandOptionsOnlyBuilder,
  SlashCommandSubcommandsOnlyBuilder,
  inlineCode,
  bold,
  time
} from 'discord.js';

export type SlashCommandHandler = (
  interaction: ChatInputCommandInteraction<CacheType>
) => Promise<void>;

type SlashCommandData =
  | SlashCommandBuilder
  | SlashCommandOptionsOnlyBuilder
  | SlashCommandSubcommandsOnlyBuilder;

interface SlashCommandDefinition {
  data: SlashCommandData;
  handler: SlashCommandHandler;
}

@Injectable()
export class CommandRegistry {
  private readonly logger = new Logger(CommandRegistry.name);
  private readonly commands = new Collection<string, SlashCommandDefinition>();

  constructor(private readonly deployments: DeploymentsService) {
    this.registerDefaultCommands();
  }

  getSlashCommands(): RESTPostAPIChatInputApplicationCommandsJSONBody[] {
    return Array.from(this.commands.values()).map((command) => command.data.toJSON());
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
    this.registerPingCommand();
    this.registerStatusCommand();
    this.registerDeploymentsCommand();
  }

  private registerPingCommand() {
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

  private registerStatusCommand() {
    const status = new SlashCommandBuilder()
      .setName('status')
      .setDescription('View orchestrator health and deployment throughput')
      .addIntegerOption((option) =>
        option
          .setName('hours')
          .setDescription('Lookback window in hours (default: 24)')
          .setMinValue(1)
          .setMaxValue(168)
      );

    this.commands.set(status.name, {
      data: status,
      handler: async (interaction: ChatInputCommandInteraction) => {
        await interaction.deferReply({ ephemeral: true });
        const hours = interaction.options.getInteger('hours') ?? 24;
        const snapshot = await this.deployments.getOperationsSnapshot(hours);

        const embed = new EmbedBuilder()
          .setColor(0x10b981)
          .setTitle('ChainOps Orchestrator')
          .setDescription(
            `Operational snapshot across the last **${hours}h**. Keep shipping, keep watching.`
          )
          .addFields([
            {
              name: 'Deployments (window)',
              value: `${snapshot.metrics.windowDeployments} • ${snapshot.metrics.successRate}% success`,
              inline: true
            },
            {
              name: 'Failures',
              value: `${snapshot.metrics.failedDeployments}`,
              inline: true
            },
            {
              name: 'All-time',
              value: `${snapshot.metrics.totalDeployments}`,
              inline: true
            }
          ]);

        if (snapshot.activeRuns.length > 0) {
          const activeLines = snapshot.activeRuns.map((run) => {
            const started = time(run.startedAt, 'R');
            const pipeline = run.pipeline?.name ? ` · ${run.pipeline.name}` : '';
            return `🟡 ${bold(run.project.name)}${pipeline}\n${inlineCode(run.commitHash.slice(0, 8))} • started ${started}`;
          });

          embed.addFields({
            name: 'Active Runbooks',
            value: activeLines.join('\n\n')
          });
        }

        if (snapshot.topProjects.length > 0) {
          const projectLines = snapshot.topProjects.map((project, index) => {
            const medal = ['🥇', '🥈', '🥉'][index] ?? '⚙️';
            return `${medal} ${bold(project.name)} • ${project._count.deployments} ships`;
          });

          embed.addFields({
            name: 'Top Motion Projects',
            value: projectLines.join('\n'),
            inline: false
          });
        }

        if (snapshot.latestDeployment) {
          const latest = snapshot.latestDeployment;
          const pipeline = latest.pipeline?.name ? ` (${latest.pipeline.name})` : '';
          embed.setFooter({
            text: `Last ship: ${latest.project.name}${pipeline} • ${latest.status}`
          });
        }

        await interaction.editReply({ embeds: [embed] });
      }
    });
  }

  private registerDeploymentsCommand() {
    const deployments = new SlashCommandBuilder()
      .setName('deployments')
      .setDescription('Inspect orchestrated deployments')
      .addSubcommand((sub) =>
        sub
          .setName('recent')
          .setDescription('List the most recent deployments')
          .addIntegerOption((option) =>
            option
              .setName('limit')
              .setDescription('Number of deployments to show (default: 5)')
              .setMinValue(1)
              .setMaxValue(20)
          )
          .addStringOption((option) =>
            option
              .setName('project')
              .setDescription('Filter by project slug')
              .setRequired(false)
          )
      )
      .addSubcommand((sub) =>
        sub
          .setName('details')
          .setDescription('Show a deployment timeline')
          .addStringOption((option) =>
            option
              .setName('id')
              .setDescription('Deployment ID')
              .setRequired(true)
          )
      );

    this.commands.set(deployments.name, {
      data: deployments,
      handler: async (interaction: ChatInputCommandInteraction) => {
        await interaction.deferReply({ ephemeral: true });
        const subcommand = interaction.options.getSubcommand();

        if (subcommand === 'recent') {
          await this.handleRecentDeployments(interaction);
        } else if (subcommand === 'details') {
          await this.handleDeploymentDetails(interaction);
        }
      }
    });
  }

  private async handleRecentDeployments(interaction: ChatInputCommandInteraction) {
    const limit = interaction.options.getInteger('limit') ?? 5;
    const project = interaction.options.getString('project') ?? undefined;
    const deployments = await this.deployments.findRecent(limit, project);

    if (deployments.length === 0) {
      await interaction.editReply({
        content: project
          ? `No deployments found for project \`${project}\` just yet.`
          : 'No deployments recorded yet. Time to ship something?'
      });
      return;
    }

    const lines = deployments.map((deployment) => {
      const started = time(deployment.startedAt, 'R');
      const pipeline = deployment.pipeline ? ` · ${deployment.pipeline}` : '';
      const statusEmoji = this.statusToEmoji(deployment.status);
      return `${statusEmoji} ${bold(deployment.project)}${pipeline}\n${inlineCode(deployment.commitHash.slice(0, 8))} • initiated by ${deployment.initiator} • ${started}`;
    });

    const embed = new EmbedBuilder()
      .setColor(0x38bdf8)
      .setTitle('Latest Deployment Runs')
      .setDescription(lines.join('\n\n'))
      .setFooter({ text: project ? `Filtered by project: ${project}` : 'Global feed' });

    await interaction.editReply({ embeds: [embed] });
  }

  private async handleDeploymentDetails(interaction: ChatInputCommandInteraction) {
    const id = interaction.options.getString('id', true);
    const deployment = await this.deployments.findOne(id);

    if (!deployment) {
      await interaction.editReply({
        content: `Could not find deployment with id ${inlineCode(id)}.`
      });
      return;
    }

    const pipeline = deployment.pipeline?.name ? ` · ${deployment.pipeline.name}` : '';
    const started = time(deployment.startedAt, 'R');
    const completed = deployment.completedAt
      ? time(deployment.completedAt, 'R')
      : 'still in motion';

    const embed = new EmbedBuilder()
      .setColor(this.statusColor(deployment.status))
      .setTitle(`Deployment ${deployment.id}`)
      .setDescription(
        `${this.statusToEmoji(deployment.status)} ${bold(deployment.project.name)}${pipeline}\n${inlineCode(deployment.commitHash)} • kicked by ${deployment.initiator}`
      )
      .addFields(
        { name: 'Started', value: started, inline: true },
        { name: 'Completed', value: `${completed}`, inline: true }
      );

    const events = deployment.events.slice(-5);
    if (events.length > 0) {
      const eventLines = events.map((event) => {
        const stamp = time(event.occurredAt, 'R');
        return `${this.levelToEmoji(event.level)} ${bold(event.source)} • ${stamp}\n${event.message}`;
      });
      embed.addFields({ name: 'Recent Timeline', value: eventLines.join('\n\n') });
    }

    await interaction.editReply({ embeds: [embed] });
  }

  private statusToEmoji(status: string) {
    switch (status) {
      case 'SUCCESS':
        return '🟢';
      case 'RUNNING':
        return '🟡';
      case 'PENDING':
        return '🟠';
      case 'FAILED':
        return '🔴';
      case 'REJECTED':
        return '⚫';
      case 'CANCELLED':
        return '⚪';
      default:
        return '⚙️';
    }
  }

  private statusColor(status: string) {
    switch (status) {
      case 'SUCCESS':
        return 0x10b981;
      case 'FAILED':
        return 0xef4444;
      case 'RUNNING':
        return 0xfbbf24;
      case 'PENDING':
        return 0xf97316;
      default:
        return 0x64748b;
    }
  }

  private levelToEmoji(level?: string | null) {
    switch (level) {
      case 'ERROR':
        return '❗';
      case 'WARN':
        return '⚠️';
      case 'DEBUG':
        return '🐛';
      default:
        return 'ℹ️';
    }
  }
}
