import { SlashCommandBuilder, PermissionFlagsBits } from 'discord.js';
import User from '../../models/User.js';
import { successEmbed, errorEmbed } from '../../utils/helpers.js';

export default {
  data: new SlashCommandBuilder()
    .setName('clearwarns')
    .setDescription('Clear all warnings of a member')
    .addUserOption(opt => opt.setName('user').setDescription('The user to clear warns').setRequired(true))
    .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers),

  async execute(interaction) {
    const target = interaction.options.getUser('user');
    const userData = await User.findOne({ userId: target.id, guildId: interaction.guild.id });

    if (!userData || userData.warns.length === 0) {
      return interaction.reply({ embeds: [errorEmbed('Error', `${target} has no warnings.`)], ephemeral: true });
    }

    await User.updateOne({ userId: target.id, guildId: interaction.guild.id }, { $set: { warns: [] } });
    await interaction.reply({ embeds: [successEmbed('Warnings Cleared', `All warnings for ${target} have been cleared.`)] });
  }
};