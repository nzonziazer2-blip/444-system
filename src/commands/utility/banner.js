import { EmbedBuilder } from 'discord.js';

export default {
  name: 'banner',
  description: 'Get banner of a user',
  usage: '²banner @user',

  async execute(message, args, client) {
    const target = await message.client.users.fetch(
      message.mentions.users.first()?.id || message.author.id,
      { force: true }
    );

    if (!target.banner)
      return message.reply({ content: `❌ **${target.username}** has no banner.` });

    const embed = new EmbedBuilder()
      .setColor(0x3498db)
      .setTitle(`🖼️ ${target.username}'s Banner`)
      .setImage(target.bannerURL({ dynamic: true, size: 1024 }))
      .setTimestamp();

    await message.reply({ embeds: [embed] });
  }
};
