import { EmbedBuilder } from 'discord.js';

export default {
  name: 'guessthenumber',
  description: 'Guess the number between 1 and 100',
  usage: '²guessthenumber',

  async execute(message, args, client) {
    const number = Math.floor(Math.random() * 100) + 1;
    let attempts = 0;

    const embed = new EmbedBuilder()
      .setColor(0x3498db)
      .setTitle('🔢 Guess The Number!')
      .setDescription('I\'m thinking of a number between **1 and 100**!\nYou have **10 attempts**. Type your guess!')
      .setTimestamp();

    await message.reply({ embeds: [embed] });

    const filter = m => m.author.id === message.author.id && !isNaN(m.content);
    const collector = message.channel.createMessageCollector({ filter, time: 60000 });

    collector.on('collect', async m => {
      attempts++;
      const guess = parseInt(m.content);

      if (guess === number) {
        collector.stop('won');
        await message.channel.send({ embeds: [new EmbedBuilder().setColor(0x2ecc71).setTitle('🎉 Correct!').setDescription(`✅ You guessed it in **${attempts}** attempt(s)! The number was **${number}**!`)] });
      } else if (attempts >= 10) {
        collector.stop('lost');
        await message.channel.send({ embeds: [new EmbedBuilder().setColor(0xe74c3c).setTitle('❌ Game Over!').setDescription(`You ran out of attempts! The number was **${number}**!`)] });
      } else {
        await message.channel.send({ content: guess < number ? `📈 Too low! ${10 - attempts} attempts left.` : `📉 Too high! ${10 - attempts} attempts left.` });
      }
    });

    collector.on('end', (_, reason) => {
      if (reason === 'time') message.channel.send(`⏰ Time is up! The number was **${number}**!`);
    });
  }
};
