import { SlashCommandBuilder, PermissionFlagsBits } from 'discord.js';
import Guild from '../../models/Guild.js';
import { successEmbed, errorEmbed } from '../../utils/helpers.js';

export default {
  data: new SlashCommandBuilder()
    .setName('jail')
    .setDescription('Jail or unjail a member')
    .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers)
    .addSubcommand(sub => sub
      .setName('set')
      .setDescription('Setup jail system')
      .addRoleOption(opt => opt.setName('role').setDescription('Jail role').setRequired(true))
      .addChannelOption(opt => opt.setName('channel').setDescription('Jail channel').setRequired(true)))
    .addSubcommand(sub => sub
      .setName('add')
      .setDescription('Jail a member')
      .addUserOption(opt => opt.setName('user').setDescription('User to jail').setRequired(true))
      .addStringOption(opt => opt.setName('reason').setDescription('Reason').setRequired(false)))
    .addSubcommand(sub => sub
      .setName('remove')
      .setDescription('Unjail a member')
      .addUserOption(opt => opt.setName('user').setDescription('User to unjail').setRequired(true))),

  async execute(interaction) {
    const sub = interaction.options.getSubcommand();

    if (sub === 'set') {
      const role = interaction.options.getRole('role');
      const channel = interaction.options.getChannel('channel');

      await Guild.findOneAndUpdate(
        { guildId: interaction.guild.id },
        { $set: { jailRole: role.id, jailChannel: channel.id } },
        { upsert: true }
      );

      return interaction.reply({ embeds: [successEmbed('Jail Setup', `Jail role: ${role}\nJail channel: ${channel}`)] });
    }

    if (sub === 'add') {
      const target = interaction.options.getUser('user');
      const reason = interaction.options.getString('reason') || 'No reason provided';
      const member = interaction.guild.members.cache.get(target.id);
      const guildData = await Guild.findOne({ guildId: interaction.guild.id });

      if (!guildData?.jailRole) return interaction.reply({ embeds: [errorEmbed('Error', 'Jail role not set. Use `/jail set` first.')], ephemeral: true });
      if (!member) return interaction.reply({ embeds: [errorEmbed('Error', 'Member not found.')], ephemeral: true });

      // Save current roles and assign jail role
      const currentRoles = member.roles.cache
        .filter(r => r.id !== interaction.guild.id)
        .map(r => r.id);

      await member.roles.set([guildData.jailRole]);

      return interaction.reply({ embeds: [successEmbed('Member Jailed', `${target} has been jailed.\n**Reason:** ${reason}`)] });
    }

    if (sub === 'remove') {
      const target = interaction.options.getUser('user');
      const member = interaction.guild.members.cache.get(target.id);
      const guildData = await Guild.findOne({ guildId: interaction.guild.id });

      if (!guildData?.jailRole) return interaction.reply({ embeds: [errorEmbed('Error', 'Jail role not set.')], ephemeral: true });
      if (!member) return interaction.reply({ embeds: [errorEmbed('Error', 'Member not found.')], ephemeral: true });

      await member.roles.remove(guildData.jailRole);
      return interaction.reply({ embeds: [successEmbed('Member Unjailed', `${target} has been unjailed.`)] });
    }
  }
};