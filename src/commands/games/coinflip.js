import { EmbedBuilder } from 'discord.js';
import User from '../../models/User.js';
import { errorEmbed } from '../../utils/helpers.js';

export default {
  name: 'coinflip',
  description: 'Flip a coin and bet your coins',
  usage: '²coinflip [amount] [heads/tails]',

  async execute(message, args, client) {
    const amount = parseInt(args[0]);
    const side = args[1]?.toLowerCase();

    if (!amount || amount < 1) return message.reply({ embeds: [errorEmbed('Error', 'Please provide a valid amount!')] });
    if (!['heads', 'tails'].includes(side)) return message.reply({ embeds: [errorEmbed('Error', 'Choose `heads` or `tails`!')] });

    const userData = await User.findOne({ userId: message.author.id, guildId: message.guild.id });
    if (!userData || userData.coins < amount)
      return message.reply({ content: '❌ You don\'t have enough coins!' });

    const result = Math.random() < 0.5 ? 'heads' : 'tails';
    const won = result === side;

    await User.findOneAndUpdate(
      { userId: message.author.id, guildId: message.guild.id },
      { $inc: { coins: won ? amount : -amount } }
    );

    const embed = new EmbedBuilder()
      .setColor(won ? 0x2ecc71 : 0xe74c3c)
      .setTitle('🪙 Coin Flip')
      .setDescription(`The coin landed on **${result}**!\n\n${won ? `✅ You won **${amount}** coins!` : `❌ You lost **${amount}** coins!`}`)
      .setTimestamp();

    await message.reply({ embeds: [embed] });
  }
};
