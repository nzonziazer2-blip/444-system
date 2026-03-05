import { PermissionFlagsBits } from 'discord.js';
import Guild from '../../models/Guild.js';
import { sendLog, successEmbed, errorEmbed, logEmbed } from '../../utils/helpers.js';

export default {
  name: 'kick',
  description: 'Kick a member',
  usage: '²kick @user [reason]',

  async execute(message, args, client) {
    if (!message.member.permissions.has(PermissionFlagsBits.KickMembers))
      return message.reply({ embeds: [errorEmbed('Error', 'You don\'t have permission!')] });

    const target = message.mentions.users.first();
    if (!target) return message.reply({ embeds: [errorEmbed('Error', 'Please mention a user!')] });

    const reason = args.slice(1).join(' ') || 'No reason provided';
    const member = message.guild.members.cache.get(target.id);

    if (!member) return message.reply({ embeds: [errorEmbed('Error', 'User not found.')] });
    if (!member.kickable) return message.reply({ embeds: [errorEmbed('Error', 'I cannot kick this user.')] });

    await member.kick(reason);
    await message.reply({ embeds: [successEmbed('Member Kicked', `${target} has been kicked.\n**Reason:** ${reason}`)] });

    const guildData = await Guild.findOne({ guildId: message.guild.id });
    if (guildData?.kickLogsChannel) {
      const log = logEmbed('👢 Member Kicked', `**User:** ${target} (${target.id})\n**Moderator:** ${message.author}\n**Reason:** ${reason}`, 0xe67e22);
      await sendLog(message.guild, guildData.kickLogsChannel, log);
    }
  }
};
