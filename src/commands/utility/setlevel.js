import { SlashCommandBuilder, PermissionFlagsBits } from 'discord.js';
import User from '../../models/User.js';
import { successEmbed } from '../../utils/helpers.js';

export default {
  data: new SlashCommandBuilder()
    .setName('setlevel')
    .setDescription('Set level of a member')
    .addUserOption(opt => opt.setName('user').setDescription('User').setRequired(true))
    .addIntegerOption(opt => opt.setName('level').setDescription('Level').setRequired(true).setMinValue(0))
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),

  async execute(interaction) {
    const target = interaction.options.getUser('user');
    const level = interaction.options.getInteger('level');

    await User.findOneAndUpdate(
      { userId: target.id, guildId: interaction.guild.id },
      { $set: { level, xp: 0 } },
      { upsert: true }
    );

    await interaction.reply({ embeds: [successEmbed('Level Set', `${target}'s level has been set to **${level}**!`)] });
  }
};