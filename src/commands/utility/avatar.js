import { EmbedBuilder } from 'discord.js';

export default {
  name: 'avatar',
  description: 'Get avatar of a user',
  usage: '²avatar @user',

  async execute(message, args, client) {
    const target = message.mentions.users.first() || message.author;

    const embed = new EmbedBuilder()
      .setColor(0x3498db)
      .setTitle(`🖼️ ${target.username}'s Avatar`)
      .setImage(target.displayAvatarURL({ dynamic: true, size: 1024 }))
      .addFields(
        { name: '🔗 Links', value: `[PNG](${target.displayAvatarURL({ extension: 'png', size: 1024 })}) | [JPG](${target.displayAvatarURL({ extension: 'jpg', size: 1024 })}) | [WEBP](${target.displayAvatarURL({ extension: 'webp', size: 1024 })})` }
      )
      .setTimestamp();

    await message.reply({ embeds: [embed] });
  }
};
