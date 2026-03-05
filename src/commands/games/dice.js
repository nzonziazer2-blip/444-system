import { SlashCommandBuilder, EmbedBuilder } from 'discord.js';

export default {
  data: new SlashCommandBuilder()
    .setName('dice')
    .setDescription('Roll a dice')
    .addIntegerOption(opt => opt.setName('sides').setDescription('Number of sides (default 6)').setMinValue(2).setMaxValue(100)),

  async execute(interaction) {
    const sides = interaction.options.getInteger('sides') || 6;
    const result = Math.floor(Math.random() * sides) + 1;

    const embed = new EmbedBuilder()
      .setColor(0xf1c40f)
      .setTitle('🎲 Dice Roll')
      .setDescription(`You rolled a **${result}** out of **${sides}**!`)
      .setTimestamp();

    await interaction.reply({ embeds: [embed] });
  }
};