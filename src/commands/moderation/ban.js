import { PermissionFlagsBits } from 'discord.js';
import Guild from '../../models/Guild.js';
import { sendLog, successEmbed, errorEmbed, logEmbed } from '../../utils/helpers.js';

export default {
  name: 'ban',
  description: 'Ban a member',
  usage: '²ban @user [reason]',

  async execute(message, args, client) {
    if (!message.member.permissions.has(PermissionFlagsBits.BanMembers))
      return message.reply({ embeds: [errorEmbed('Error', 'You don\'t have permission!')] });

    const target = message.mentions.users.first();
    if (!target) return message.reply({ embeds: [errorEmbed('Error', 'Please mention a user!')] });

    const reason = args.slice(1).join(' ') || 'No reason provided';
    const member = message.guild.members.cache.get(target.id);

    if (member && !member.bannable) return message.reply({ embeds: [errorEmbed('Error', 'I cannot ban this user.')] });

    await message.guild.members.ban(target.id, { reason });
    await message.reply({ embeds: [successEmbed('Member Banned', `${target} has been banned.\n**Reason:** ${reason}`)] });

    const guildData = await Guild.findOne({ guildId: message.guild.id });
    if (guildData?.banLogsChannel) {
      const log = logEmbed('🔨 Member Banned', `**User:** ${target} (${target.id})\n**Moderator:** ${message.author}\n**Reason:** ${reason}`, 0xe74c3c);
      await sendLog(message.guild, guildData.banLogsChannel, log);
    }
  }
};
