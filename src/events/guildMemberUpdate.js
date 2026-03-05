import { EmbedBuilder, AuditLogEvent } from 'discord.js';
import Guild from '../models/Guild.js';

export default {
  name: 'guildMemberUpdate',
  async execute(oldMember, newMember, client) {
    const guildData = await Guild.findOne({ guildId: newMember.guild.id });
    if (!guildData) return;

    // Nick logs
    if (oldMember.nickname !== newMember.nickname) {
      const channel = newMember.guild.channels.cache.get(guildData.nickLogsChannel);
      if (channel) {
        const embed = new EmbedBuilder()
          .setColor(0x9b59b6)
          .setTitle('📝 Nickname Changed')
          .addFields(
            { name: '👤 Member', value: `${newMember.user}`, inline: true },
            { name: '📝 Before', value: oldMember.nickname || '*None*', inline: true },
            { name: '📝 After', value: newMember.nickname || '*None*', inline: true }
          )
          .setFooter({ text: `User ID: ${newMember.id}` })
          .setTimestamp();
        await channel.send({ embeds: [embed] });
      }
    }

    // Role logs
    const addedRoles = newMember.roles.cache.filter(r => !oldMember.roles.cache.has(r.id));
    const removedRoles = oldMember.roles.cache.filter(r => !newMember.roles.cache.has(r.id));

    if (addedRoles.size > 0 || removedRoles.size > 0) {
      const channel = newMember.guild.channels.cache.get(guildData.roleLogsChannel);
      if (channel) {
        const embed = new EmbedBuilder()
          .setColor(0x3498db)
          .setTitle('🎭 Member Roles Updated')
          .addFields(
            { name: '👤 Member', value: `${newMember.user}`, inline: true },
          )
          .setFooter({ text: `User ID: ${newMember.id}` })
          .setTimestamp();

        if (addedRoles.size > 0) {
          embed.addFields({ name: '✅ Roles Added', value: addedRoles.map(r => `${r}`).join(', '), inline: true });
        }
        if (removedRoles.size > 0) {
          embed.addFields({ name: '❌ Roles Removed', value: removedRoles.map(r => `${r}`).join(', '), inline: true });
        }

        await channel.send({ embeds: [embed] });
      }
    }

    // Mute / Deafen logs
    const wasMuted = oldMember.voice?.serverMute;
    const isMuted = newMember.voice?.serverMute;
    const wasDeafened = oldMember.voice?.serverDeaf;
    const isDeafened = newMember.voice?.serverDeaf;

    if (wasMuted !== isMuted || wasDeafened !== isDeafened) {
      const channel = newMember.guild.channels.cache.get(guildData.muteLogsChannel);
      if (channel) {
        const embed = new EmbedBuilder()
          .setColor(0xe67e22)
          .setTitle('🔇 Voice State Updated')
          .addFields(
            { name: '👤 Member', value: `${newMember.user}`, inline: true },
            { name: '🔇 Server Mute', value: isMuted ? 'Muted' : 'Unmuted', inline: true },
            { name: '🔕 Server Deaf', value: isDeafened ? 'Deafened' : 'Undeafened', inline: true }
          )
          .setFooter({ text: `User ID: ${newMember.id}` })
          .setTimestamp();
        await channel.send({ embeds: [embed] });
      }
    }
  }
};