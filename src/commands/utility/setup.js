import { SlashCommandBuilder, PermissionFlagsBits } from 'discord.js';
import Guild from '../../models/Guild.js';
import { successEmbed, errorEmbed } from '../../utils/helpers.js';

export default {
  data: new SlashCommandBuilder()
    .setName('setup')
    .setDescription('Setup bot channels')
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
    .addSubcommand(sub => sub
      .setName('welcome')
      .setDescription('Set the welcome channel')
      .addChannelOption(opt => opt.setName('channel').setDescription('Welcome channel').setRequired(true)))
    .addSubcommand(sub => sub
      .setName('leave')
      .setDescription('Set the leave channel')
      .addChannelOption(opt => opt.setName('channel').setDescription('Leave channel').setRequired(true)))
    .addSubcommand(sub => sub
      .setName('warnlogs')
      .setDescription('Set the warn logs channel')
      .addChannelOption(opt => opt.setName('channel').setDescription('Warn logs channel').setRequired(true)))
    .addSubcommand(sub => sub
      .setName('timeoutlogs')
      .setDescription('Set the timeout logs channel')
      .addChannelOption(opt => opt.setName('channel').setDescription('Timeout logs channel').setRequired(true)))
    .addSubcommand(sub => sub
      .setName('kicklogs')
      .setDescription('Set the kick logs channel')
      .addChannelOption(opt => opt.setName('channel').setDescription('Kick logs channel').setRequired(true)))
    .addSubcommand(sub => sub
      .setName('banlogs')
      .setDescription('Set the ban logs channel')
      .addChannelOption(opt => opt.setName('channel').setDescription('Ban logs channel').setRequired(true)))
    .addSubcommand(sub => sub
      .setName('unbanlogs')
      .setDescription('Set the unban logs channel')
      .addChannelOption(opt => opt.setName('channel').setDescription('Unban logs channel').setRequired(true)))
    .addSubcommand(sub => sub
      .setName('movelogs')
      .setDescription('Set the move logs channel')
      .addChannelOption(opt => opt.setName('channel').setDescription('Move logs channel').setRequired(true)))
    .addSubcommand(sub => sub
      .setName('mutelogs')
      .setDescription('Set the mute logs channel')
      .addChannelOption(opt => opt.setName('channel').setDescription('Mute logs channel').setRequired(true)))
    .addSubcommand(sub => sub
      .setName('messagelogs')
      .setDescription('Set the message logs channel')
      .addChannelOption(opt => opt.setName('channel').setDescription('Message logs channel').setRequired(true)))
    .addSubcommand(sub => sub
      .setName('rolelogs')
      .setDescription('Set the role logs channel')
      .addChannelOption(opt => opt.setName('channel').setDescription('Role logs channel').setRequired(true)))
    .addSubcommand(sub => sub
      .setName('channellogs')
      .setDescription('Set the channel logs channel')
      .addChannelOption(opt => opt.setName('channel').setDescription('Channel logs channel').setRequired(true)))
    .addSubcommand(sub => sub
      .setName('nicklogs')
      .setDescription('Set the nickname logs channel')
      .addChannelOption(opt => opt.setName('channel').setDescription('Nick logs channel').setRequired(true)))
    .addSubcommand(sub => sub
      .setName('disconnectlogs')
      .setDescription('Set the disconnect logs channel')
      .addChannelOption(opt => opt.setName('channel').setDescription('Disconnect logs channel').setRequired(true))),

  async execute(interaction) {
    const sub = interaction.options.getSubcommand();
    const channel = interaction.options.getChannel('channel');

    const fieldMap = {
      welcome: 'welcomeChannel',
      leave: 'leaveChannel',
      warnlogs: 'warnLogsChannel',
      timeoutlogs: 'timeoutLogsChannel',
      kicklogs: 'kickLogsChannel',
      banlogs: 'banLogsChannel',
      unbanlogs: 'unbanLogsChannel',
      movelogs: 'moveLogsChannel',
      mutelogs: 'muteLogsChannel',
      messagelogs: 'messageLogsChannel',
      rolelogs: 'roleLogsChannel',
      channellogs: 'channelLogsChannel',
      nicklogs: 'nickLogsChannel',
      disconnectlogs: 'disconnectLogsChannel',
    };

    const field = fieldMap[sub];
    if (!field) return interaction.reply({ embeds: [errorEmbed('Error', 'Unknown subcommand.')], ephemeral: true });

    await Guild.findOneAndUpdate(
      { guildId: interaction.guild.id },
      { $set: { [field]: channel.id } },
      { upsert: true }
    );

    await interaction.reply({ embeds: [successEmbed('Setup Complete', `${channel} has been set as the **${sub}** channel.`)] });
  }
};