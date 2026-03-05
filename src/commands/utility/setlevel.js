import { PermissionFlagsBits } from 'discord.js';
import User from '../../models/User.js';
import { successEmbed, errorEmbed } from '../../utils/helpers.js';

export default {
  name: 'setlevel',
  description: 'Set level of a member',
  usage: '²setlevel @user [level]',

  async execute(message, args, client) {
    if (!message.member.permissions.has(PermissionFlagsBits.Administrator))
      return message.reply({ embeds: [errorEmbed('Error', 'You need Administrator permission!')] });

    const target = message.mentions.users.first();
    if (!target) return message.reply({ embeds: [errorEmbed('Error', 'Please mention a user!')] });

    const level = parseInt(args[1]);
    if (isNaN(level) || level < 0) return message.reply({ embeds: [errorEmbed('Error', 'Please provide a valid level!')] });

    await User.findOneAndUpdate(
      { userId: target.id, guildId: message.guild.id },
      { $set: { level, xp: 0 } },
      { upsert: true }
    );

    await message.reply({ embeds: [successEmbed('Level Set', `${target}'s level has been set to **${level}**!`)] });
  }
};
