import { EmbedBuilder, AuditLogEvent } from 'discord.js';
import Guild from '../models/Guild.js';

export default {
  name: 'messageDelete',
  async execute(message, client) {
    if (message.author?.bot) return;
    if (!message.guild) return;

    const guildData = await Guild.findOne({ guildId: message.guild.id });
    if (!guildData?.messageLogsChannel) return;

    const channel = message.guild.channels.cache.get(guildData.messageLogsChannel);
    if (!channel) return;

    const embed = new EmbedBuilder()
      .setColor(0xe74c3c)
      .setTitle('🗑️ Message Deleted')
      .addFields(
        { name: '👤 Author', value: `${message.author} (${message.author?.tag})`, inline: true },
        { name: '📍 Channel', value: `${message.channel}`, inline: true },
        { name: '📝 Content', value: message.content || '*No content*' }
      )
      .setFooter({ text: `User ID: ${message.author?.id}` })
      .setTimestamp();

    await channel.send({ embeds: [embed] });
  }
};