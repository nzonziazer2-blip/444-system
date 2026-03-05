import { EmbedBuilder } from 'discord.js';
import User from '../../models/User.js';

export default {
  name: 'leaderboard',
  description: 'Show the server leaderboard',
  usage: '²leaderboard',

  async execute(message, args, client) {
    const users = await User.find({ guildId: message.guild.id })
      .sort({ level: -1, xp: -1 })
      .limit(10);

    if (!users.length) return message.reply({ content: 'No users found.' });

    const medals = ['🥇', '🥈', '🥉'];
    const description = users.map((u, i) =>
      `${medals[i] || `**${i + 1}.**`} <@${u.userId}> — Level **${u.level}** | XP: **${u.xp}**`
    ).join('\n');

    const embed = new EmbedBuilder()
      .setColor(0xf1c40f)
      .setTitle('🏆 Server Leaderboard')
      .setDescription(description)
      .setFooter({ text: message.guild.name, iconURL: message.guild.iconURL() })
      .setTimestamp();

    await message.reply({ embeds: [embed] });
  }
};
