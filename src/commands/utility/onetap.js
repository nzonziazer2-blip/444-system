import { SlashCommandBuilder, PermissionFlagsBits, ChannelType } from 'discord.js';
import Guild from '../../models/Guild.js';
import { successEmbed, errorEmbed } from '../../utils/helpers.js';

export default {
  data: new SlashCommandBuilder()
    .setName('onetap')
    .setDescription('Setup one tap voice system')
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
    .addSubcommand(sub => sub
      .setName('setup')
      .setDescription('Setup the one tap channel')
      .addChannelOption(opt => opt.setName('channel').setDescription('The voice channel to join to create a room').setRequired(true))
      .addChannelOption(opt => opt.setName('category').setDescription('Category where temp channels will be created').setRequired(true))),

  async execute(interaction) {
    const sub = interaction.options.getSubcommand();

    if (sub === 'setup') {
      const channel = interaction.options.getChannel('channel');
      const category = interaction.options.getChannel('category');

      await Guild.findOneAndUpdate(
        { guildId: interaction.guild.id },
        { $set: { oneTapChannel: channel.id, oneTapCategory: category.id } },
        { upsert: true }
      );

      return interaction.reply({ embeds: [successEmbed('One Tap Setup', `When a member joins ${channel}, a temp voice channel will be created under ${category}.`)] });
    }
  }
};