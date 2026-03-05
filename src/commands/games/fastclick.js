import { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } from 'discord.js';

export default {
  name: 'fastclick',
  description: 'Click the button as fast as possible',
  usage: '²fastclick',

  async execute(message, args, client) {
    const embed = new EmbedBuilder()
      .setColor(0xe74c3c)
      .setTitle('🖱️ Fast Click!')
      .setDescription('Wait for the button to turn **GREEN** then click it as fast as you can!');

    const waitRow = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setCustomId('fastclick_wait')
        .setLabel('⏳ Wait...')
        .setStyle(ButtonStyle.Danger)
        .setDisabled(true)
    );

    const sent = await message.reply({ embeds: [embed], components: [waitRow] });
    const delay = Math.floor(Math.random() * 4000) + 2000;

    setTimeout(async () => {
      const goRow = new ActionRowBuilder().addComponents(
        new ButtonBuilder()
          .setCustomId('fastclick_go')
          .setLabel('🟢 CLICK NOW!')
          .setStyle(ButtonStyle.Success)
      );

      const start = Date.now();
      await sent.edit({ components: [goRow] });

      const collector = message.channel.createMessageComponentCollector({
        filter: i => i.customId === 'fastclick_go' && i.user.id === message.author.id,
        time: 5000,
        max: 1
      });

      collector.on('collect', async i => {
        const time = Date.now() - start;
        const doneRow = new ActionRowBuilder().addComponents(
          new ButtonBuilder()
            .setCustomId('fastclick_done')
            .setLabel(`✅ ${time}ms`)
            .setStyle(ButtonStyle.Secondary)
            .setDisabled(true)
        );
        await i.update({
          embeds: [new EmbedBuilder().setColor(0x2ecc71).setTitle('🖱️ Fast Click!').setDescription(`You clicked in **${time}ms**! ${time < 300 ? '🔥 Incredible!' : time < 600 ? '⚡ Fast!' : '👍 Good!'}`)],
          components: [doneRow]
        });
      });

      collector.on('end', collected => {
        if (collected.size === 0) sent.edit({ content: '⏰ Too slow!', components: [] });
      });
    }, delay);
  }
};
