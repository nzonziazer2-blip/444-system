import { EmbedBuilder } from 'discord.js';
import User from '../../models/User.js';

export default {
  name: 'coins',
  description: 'Check your coins balance',
  usage: '²coins @user',

  async execute(message, args, client) {
    const target = message.mentions.users.first() || message.author;
    const userData = await User.findOne({ userId: target.id, guildId: message.guild.id });

    const embed = new EmbedBuilder()
      .setColor(0xf1c40f)
      .setTitle('💰 Coins Balance')
      .setDescription(`${target} has **${userData?.coins || 0}** coins`)
      .setThumbnail(target.displayAvatarURL({ dynamic: true }))
      .setTimestamp();

    await message.reply({ embeds: [embed] });
  }
};
