import { SlashCommandBuilder, PermissionFlagsBits } from 'discord.js';
import User from '../../models/User.js';
import Guild from '../../models/Guild.js';
import { sendLog, successEmbed, errorEmbed, logEmbed } from '../../utils/helpers.js';

export default {
  data: new SlashCommandBuilder()
    .setName('warn')
    .setDescription('Warn a member')
    .addUserOption(opt => opt.setName('user').setDescription('The user to warn').setRequired(true))
    .addStringOption(opt => opt.setName('reason').setDescription('Reason for the warn').setRequired(false))
    .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers),

  async execute(interaction, client) {
    const target = interaction.options.getUser('user');
    const reason = interaction.options.getString('reason') || 'No reason provided';
    const member = interaction.guild.members.cache.get(target.id);

    if (!member) return interaction.reply({ embeds: [errorEmbed('Error', 'User not found in this server.')], ephemeral: true });
    if (member.id === interaction.user.id) return interaction.reply({ embeds: [errorEmbed('Error', 'You cannot warn yourself.')], ephemeral: true });

    let userData = await User.findOneAndUpdate(
      { userId: target.id, guildId: interaction.guild.id },
      { $push: { warns: { reason, moderator: interaction.user.id } } },
      { upsert: true, new: true }
    );

    await interaction.reply({ embeds: [successEmbed('User Warned', `${target} has been warned.\n**Reason:** ${reason}\n**Total Warns:** ${userData.warns.length}`)] });

    const guildData = await Guild.findOne({ guildId: interaction.guild.id });
    if (guildData?.warnLogsChannel) {
      const log = logEmbed('⚠️ Member Warned', `**User:** ${target} (${target.id})\n**Moderator:** ${interaction.user}\n**Reason:** ${reason}\n**Total Warns:** ${userData.warns.length}`, 0xf39c12);
      await sendLog(interaction.guild, guildData.warnLogsChannel, log);
    }
  }
};