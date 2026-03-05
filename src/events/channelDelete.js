import { EmbedBuilder } from 'discord.js';
import Guild from '../models/Guild.js';

export default {
  name: 'channelDelete',
  async execute(channel, client) {
    if (!channel.guild) return;
    const guildData = await Guild.findOne({ guildId: channel.guild.id });
    if (!guildData?.channelLogsChannel) return;

    const logChannel = channel.guild.channels.cache.get(guildData.channelLogsChannel);
    if (!logChannel) return;

    const embed = new EmbedBuilder()
      .setColor(0xe74c3c)
      .setTitle('🗑️ Channel Deleted')
      .addFields(
        { name: '📍 Channel', value: channel.name, inline: true },
        { name: '📁 Type', value: `${channel.type}`, inline: true }
      )
      .setFooter({ text: `Channel ID: ${channel.id}` })
      .setTimestamp();

    await logChannel.send({ embeds: [embed] });
  }
};