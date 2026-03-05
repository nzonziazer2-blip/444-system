import { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } from 'discord.js';
import Guild from '../models/Guild.js';

const xoGames = new Map();

function checkWinner(board) {
  const lines = [[0,1,2],[3,4,5],[6,7,8],[0,3,6],[1,4,7],[2,5,8],[0,4,8],[2,4,6]];
  for (const [a,b,c] of lines) {
    if (board[a] && board[a] === board[b] && board[a] === board[c]) return board[a];
  }
  return null;
}

export default {
  name: 'interactionCreate',
  async execute(interaction, client) {

    // Slash commands
    if (interaction.isChatInputCommand()) {
      const command = client.commands.get(interaction.commandName);
      if (!command) return;
      try {
        await command.execute(interaction, client);
      } catch (error) {
        console.error(error);
        if (interaction.replied || interaction.deferred) {
          await interaction.followUp({ content: '❌ An error occurred!', ephemeral: true });
        } else {
          await interaction.reply({ content: '❌ An error occurred!', ephemeral: true });
        }
      }
    }

    // Buttons
    if (interaction.isButton()) {

      // Self roles
      if (interaction.customId.startsWith('selfrole_')) {
        const roleId = interaction.customId.replace('selfrole_', '');
        const role = interaction.guild.roles.cache.get(roleId);
        if (!role) return interaction.reply({ content: '❌ Role not found.', ephemeral: true });
        const member = interaction.guild.members.cache.get(interaction.user.id);
        if (member.roles.cache.has(roleId)) {
          await member.roles.remove(role);
          return interaction.reply({ content: `✅ Removed role **${role.name}**`, ephemeral: true });
        } else {
          await member.roles.add(role);
          return interaction.reply({ content: `✅ Added role **${role.name}**`, ephemeral: true });
        }
      }

      // Verification
      if (interaction.customId === 'verify_button') {
        const guildData = await Guild.findOne({ guildId: interaction.guild.id });
        if (!guildData?.verifiedRole) return interaction.reply({ content: '❌ Verification role not set.', ephemeral: true });
        const member = interaction.guild.members.cache.get(interaction.user.id);
        if (member.roles.cache.has(guildData.verifiedRole)) {
          return interaction.reply({ content: '✅ You are already verified!', ephemeral: true });
        }
        await member.roles.add(guildData.verifiedRole);
        if (guildData.verificationChannel) {
          const logChannel = interaction.guild.channels.cache.get(guildData.verificationChannel);
          if (logChannel) {
            const embed = new EmbedBuilder()
              .setColor(0x2ecc71)
              .setTitle('✅ Member Verified')
              .setDescription(`${interaction.user} has been verified.`)
              .addFields(
                { name: '👤 User', value: `${interaction.user.tag}`, inline: true },
                { name: '🆔 ID', value: interaction.user.id, inline: true }
              )
              .setThumbnail(interaction.user.displayAvatarURL({ dynamic: true }))
              .setTimestamp();
            await logChannel.send({ embeds: [embed] });
          }
        }
        return interaction.reply({ content: '✅ You have been verified! Welcome to the server!', ephemeral: true });
      }

      // RPS
      if (interaction.customId.startsWith('rps_')) {
        const choices = { rps_rock: '🪨 Rock', rps_paper: '📄 Paper', rps_scissors: '✂️ Scissors' };
        const wins = { rps_rock: 'rps_scissors', rps_paper: 'rps_rock', rps_scissors: 'rps_paper' };
        const botChoiceKey = Object.keys(choices)[Math.floor(Math.random() * 3)];
        const userChoice = interaction.customId;
        let result;
        if (userChoice === botChoiceKey) result = '🤝 It\'s a tie!';
        else if (wins[userChoice] === botChoiceKey) result = '✅ You win!';
        else result = '❌ You lose!';

        const embed = new EmbedBuilder()
          .setColor(result.includes('win') ? 0x2ecc71 : result.includes('lose') ? 0xe74c3c : 0xf39c12)
          .setTitle('🎮 Rock Paper Scissors')
          .addFields(
            { name: '👤 You', value: choices[userChoice], inline: true },
            { name: '🤖 Bot', value: choices[botChoiceKey], inline: true },
            { name: '🏆 Result', value: result }
          )
          .setTimestamp();

        return interaction.update({ embeds: [embed], components: [] });
      }

      // XO Game
      if (interaction.customId.startsWith('xo_')) {
        const idx = parseInt(interaction.customId.replace('xo_', ''));
        let game = xoGames.get(interaction.user.id);

        if (!game) return interaction.reply({ content: '❌ Start a new game with /xo', ephemeral: true });

        game.board[idx] = 'X';

        let winner = checkWinner(game.board);
        if (!winner && game.board.includes(null)) {
          const empty = game.board.map((v, i) => v === null ? i : null).filter(v => v !== null);
          const botMove = empty[Math.floor(Math.random() * empty.length)];
          game.board[botMove] = 'O';
          winner = checkWinner(game.board);
        }

        const rows = [];
        for (let i = 0; i < 3; i++) {
          const row = new ActionRowBuilder();
          for (let j = 0; j < 3; j++) {
            const i2 = i * 3 + j;
            const cell = game.board[i2];
            row.addComponents(
              new ButtonBuilder()
                .setCustomId(`xo_${i2}`)
                .setLabel(cell || '​')
                .setStyle(cell === 'X' ? ButtonStyle.Danger : cell === 'O' ? ButtonStyle.Primary : ButtonStyle.Secondary)
                .setDisabled(!!winner || !game.board.includes(null) || !!cell)
            );
          }
          rows.push(row);
        }

        let description;
        if (winner === 'X') { description = '✅ You win!'; xoGames.delete(interaction.user.id); }
        else if (winner === 'O') { description = '❌ Bot wins!'; xoGames.delete(interaction.user.id); }
        else if (!game.board.includes(null)) { description = '🤝 It\'s a tie!'; xoGames.delete(interaction.user.id); }
        else { description = 'Your turn! You are **X**'; xoGames.set(interaction.user.id, game); }

        const embed = new EmbedBuilder()
          .setColor(winner === 'X' ? 0x2ecc71 : winner === 'O' ? 0xe74c3c : 0x3498db)
          .setTitle('❌⭕ Tic Tac Toe')
          .setDescription(description);

        return interaction.update({ embeds: [embed], components: rows });
      }
    }
  }
};