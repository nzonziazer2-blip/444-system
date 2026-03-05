import { EmbedBuilder, PermissionFlagsBits } from 'discord.js';
import User from '../../models/User.js';
import { errorEmbed } from '../../utils/helpers.js';

export default {
  name: 'warnings',
  description: 'Check warnings of a member',
  usage: '²warnings @user',

  async execute(message, args, client) {
    if (!message.member.permissions.has(PermissionFlagsBits.ModerateMembers))
      return message.reply({ embeds: [errorEmbed('Error', 'You don\'t have permission!')] });

    const target = message.mentions.users.first();
    if (!target) return message.reply({ embeds: [errorEmbed('Error', 'Please mention a user!')] });

    const userData = await User.findOne({ userId: target.id, guildId: message.guild.id });
    if (!userData || userData.warns.length === 0)
      return message.reply({ content: `${target} has no warnings.` });

    const warnList = userData.warns.map((w, i) =>
      `**${i + 1}.** ${w.reason} — <@${w.moderator}> — <t:${Math.floor(new Date(w.date).getTime() / 1000)}:R>`
    ).join('\n');

    const embed = new EmbedBuilder()
      .setColor(0xf39c12)
      .setTitle(`⚠️ Warnings — ${target.username}`)
      .setDescription(warnList)
      .setThumbnail(target.displayAvatarURL())
      .setFooter({ text: `Total: ${userData.warns.length} warning(s)` });

    await message.reply({ embeds: [embed] });
  }
};
