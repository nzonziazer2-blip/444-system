import { EmbedBuilder } from 'discord.js';
import Guild from '../models/Guild.js';

export default {
  name: 'guildMemberAdd',
  async execute(member, client) {
    const guildData = await Guild.findOne({ guildId: member.guild.id });
    if (!guildData?.welcomeChannel) return;

    const channel = member.guild.channels.cache.get(guildData.welcomeChannel);
    if (!channel) return;

    const message = guildData.welcomeMessage
      .replace('{user}', `<@${member.id}>`)
      .replace('{server}', member.guild.name)
      .replace('{count}', member.guild.memberCount);

    const embed = new EmbedBuilder()
      .setColor(0x2ecc71)
      .setTitle('👋 Welcome!')
      .setDescription(message)
      .setThumbnail(member.user.displayAvatarURL({ dynamic: true }))
      .addFields(
        { name: '👤 Member', value: `${member.user.tag}`, inline: true },
        { name: '🎉 Member Count', value: `${member.guild.memberCount}`, inline: true },
        { name: '📅 Account Created', value: `<t:${Math.floor(member.user.createdTimestamp / 1000)}:R>`, inline: true }
      )
      .setFooter({ text: member.guild.name, iconURL: member.guild.iconURL() })
      .setTimestamp();

    await channel.send({ content: `<@${member.id}>`, embeds: [embed] });
  }
};