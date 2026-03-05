import { SlashCommandBuilder, EmbedBuilder } from 'discord.js';

const sentences = [
  'The quick brown fox jumps over the lazy dog',
  'Discord bots are really fun to build',
  'JavaScript is the language of the web',
  'Never gonna give you up never gonna let you down',
  'The rain in Spain stays mainly in the plain',
];

export default {
  data: new SlashCommandBuilder()
    .setName('fasttype')
    .setDescription('Type the sentence as fast as possible!'),

  async execute(interaction) {
    const sentence = sentences[Math.floor(Math.random() * sentences.length)];

    const embed = new EmbedBuilder()
      .setColor(0x3498db)
      .setTitle('⌨️ Fast Type!')
      .setDescription(`Type this sentence as fast as you can:\n\n\`\`\`${sentence}\`\`\``)
      .setFooter({ text: 'You have 30 seconds!' });

    await interaction.reply({ embeds: [embed] });

    const filter = m => m.author.id === interaction.user.id;
    const collector = interaction.channel.createMessageCollector({ filter, time: 30000, max: 1 });

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

      await interaction.followUp({ embeds: [result] });
    });

    collector.on('end', (collected) => {
      if (collected.size === 0) {
        interaction.followUp({ content: '⏰ Time is up! You did not type the sentence in time.' });
      }
    });
  }
};