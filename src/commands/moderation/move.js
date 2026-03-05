import { PermissionFlagsBits } from 'discord.js';
import Guild from '../../models/Guild.js';
import { sendLog, successEmbed, errorEmbed, logEmbed } from '../../utils/helpers.js';

export default {
  name: 'move',
  description: 'Move a member to another voice channel',
  usage: '²move @user [channel name]',

  async execute(message, args, client) {
    if (!message.member.permissions.has(PermissionFlagsBits.MoveMembers))
      return message.reply({ embeds: [errorEmbed('Error', 'You don\'t have permission!')] });

    const target = message.mentions.members.first();
    if (!target) return message.reply({ embeds: [errorEmbed('Error', 'Please mention a user!')] });

    const channelName = args.slice(1).join(' ');
    const channel = message.guild.channels.cache.find(c => c.name.toLowerCase() === channelName.toLowerCase() && c.type === 2);

    if (!channel) return message.reply({ embeds: [errorEmbed('Error', 'Voice channel not found!')] });
    if (!target.voice.channel) return message.reply({ embeds: [errorEmbed('Error', 'User is not in a voice channel.')] });

    await target.voice.setChannel(channel);
    await message.reply({ embeds: [successEmbed('Member Moved', `${target.user} has been moved to **${channel.name}**.`)] });

    const guildData = await Guild.findOne({ guildId: message.guild.id });
    if (guildData?.moveLogsChannel) {
      const log = logEmbed('🔀 Member Moved', `**User:** ${target.user}\n**Moderator:** ${message.author}\n**Channel:** ${channel.name}`, 0x1abc9c);
      await sendLog(message.guild, guildData.moveLogsChannel, log);
    }
  }
};
