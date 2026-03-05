import { SlashCommandBuilder, PermissionFlagsBits } from 'discord.js';
import { successEmbed, errorEmbed } from '../../utils/helpers.js';

export default {
  data: new SlashCommandBuilder()
    .setName('untimeout')
    .setDescription('Remove timeout from a member')
    .addUserOption(opt => opt.setName('user').setDescription('The user to untimeout').setRequired(true))
    .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers),

  async execute(interaction) {
    const target = interaction.options.getUser('user');
    const member = interaction.guild.members.cache.get(target.id);

    if (!member) return interaction.reply({ embeds: [errorEmbed('Error', 'User not found.')], ephemeral: true });

    await member.timeout(null);
    await interaction.reply({ embeds: [successEmbed('Timeout Removed', `${target}'s timeout has been removed.`)] });
  }
};