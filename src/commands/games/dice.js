import { EmbedBuilder } from 'discord.js';

export default {
  name: 'dice',
  description: 'Roll a dice',
  usage: '²dice [sides]',

  async execute(message, args, client) {
    const sides = parseInt(args[0]) || 6;
    const result = Math.floor(Math.random() * sides) + 1;

    const embed = new EmbedBuilder()
      .setColor(0xf1c40f)
      .setTitle('🎲 Dice Roll')
      .setDescription(`You rolled a **${result}** out of **${sides}**!`)
      .setTimestamp();

    await message.reply({ embeds: [embed] });
  }
};
