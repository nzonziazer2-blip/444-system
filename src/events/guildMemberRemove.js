import { EmbedBuilder } from 'discord.js';
import Guild from '../models/Guild.js';

export default {
  name: 'guildMemberRemove',
  async execute(member, client) {
    const guildData = await Guild.findOne({ guildId: member.guild.id });
    if (!guildData?.leaveChannel) return;

    const channel = member.guild.channels.cache.get(guildData.leaveChannel);
    if (!channel) return;

    const message = guildData.leaveMessage
      .replace('{user}', member.user.tag)
      .replace('{server}', member.guild.name)
      .replace('{count}', member.guild.memberCount);

    const embed = new EmbedBuilder()
      .setColor(0xe74c3c)
      .setTitle('👋 Member Left')
      .setDescription(message)
      .setThumbnail(member.user.displayAvatarURL({ dynamic: true }))
      .addFields(
        { name: '👤 Member', value: `${member.user.tag}`, inline: true },
        { name: '📅 Joined', value: member.joinedAt ? `<t:${Math.floor(member.joinedTimestamp / 1000)}:R>` : 'Unknown', inline: true },
        { name: '👥 Member Count', value: `${member.guild.memberCount}`, inline: true }
      )
      .setFooter({ text: member.guild.name, iconURL: member.guild.iconURL() })
      .setTimestamp();

    await channel.send({ embeds: [embed] });
  }
};