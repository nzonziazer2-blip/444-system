import { EmbedBuilder } from 'discord.js';
import Guild from '../models/Guild.js';

export default {
  name: 'roleUpdate',
  async execute(oldRole, newRole, client) {
    const guildData = await Guild.findOne({ guildId: newRole.guild.id });
    if (!guildData?.roleLogsChannel) return;

    const channel = newRole.guild.channels.cache.get(guildData.roleLogsChannel);
    if (!channel) return;

    const changes = [];
    if (oldRole.name !== newRole.name) changes.push(`**Name:** ${oldRole.name} → ${newRole.name}`);
    if (oldRole.hexColor !== newRole.hexColor) changes.push(`**Color:** ${oldRole.hexColor} → ${newRole.hexColor}`);
    if (oldRole.permissions.bitfield !== newRole.permissions.bitfield) changes.push(`**Permissions:** Updated`);

    if (!changes.length) return;

    const embed = new EmbedBuilder()
      .setColor(0xf39c12)
      .setTitle('✏️ Role Updated')
      .addFields(
        { name: '🎭 Role', value: `${newRole}`, inline: true },
        { name: '📝 Changes', value: changes.join('\n') }
      )
      .setFooter({ text: `Role ID: ${newRole.id}` })
      .setTimestamp();

    await channel.send({ embeds: [embed] });
  }
};