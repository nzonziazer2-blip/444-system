import { EmbedBuilder } from 'discord.js';
import User from '../models/User.js';
import Guild from '../models/Guild.js';
import { xpForLevel } from '../utils/helpers.js';

export default {
  name: 'messageCreate',
  async execute(message, client) {
    if (message.author.bot || !message.guild) return;

    // XP cooldown (1 message per 60s gives XP)
    const cooldownKey = `${message.author.id}-${message.guild.id}`;
    if (client.xpCooldowns?.has(cooldownKey)) return;

    if (!client.xpCooldowns) client.xpCooldowns = new Set();
    client.xpCooldowns.add(cooldownKey);
    setTimeout(() => client.xpCooldowns.delete(cooldownKey), 60000);

    const xpGain = Math.floor(Math.random() * 10) + 5; // 5-15 XP per message

    const user = await User.findOneAndUpdate(
      { userId: message.author.id, guildId: message.guild.id },
      { $inc: { xp: xpGain, coins: 1 } },
      { upsert: true, new: true }
    );

    // Check level up
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
  }
};