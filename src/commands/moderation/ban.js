import { SlashCommandBuilder, PermissionFlagsBits } from 'discord.js';
import Guild from '../../models/Guild.js';
import { sendLog, successEmbed, errorEmbed, logEmbed } from '../../utils/helpers.js';

export default {
  data: new SlashCommandBuilder()
    .setName('ban')
    .setDescription('Ban a member from the server')
    .addUserOption(opt => opt.setName('user').setDescription('The user to ban').setRequired(true))
    .addStringOption(opt => opt.setName('reason').setDescription('Reason for the ban').setRequired(false))
    .addIntegerOption(opt => opt.setName('days').setDescription('Delete messages from last X days (0-7)').setMinValue(0).setMaxValue(7))
    .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers),

  async execute(interaction) {
    const target = interaction.options.getUser('user');
    const reason = interaction.options.getString('reason') || 'No reason provided';
    const days = interaction.options.getInteger('days') || 0;
    const member = interaction.guild.members.cache.get(target.id);

    if (member && !member.bannable) return interaction.reply({ embeds: [errorEmbed('Error', 'I cannot ban this user.')], ephemeral: true });

    await interaction.guild.members.ban(target.id, { reason, deleteMessageDays: days });
    await interaction.reply({ embeds: [successEmbed('Member Banned', `${target} has been banned.\n**Reason:** ${reason}`)] });

    const guildData = await Guild.findOne({ guildId: interaction.guild.id });
    if (guildData?.banLogsChannel) {
      const log = logEmbed('🔨 Member Banned', `**User:** ${target} (${target.id})\n**Moderator:** ${interaction.user}\n**Reason:** ${reason}`, 0xe74c3c);
      await sendLog(interaction.guild, guildData.banLogsChannel, log);
    }
  }
};