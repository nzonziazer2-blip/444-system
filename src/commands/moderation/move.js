import { SlashCommandBuilder, PermissionFlagsBits } from 'discord.js';
import Guild from '../../models/Guild.js';
import { sendLog, successEmbed, errorEmbed, logEmbed } from '../../utils/helpers.js';

export default {
  data: new SlashCommandBuilder()
    .setName('move')
    .setDescription('Move a member to another voice channel')
    .addUserOption(opt => opt.setName('user').setDescription('The user to move').setRequired(true))
    .addChannelOption(opt => opt.setName('channel').setDescription('The voice channel to move to').setRequired(true))
    .setDefaultMemberPermissions(PermissionFlagsBits.MoveMembers),

  async execute(interaction) {
    const target = interaction.options.getUser('user');
    const channel = interaction.options.getChannel('channel');
    const member = interaction.guild.members.cache.get(target.id);

    if (!member?.voice.channel) return interaction.reply({ embeds: [errorEmbed('Error', 'User is not in a voice channel.')], ephemeral: true });

    await member.voice.setChannel(channel);
    await interaction.reply({ embeds: [successEmbed('Member Moved', `${target} has been moved to ${channel}.`)] });

    const guildData = await Guild.findOne({ guildId: interaction.guild.id });
    if (guildData?.moveLogsChannel) {
      const log = logEmbed('🔀 Member Moved', `**User:** ${target}\n**Moderator:** ${interaction.user}\n**Channel:** ${channel}`, 0x1abc9c);
      await sendLog(interaction.guild, guildData.moveLogsChannel, log);
    }
  }
};