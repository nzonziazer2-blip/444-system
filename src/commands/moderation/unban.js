import { SlashCommandBuilder, PermissionFlagsBits } from 'discord.js';
import Guild from '../../models/Guild.js';
import { sendLog, successEmbed, errorEmbed, logEmbed } from '../../utils/helpers.js';

export default {
  data: new SlashCommandBuilder()
    .setName('unban')
    .setDescription('Unban a user from the server')
    .addStringOption(opt => opt.setName('userid').setDescription('The user ID to unban').setRequired(true))
    .addStringOption(opt => opt.setName('reason').setDescription('Reason for the unban').setRequired(false))
    .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers),

  async execute(interaction) {
    const userId = interaction.options.getString('userid');
    const reason = interaction.options.getString('reason') || 'No reason provided';

    try {
      const user = await interaction.guild.members.unban(userId, reason);
      await interaction.reply({ embeds: [successEmbed('Member Unbanned', `${user} has been unbanned.\n**Reason:** ${reason}`)] });

      const guildData = await Guild.findOne({ guildId: interaction.guild.id });
      if (guildData?.unbanLogsChannel) {
        const log = logEmbed('✅ Member Unbanned', `**User:** ${user} (${userId})\n**Moderator:** ${interaction.user}\n**Reason:** ${reason}`, 0x2ecc71);
        await sendLog(interaction.guild, guildData.unbanLogsChannel, log);
      }
    } catch {
      await interaction.reply({ embeds: [errorEmbed('Error', 'User not found in ban list.')], ephemeral: true });
    }
  }
};