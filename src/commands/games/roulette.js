import { EmbedBuilder } from 'discord.js';
import User from '../../models/User.js';
import { errorEmbed } from '../../utils/helpers.js';

export default {
  name: 'roulette',
  description: 'Bet your coins on roulette',
  usage: '²roulette [amount] [red/black]',

  async execute(message, args, client) {
    const amount = parseInt(args[0]);
    const color = args[1]?.toLowerCase();

    if (!amount || amount < 1) return message.reply({ embeds: [errorEmbed('Error', 'Please provide a valid amount!')] });
    if (!['red', 'black'].includes(color)) return message.reply({ embeds: [errorEmbed('Error', 'Choose `red` or `black`!')] });

    const userData = await User.findOne({ userId: message.author.id, guildId: message.guild.id });
    if (!userData || userData.coins < amount)
      return message.reply({ content: '❌ You don\'t have enough coins!' });

    const spin = Math.random() < 0.5 ? 'red' : 'black';
    const won = spin === color;

    await User.findOneAndUpdate(
      { userId: message.author.id, guildId: message.guild.id },
      { $inc: { coins: won ? amount : -amount } }
    );

    const embed = new EmbedBuilder()
      .setColor(won ? 0x2ecc71 : 0xe74c3c)
      .setTitle('🎰 Roulette')
      .setDescription(`The wheel landed on **${spin === 'red' ? '🔴 Red' : '⚫ Black'}**!\n\n${won ? `✅ You won **${amount}** coins!` : `❌ You lost **${amount}** coins!`}`)
      .setTimestamp();

    await message.reply({ embeds: [embed] });
  }
};
