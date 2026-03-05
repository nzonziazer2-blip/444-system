import { SlashCommandBuilder, EmbedBuilder } from 'discord.js';

const punishments = [
  'You must speak only in questions for 5 minutes!',
  'Change your nickname to "Loser" for 10 minutes!',
  'You must use only emojis for the next 3 messages!',
  'Skip your next turn in any game!',
  'You lose 50 coins!',
  'Timeout for 1 minute!',
  'You survived! Lucky you! 🍀',
  'Send a compliment to the next person who messages!',
  'You must type backwards for the next 2 messages!',
  'Nothing happens... this time. 😈',
];

export default {
  data: new SlashCommandBuilder()
    .setName('deathwheel')
    .setDescription('Spin the wheel of death and face your punishment!'),

  async execute(interaction) {
    const result = punishments[Math.floor(Math.random() * punishments.length)];

    const embed = new EmbedBuilder()
      .setColor(0xe74c3c)
      .setTitle('☠️ Wheel of Death')
      .setDescription(`${interaction.user} spun the wheel...\n\n**Result:** ${result}`)
      .setTimestamp();

    await interaction.reply({ embeds: [embed] });
  }
};