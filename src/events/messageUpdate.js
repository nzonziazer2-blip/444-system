import { EmbedBuilder } from 'discord.js';
import Guild from '../models/Guild.js';

export default {
  name: 'messageUpdate',
  async execute(oldMessage, newMessage, client) {
    if (oldMessage.author?.bot) return;
    if (!oldMessage.guild) return;
    if (oldMessage.content === newMessage.content) return;

    const guildData = await Guild.findOne({ guildId: oldMessage.guild.id });
    if (!guildData?.messageLogsChannel) return;

    const channel = oldMessage.guild.channels.cache.get(guildData.messageLogsChannel);
    if (!channel) return;

    const embed = new EmbedBuilder()
      .setColor(0xf39c12)
      .setTitle('✏️ Message Edited')
      .addFields(
        { name: '👤 Author', value: `${oldMessage.author} (${oldMessage.author?.tag})`, inline: true },
        { name: '📍 Channel', value: `${oldMessage.channel}`, inline: true },
        { name: '📝 Before', value: oldMessage.content || '*No content*' },
        { name: '📝 After', value: newMessage.content || '*No content*' }
      )
      .addFields({ name: '🔗 Jump', value: `[Click here](${newMessage.url})` })
      .setFooter({ text: `User ID: ${oldMessage.author?.id}` })
      .setTimestamp();

    await channel.send({ embeds: [embed] });
  }
};