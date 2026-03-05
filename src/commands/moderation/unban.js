import { PermissionFlagsBits } from 'discord.js';
import Guild from '../../models/Guild.js';
import { sendLog, successEmbed, errorEmbed, logEmbed } from '../../utils/helpers.js';

export default {
  name: 'unban',
  description: 'Unban a user',
  usage: '²unban [userID] [reason]',

  async execute(message, args, client) {
    if (!message.member.permissions.has(PermissionFlagsBits.BanMembers))
      return message.reply({ embeds: [errorEmbed('Error', 'You don\'t have permission!')] });

    const userId = args[0];
    if (!userId) return message.reply({ embeds: [errorEmbed('Error', 'Please provide a user ID!')] });

    const reason = args.slice(1).join(' ') || 'No reason provided';

    try {
      const user = await message.guild.members.unban(userId, reason);
      await message.reply({ embeds: [successEmbed('Member Unbanned', `**${user.tag}** has been unbanned.\n**Reason:** ${reason}`)] });

      const guildData = await Guild.findOne({ guildId: message.guild.id });
      if (guildData?.unbanLogsChannel) {
        const log = logEmbed('✅ Member Unbanned', `**User:** ${user.tag} (${userId})\n**Moderator:** ${message.author}\n**Reason:** ${reason}`, 0x2ecc71);
        await sendLog(message.guild, guildData.unbanLogsChannel, log);
      }
    } catch {
      await message.reply({ embeds: [errorEmbed('Error', 'User not found in ban list.')] });
    }
  }
};
