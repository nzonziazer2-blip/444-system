import { PermissionFlagsBits } from 'discord.js';
import Guild from '../../models/Guild.js';
import User from '../../models/User.js';
import { sendLog, successEmbed, errorEmbed, logEmbed } from '../../utils/helpers.js';

const durations = {
  '1m': 60 * 1000,
  '5m': 5 * 60 * 1000,
  '10m': 10 * 60 * 1000,
  '1h': 60 * 60 * 1000,
  '1d': 24 * 60 * 60 * 1000,
  '1w': 7 * 24 * 60 * 60 * 1000,
};

export default {
  name: 'timeout',
  description: 'Timeout a member',
  usage: '²timeout @user [1m/5m/10m/1h/1d/1w] [reason]',

  async execute(message, args, client) {
    if (!message.member.permissions.has(PermissionFlagsBits.ModerateMembers))
      return message.reply({ embeds: [errorEmbed('Error', 'You don\'t have permission!')] });

    const target = message.mentions.users.first();
    if (!target) return message.reply({ embeds: [errorEmbed('Error', 'Please mention a user!')] });

    const durationKey = args[1];
    const ms = durations[durationKey];
    if (!ms) return message.reply({ embeds: [errorEmbed('Error', 'Invalid duration! Use: `1m` `5m` `10m` `1h` `1d` `1w`')] });

    const reason = args.slice(2).join(' ') || 'No reason provided';
    const member = message.guild.members.cache.get(target.id);

    if (!member) return message.reply({ embeds: [errorEmbed('Error', 'User not found.')] });
    if (!member.moderatable) return message.reply({ embeds: [errorEmbed('Error', 'I cannot timeout this user.')] });

    await member.timeout(ms, reason);
    await message.reply({ embeds: [successEmbed('Member Timed Out', `${target} has been timed out for **${durationKey}**.\n**Reason:** ${reason}`)] });

    await User.findOneAndUpdate(
      { userId: target.id, guildId: message.guild.id },
      { $push: { timeouts: { reason, moderator: message.author.id, duration: durationKey } } },
      { upsert: true }
    );

    const guildData = await Guild.findOne({ guildId: message.guild.id });
    if (guildData?.timeoutLogsChannel) {
      const log = logEmbed('⏱️ Member Timed Out', `**User:** ${target} (${target.id})\n**Moderator:** ${message.author}\n**Duration:** ${durationKey}\n**Reason:** ${reason}`, 0x9b59b6);
      await sendLog(message.guild, guildData.timeoutLogsChannel, log);
    }
  }
};
