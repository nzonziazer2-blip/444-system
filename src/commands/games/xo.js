import { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } from 'discord.js';

const xoGames = new Map();

export default {
  name: 'xo',
  description: 'Play Tic Tac Toe against the bot',
  usage: '²xo',

  async execute(message, args, client) {
    const board = Array(9).fill(null);
    xoGames.set(message.author.id, { board });

    const rows = buildRows(board);
    const embed = new EmbedBuilder()
      .setColor(0x3498db)
      .setTitle('❌⭕ Tic Tac Toe')
      .setDescription('Your turn! You are **X**');

    await message.reply({ embeds: [embed], components: rows });
  }
};

export function getXOGames() { return xoGames; }

function buildRows(board, disabled = false) {
  const rows = [];
  for (let i = 0; i < 3; i++) {
    const row = new ActionRowBuilder();
    for (let j = 0; j < 3; j++) {
      const idx = i * 3 + j;
      const cell = board[idx];
      row.addComponents(
        new ButtonBuilder()
          .setCustomId(`xo_${idx}`)
          .setLabel(cell || '​')
          .setStyle(cell === 'X' ? ButtonStyle.Danger : cell === 'O' ? ButtonStyle.Primary : ButtonStyle.Secondary)
          .setDisabled(disabled || !!cell)
      );
    }
    rows.push(row);
  }
  return rows;
}
