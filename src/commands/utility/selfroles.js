import { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } from 'discord.js';
import Guild from '../../models/Guild.js';
import { successEmbed, errorEmbed } from '../../utils/helpers.js';

export default {
  data: new SlashCommandBuilder()
    .setName('selfroles')
    .setDescription('Manage self roles')
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
    .addSubcommand(sub => sub
      .setName('add')
      .setDescription('Add a self role')
      .addRoleOption(opt => opt.setName('role').setDescription('The role').setRequired(true))
      .addStringOption(opt => opt.setName('label').setDescription('Button label').setRequired(true))
      .addStringOption(opt => opt.setName('emoji').setDescription('Button emoji').setRequired(false)))
    .addSubcommand(sub => sub
      .setName('remove')
      .setDescription('Remove a self role')
      .addRoleOption(opt => opt.setName('role').setDescription('The role to remove').setRequired(true)))
    .addSubcommand(sub => sub
      .setName('send')
      .setDescription('Send the self roles panel')
      .addChannelOption(opt => opt.setName('channel').setDescription('Channel to send panel').setRequired(true))),

  async execute(interaction) {
    const sub = interaction.options.getSubcommand();

    if (sub === 'add') {
      const role = interaction.options.getRole('role');
      const label = interaction.options.getString('label');
      const emoji = interaction.options.getString('emoji') || null;

      await Guild.findOneAndUpdate(
        { guildId: interaction.guild.id },
        { $push: { selfRoles: { roleId: role.id, label, emoji } } },
        { upsert: true }
      );

      return interaction.reply({ embeds: [successEmbed('Self Role Added', `${role} added with label **${label}**`)] });
    }

    if (sub === 'remove') {
      const role = interaction.options.getRole('role');

      await Guild.findOneAndUpdate(
        { guildId: interaction.guild.id },
        { $pull: { selfRoles: { roleId: role.id } } }
      );

      return interaction.reply({ embeds: [successEmbed('Self Role Removed', `${role} has been removed from self roles.`)] });
    }

    if (sub === 'send') {
      const channel = interaction.options.getChannel('channel');
      const guildData = await Guild.findOne({ guildId: interaction.guild.id });

      if (!guildData?.selfRoles?.length) {
        return interaction.reply({ embeds: [errorEmbed('Error', 'No self roles configured. Use `/selfroles add` first.')], ephemeral: true });
      }

      const embed = new EmbedBuilder()
        .setColor(0x3498db)
        .setTitle('🎭 Self Roles')
        .setDescription('Click a button below to get or remove a role!')
        .setFooter({ text: interaction.guild.name, iconURL: interaction.guild.iconURL() })
        .setTimestamp();

      // Split into rows of 5 buttons max
      const rows = [];
      for (let i = 0; i < guildData.selfRoles.length; i += 5) {
        const chunk = guildData.selfRoles.slice(i, i + 5);
        const row = new ActionRowBuilder().addComponents(
          chunk.map(r => {
            const btn = new ButtonBuilder()
              .setCustomId(`selfrole_${r.roleId}`)
              .setLabel(r.label)
              .setStyle(ButtonStyle.Secondary);
            if (r.emoji) btn.setEmoji(r.emoji);
            return btn;
          })
        );
        rows.push(row);
      }

      await channel.send({ embeds: [embed], components: rows });
      return interaction.reply({ embeds: [successEmbed('Panel Sent', `Self roles panel sent to ${channel}`)], ephemeral: true });
    }
  }
};