import { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, PermissionFlagsBits } from 'discord.js';
import Guild from '../../models/Guild.js';
import { successEmbed, errorEmbed } from '../../utils/helpers.js';

export default {
  name: 'selfroles',
  description: 'Manage self roles',
  usage: '²selfroles add/remove/send',

  async execute(message, args, client) {
    if (!message.member.permissions.has(PermissionFlagsBits.Administrator))
      return message.reply({ embeds: [errorEmbed('Error', 'You need Administrator permission!')] });

    const sub = args[0]?.toLowerCase();

    if (sub === 'add') {
      const role = message.mentions.roles.first();
      const label = args[2];
      const emoji = args[3] || null;

      if (!role) return message.reply({ embeds: [errorEmbed('Error', 'Please mention a role!')] });
      if (!label) return message.reply({ embeds: [errorEmbed('Error', 'Please provide a label!')] });

      await Guild.findOneAndUpdate(
        { guildId: message.guild.id },
        { $push: { selfRoles: { roleId: role.id, label, emoji } } },
        { upsert: true }
      );

      return message.reply({ embeds: [successEmbed('Self Role Added', `${role} added with label **${label}**`)] });
    }

    if (sub === 'remove') {
      const role = message.mentions.roles.first();
      if (!role) return message.reply({ embeds: [errorEmbed('Error', 'Please mention a role!')] });

      await Guild.findOneAndUpdate(
        { guildId: message.guild.id },
        { $pull: { selfRoles: { roleId: role.id } } }
      );

      return message.reply({ embeds: [successEmbed('Self Role Removed', `${role} removed from self roles.`)] });
    }

    if (sub === 'send') {
      const channel = message.mentions.channels.first();
      if (!channel) return message.reply({ embeds: [errorEmbed('Error', 'Please mention a channel!')] });

      const guildData = await Guild.findOne({ guildId: message.guild.id });
      if (!guildData?.selfRoles?.length)
        return message.reply({ embeds: [errorEmbed('Error', 'No self roles configured. Use `²selfroles add` first.')] });

      const embed = new EmbedBuilder()
        .setColor(0x3498db)
        .setTitle('🎭 Self Roles')
        .setDescription('Click a button below to get or remove a role!')
        .setFooter({ text: message.guild.name, iconURL: message.guild.iconURL() })
        .setTimestamp();

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
      return message.reply({ embeds: [successEmbed('Panel Sent', `Self roles panel sent to ${channel}`)] });
    }
  }
};
