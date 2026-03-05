import { EmbedBuilder } from 'discord.js';
import Guild from '../models/Guild.js';

export default {
  name: 'roleDelete',
  async execute(role, client) {
    const guildData = await Guild.findOne({ guildId: role.guild.id });
    if (!guildData?.roleLogsChannel) return;

    const channel = role.guild.channels.cache.get(guildData.roleLogsChannel);
    if (!channel) return;

    const embed = new EmbedBuilder()
      .setColor(0xe74c3c)
      .setTitle('🗑️ Role Deleted')
      .addFields(
        { name: '🎭 Role', value: role.name, inline: true },
        { name: '🎨 Color', value: role.hexColor, inline: true }
      )
      .setFooter({ text: `Role ID: ${role.id}` })
      .setTimestamp();

    await channel.send({ embeds: [embed] });
  }
};