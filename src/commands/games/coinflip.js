import { SlashCommandBuilder, EmbedBuilder } from 'discord.js';
import User from '../../models/User.js';

export default {
  data: new SlashCommandBuilder()
    .setName('coinflip')
    .setDescription('Flip a coin and bet your coins!')
    .addIntegerOption(opt => opt.setName('amount').setDescription('Amount to bet').setRequired(true).setMinValue(1))
    .addStringOption(opt => opt.setName('side').setDescription('heads or tails').setRequired(true)
      .addChoices(
        { name: '🪙 Heads', value: 'heads' },
        { name: '🪙 Tails', value: 'tails' }
      )),

  async execute(interaction) {
    const amount = interaction.options.getInteger('amount');
    const side = interaction.options.getString('side');

    const userData = await User.findOne({ userId: interaction.user.id, guildId: interaction.guild.id });
    if (!userData || userData.coins < amount) {
      return interaction.reply({ content: '❌ You don\'t have enough coins!', ephemeral: true });
    }

    const result = Math.random() < 0.5 ? 'heads' : 'tails';
    const won = result === side;

    await User.findOneAndUpdate(
      { userId: interaction.user.id, guildId: interaction.guild.id },
      { $inc: { coins: won ? amount : -amount } }
    );

    const embed = new EmbedBuilder()
      .setColor(won ? 0x2ecc71 : 0xe74c3c)
      .setTitle('🪙 Coin Flip')
      .setDescription(`The coin landed on **${result}**!\n\n${won ? `✅ You won **${amount}** coins!` : `❌ You lost **${amount}** coins!`}`)
      .setTimestamp();

    await interaction.reply({ embeds: [embed] });
  }
};