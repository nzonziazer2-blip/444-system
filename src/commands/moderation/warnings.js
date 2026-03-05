import { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits } from 'discord.js';
import User from '../../models/User.js';

export default {
  data: new SlashCommandBuilder()
    .setName('warnings')
    .setDescription('Check warnings of a member')
    .addUserOption(opt => opt.setName('user').setDescription('The user to check').setRequired(true))
    .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers),

  async execute(interaction) {
    const target = interaction.options.getUser('user');
    const userData = await User.findOne({ userId: target.id, guildId: interaction.guild.id });

    if (!userData || userData.warns.length === 0) {
      return interaction.reply({ content: `${target} has no warnings.`, ephemeral: true });
    }

    const warnList = userData.warns.map((w, i) =>
      `**${i + 1}.** ${w.reason} — <@${w.moderator}> — <t:${Math.floor(new Date(w.date).getTime() / 1000)}:R>`
    ).join('\n');

    const embed = new EmbedBuilder()
      .setColor(0xf39c12)
      .setTitle(`⚠️ Warnings — ${target.username}`)
      .setDescription(warnList)
      .setThumbnail(target.displayAvatarURL())
      .setFooter({ text: `Total: ${userData.warns.length} warning(s)` });

    await interaction.reply({ embeds: [embed] });
  }
};