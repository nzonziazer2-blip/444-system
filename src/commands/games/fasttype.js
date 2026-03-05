import { EmbedBuilder } from 'discord.js';

const sentences = [
  'The quick brown fox jumps over the lazy dog',
  'Discord bots are really fun to build',
  'JavaScript is the language of the web',
  'Never gonna give you up never gonna let you down',
  'The rain in Spain stays mainly in the plain',
];

export default {
  name: 'fasttype',
  description: 'Type the sentence as fast as possible',
  usage: '²fasttype',

  async execute(message, args, client) {
    const sentence = sentences[Math.floor(Math.random() * sentences.length)];

    const embed = new EmbedBuilder()
      .setColor(0x3498db)
      .setTitle('⌨️ Fast Type!')
      .setDescription(`Type this sentence as fast as you can:\n\n\`\`\`${sentence}\`\`\``)
      .setFooter({ text: 'You have 30 seconds!' });

    await message.reply({ embeds: [embed] });

    const filter = m => m.author.id === message.author.id;
    const collector = message.channel.createMessageCollector({ filter, time: 30000, max: 1 });
    const start = Date.now();

    collector.on('collect', async m => {
      const time = ((Date.now() - start) / 1000).toFixed(2);
      const correct = m.content.toLowerCase() === sentence.toLowerCase();

      const result = new EmbedBuilder()
        .setColor(correct ? 0x2ecc71 : 0xe74c3c)
        .setTitle('⌨️ Fast Type Result')
        .setDescription(correct
          ? `✅ Correct! You typed it in **${time}s**!`
          : `❌ Wrong! The correct sentence was:\n\`\`\`${sentence}\`\`\``)
        .setTimestamp();

      await message.channel.send({ embeds: [result] });
    });

    collector.on('end', collected => {
      if (collected.size === 0) message.channel.send('⏰ Time is up!');
    });
  }
};
