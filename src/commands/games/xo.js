import { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } from 'discord.js';

const games = new Map();

function createBoard() {
  return Array(9).fill(null);
}

function checkWinner(board) {
  const lines = [
    [0,1,2],[3,4,5],[6,7,8],
    [0,3,6],[1,4,7],[2,5,8],
    [0,4,8],[2,4,6]
  ];
  for (const [a,b,c] of lines) {
    if (board[a] && board[a] === board[b] && board[a] === board[c]) return board[a];
  }
  return null;
}

function buildComponents(board, disabled = false) {
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

export default {
  data: new SlashCommandBuilder()
    .setName('xo')
    .setDescription('Play Tic Tac Toe against the bot'),

  async execute(interaction) {
    const board = createBoard();
    games.set(interaction.user.id, { board, turn: 'X' });

    const embed = new EmbedBuilder()
      .setColor(0x3498db)
      .setTitle('❌⭕ Tic Tac Toe')
      .setDescription('Your turn! You are **X**');

    await interaction.reply({ embeds: [embed], components: buildComponents(board) });
  }
};