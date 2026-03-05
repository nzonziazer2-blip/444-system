import { EmbedBuilder, PermissionFlagsBits } from 'discord.js';
import User from '../../models/User.js';
import Guild from '../../models/Guild.js';
import { sendLog, successEmbed, errorEmbed, logEmbed } from '../../utils/helpers.js';

export default {
  name: 'warn',
  description: 'Warn a member',
  usage: '²warn @user [reason]',

  async execute(message, args, client) {
    if (!message.member.permissions.has(PermissionFlagsBits.ModerateMembers))
      return message.reply({ embeds: [errorEmbed('Error', 'You don\'t have permission!')] });

    const target = message.mentions.users.first();
    if (!target) return message.reply({ embeds: [errorEmbed('Error', 'Please mention a user!')] });

    const reason = args.slice(1).join(' ') || 'No reason provided';

    const userData = await User.findOneAndUpdate(
      { userId: target.id, guildId: message.guild.id },
      { $push: { warns: { reason, moderator: message.author.id } } },
      { upsert: true, new: true }
    );

    await message.reply({ embeds: [successEmbed('User Warned', `${target} has been warned.\n**Reason:** ${reason}\n**Total Warns:** ${userData.warns.length}`)] });

    const guildData = await Guild.findOne({ guildId: message.guild.id });
    if (guildData?.warnLogsChannel) {
      const log = logEmbed('⚠️ Member Warned', `**User:** ${target} (${target.id})\n**Moderator:** ${message.author}\n**Reason:** ${reason}\n**Total Warns:** ${userData.warns.length}`, 0xf39c12);
      await sendLog(message.guild, guildData.warnLogsChannel, log);
    }
  }
};
