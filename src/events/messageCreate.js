import { EmbedBuilder } from 'discord.js';
import { PREFIX } from '../../index.js';
import User from '../models/User.js';
import { xpForLevel } from '../utils/helpers.js';

export default {
  name: 'messageCreate',
  async execute(message, client) {
    if (message.author.bot || !message.guild) return;

    // Bot mention response
    if (message.mentions.has(client.user) && message.content.trim().startsWith(`<@${client.user.id}>`)) {
      const embed = new EmbedBuilder()
        .setColor(0x3498db)
        .setTitle('👋 Hey there!')
        .setDescription(`My prefix is **²**\nType \`²help\` to see all commands!`)
        .setThumbnail(client.user.displayAvatarURL({ dynamic: true }))
        .setFooter({ text: 'Developed by NB4rr', iconURL: message.guild.iconURL() })
        .setTimestamp();
      return message.reply({ embeds: [embed] });
    }

    // XP system (only for non-command messages)
    if (!message.content.startsWith(PREFIX)) {
      const cooldownKey = `${message.author.id}-${message.guild.id}`;
      if (!client.xpCooldowns) client.xpCooldowns = new Set();
      if (client.xpCooldowns.has(cooldownKey)) return;
      client.xpCooldowns.add(cooldownKey);
      setTimeout(() => client.xpCooldowns.delete(cooldownKey), 60000);

      const xpGain = Math.floor(Math.random() * 10) + 5;
      const user = await User.findOneAndUpdate(
        { userId: message.author.id, guildId: message.guild.id },
        { $inc: { xp: xpGain, coins: 1 } },
        { upsert: true, new: true }
      );

      const xpNeeded = xpForLevel(user.level);
      if (user.xp >= xpNeeded) {
        await User.findOneAndUpdate(
          { userId: message.author.id, guildId: message.guild.id },
          { $inc: { level: 1 }, $set: { xp: 0 } }
        );
        const embed = new EmbedBuilder()
          .setColor(0xf1c40f)
          .setTitle('🎉 Level Up!')
          .setDescription(`Congratulations ${message.author}! You reached **Level ${user.level + 1}**!`)
          .setThumbnail(message.author.displayAvatarURL({ dynamic: true }))
          .setTimestamp();
        await message.channel.send({ embeds: [embed] });
      }
      return;
    }

    // Parse prefix command
    const args = message.content.slice(PREFIX.length).trim().split(/ +/);
    const commandName = args.shift().toLowerCase();
    const command = client.commands.get(commandName);
    if (!command) return;

    try {
      await command.execute(message, args, client);
    } catch (error) {
      console.error(error);
      message.reply({ content: '❌ An error occurred!' });
    }
  }
};
