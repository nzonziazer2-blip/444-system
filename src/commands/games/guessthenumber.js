import { SlashCommandBuilder, EmbedBuilder } from 'discord.js';

export default {
  data: new SlashCommandBuilder()
    .setName('guessthenumber')
    .setDescription('Guess the number between 1 and 100!'),

  async execute(interaction) {
    const number = Math.floor(Math.random() * 100) + 1;
    let attempts = 0;

    const embed = new EmbedBuilder()
      .setColor(0x3498db)
      .setTitle('🔢 Guess The Number!')
      .setDescription('I\'m thinking of a number between **1 and 100**!\nYou have **10 attempts**. Type your guess!')
      .setTimestamp();

    await interaction.reply({ embeds: [embed] });

    const filter = m => m.author.id === interaction.user.id && !isNaN(m.content);
    const collector = interaction.channel.createMessageCollector({ filter, time: 60000 });

    collector.on('collect', async m => {
      attempts++;
      const guess = parseInt(m.content);

      if (guess === number) {
        collector.stop('won');
        await interaction.followUp({ embeds: [new EmbedBuilder().setColor(0x2ecc71).setTitle('🎉 Correct!').setDescription(`✅ You guessed it in **${attempts}** attempt(s)! The number was **${number}**!`)] });
      } else if (attempts >= 10) {
        collector.stop('lost');
        await interaction.followUp({ embeds: [new EmbedBuilder().setColor(0xe74c3c).setTitle('❌ Game Over!').setDescription(`You ran out of attempts! The number was **${number}**!`)] });
      } else {
        await interaction.followUp({ content: guess < number ? `📈 Too low! ${10 - attempts} attempts left.` : `📉 Too high! ${10 - attempts} attempts left.` });
      }
    });

    collector.on('end', (_, reason) => {
      if (reason === 'time') {
        interaction.followUp({ content: `⏰ Time is up! The number was **${number}**!` });
      }
    });
  }
};