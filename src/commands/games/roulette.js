import { SlashCommandBuilder, EmbedBuilder } from 'discord.js';
import User from '../../models/User.js';

export default {
  data: new SlashCommandBuilder()
    .setName('roulette')
    .setDescription('Bet your coins on roulette')
    .addIntegerOption(opt => opt.setName('amount').setDescription('Amount to bet').setRequired(true).setMinValue(1))
    .addStringOption(opt => opt.setName('color').setDescription('red or black').setRequired(true)
      .addChoices(
        { name: '🔴 Red', value: 'red' },
        { name: '⚫ Black', value: 'black' }
      )),

  async execute(interaction) {
    const amount = interaction.options.getInteger('amount');
    const color = interaction.options.getString('color');

    const userData = await User.findOne({ userId: interaction.user.id, guildId: interaction.guild.id });
    if (!userData || userData.coins < amount) {
      return interaction.reply({ content: '❌ You don\'t have enough coins!', ephemeral: true });
    }

    const spin = Math.random() < 0.5 ? 'red' : 'black';
    const won = spin === color;

    await User.findOneAndUpdate(
      { userId: interaction.user.id, guildId: interaction.guild.id },
      { $inc: { coins: won ? amount : -amount } }
    );

    const embed = new EmbedBuilder()
      .setColor(won ? 0x2ecc71 : 0xe74c3c)
      .setTitle('🎰 Roulette')
      .setDescription(`The wheel landed on **${spin === 'red' ? '🔴 Red' : '⚫ Black'}**!\n\n${won ? `✅ You won **${amount}** coins!` : `❌ You lost **${amount}** coins!`}`)
      .setTimestamp();

    await interaction.reply({ embeds: [embed] });
  }
};