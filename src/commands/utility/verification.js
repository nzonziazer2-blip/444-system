import { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } from 'discord.js';
import Guild from '../../models/Guild.js';
import { successEmbed, errorEmbed } from '../../utils/helpers.js';

export default {
  data: new SlashCommandBuilder()
    .setName('verification')
    .setDescription('Setup verification system')
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
    .addSubcommand(sub => sub
      .setName('setup')
      .setDescription('Setup verification')
      .addRoleOption(opt => opt.setName('role').setDescription('Role given after verification').setRequired(true))
      .addChannelOption(opt => opt.setName('logs').setDescription('Verification logs channel').setRequired(true)))
    .addSubcommand(sub => sub
      .setName('send')
      .setDescription('Send verification panel')
      .addChannelOption(opt => opt.setName('channel').setDescription('Channel to send panel').setRequired(true))),

  async execute(interaction) {
    const sub = interaction.options.getSubcommand();

    if (sub === 'setup') {
      const role = interaction.options.getRole('role');
      const logs = interaction.options.getChannel('logs');

      await Guild.findOneAndUpdate(
        { guildId: interaction.guild.id },
        { $set: { verifiedRole: role.id, verificationChannel: logs.id } },
        { upsert: true }
      );

      return interaction.reply({ embeds: [successEmbed('Verification Setup', `Verified role: ${role}\nLogs channel: ${logs}`)] });
    }

    if (sub === 'send') {
      const channel = interaction.options.getChannel('channel');

      const embed = new EmbedBuilder()
        .setColor(0x2ecc71)
        .setTitle('✅ Verification')
        .setDescription('Click the button below to verify yourself and get access to the server!')
        .setFooter({ text: interaction.guild.name, iconURL: interaction.guild.iconURL() })
        .setTimestamp();

      const row = new ActionRowBuilder().addComponents(
        new ButtonBuilder()
          .setCustomId('verify_button')
          .setLabel('Verify Me!')
          .setStyle(ButtonStyle.Success)
          .setEmoji('✅')
      );

      await channel.send({ embeds: [embed], components: [row] });
      return interaction.reply({ embeds: [successEmbed('Panel Sent', `Verification panel sent to ${channel}`)], ephemeral: true });
    }
  }
};