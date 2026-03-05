import { SlashCommandBuilder, EmbedBuilder } from 'discord.js';
import User from '../../models/User.js';

export default {
  data: new SlashCommandBuilder()
    .setName('leaderboard')
    .setDescription('Show the server leaderboard'),

  async execute(interaction) {
    const users = await User.find({ guildId: interaction.guild.id })
      .sort({ level: -1, xp: -1 })
      .limit(10);

    if (!users.length) return interaction.reply({ content: 'No users found.', ephemeral: true });

    const medals = ['🥇', '🥈', '🥉'];
    const description = users.map((u, i) =>
      `${medals[i] || `**${i + 1}.**`} <@${u.userId}> — Level **${u.level}** | XP: **${u.xp}**`
    ).join('\n');

    const embed = new EmbedBuilder()
      .setColor(0xf1c40f)
      .setTitle('🏆 Server Leaderboard')
      .setDescription(description)
      .setFooter({ text: `${interaction.guild.name}`, iconURL: interaction.guild.iconURL() })
      .setTimestamp();

    await interaction.reply({ embeds: [embed] });
  }
};