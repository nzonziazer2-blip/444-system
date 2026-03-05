import { PermissionFlagsBits } from 'discord.js';
import { successEmbed, errorEmbed } from '../../utils/helpers.js';

export default {
  name: 'untimeout',
  description: 'Remove timeout from a member',
  usage: '²untimeout @user',

  async execute(message, args, client) {
    if (!message.member.permissions.has(PermissionFlagsBits.ModerateMembers))
      return message.reply({ embeds: [errorEmbed('Error', 'You don\'t have permission!')] });

    const target = message.mentions.users.first();
    if (!target) return message.reply({ embeds: [errorEmbed('Error', 'Please mention a user!')] });

    const member = message.guild.members.cache.get(target.id);
    if (!member) return message.reply({ embeds: [errorEmbed('Error', 'User not found.')] });

    await member.timeout(null);
    await message.reply({ embeds: [successEmbed('Timeout Removed', `${target}'s timeout has been removed.`)] });
  }
};
