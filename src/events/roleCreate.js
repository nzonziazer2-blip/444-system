import { EmbedBuilder } from 'discord.js';
import Guild from '../models/Guild.js';

export default {
  name: 'roleCreate',
  async execute(role, client) {
    const guildData = await Guild.findOne({ guildId: role.guild.id });
    if (!guildData?.roleLogsChannel) return;

    const channel = role.guild.channels.cache.get(guildData.roleLogsChannel);
    if (!channel) return;

    const embed = new EmbedBuilder()
      .setColor(0x2ecc71)
      .setTitle('✅ Role Created')
      .addFields(
        { name: '🎭 Role', value: `${role} (${role.name})`, inline: true },
        { name: '🎨 Color', value: role.hexColor, inline: true }
      )
      .setFooter({ text: `Role ID: ${role.id}` })
      .setTimestamp();

    await channel.send({ embeds: [embed] });
  }
};