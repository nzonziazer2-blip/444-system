import { SlashCommandBuilder, PermissionFlagsBits } from 'discord.js';
import User from '../../models/User.js';
import { successEmbed, errorEmbed } from '../../utils/helpers.js';

export default {
  data: new SlashCommandBuilder()
    .setName('givecoin')
    .setDescription('Give coins to a member')
    .addUserOption(opt => opt.setName('user').setDescription('User to give coins').setRequired(true))
    .addIntegerOption(opt => opt.setName('amount').setDescription('Amount of coins').setRequired(true).setMinValue(1))
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),

  async execute(interaction) {
    const target = interaction.options.getUser('user');
    const amount = interaction.options.getInteger('amount');

    await User.findOneAndUpdate(
      { userId: target.id, guildId: interaction.guild.id },
      { $inc: { coins: amount } },
      { upsert: true }
    );

    await interaction.reply({ embeds: [successEmbed('Coins Given', `${target} received **${amount}** coins!`)] });
  }
};