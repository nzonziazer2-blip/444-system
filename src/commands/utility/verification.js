import { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, PermissionFlagsBits } from 'discord.js';
import Guild from '../../models/Guild.js';
import { successEmbed, errorEmbed } from '../../utils/helpers.js';

export default {
  name: 'verification',
  description: 'Setup verification system',
  usage: '²verification setup @role #logs | ²verification send #channel',

  async execute(message, args, client) {
    if (!message.member.permissions.has(PermissionFlagsBits.Administrator))
      return message.reply({ embeds: [errorEmbed('Error', 'You need Administrator permission!')] });

    const sub = args[0]?.toLowerCase();

    if (sub === 'setup') {
      const role = message.mentions.roles.first();
      const logs = message.mentions.channels.first();

      if (!role) return message.reply({ embeds: [errorEmbed('Error', 'Please mention a role!')] });
      if (!logs) return message.reply({ embeds: [errorEmbed('Error', 'Please mention a logs channel!')] });

      await Guild.findOneAndUpdate(
        { guildId: message.guild.id },
        { $set: { verifiedRole: role.id, verificationChannel: logs.id } },
        { upsert: true }
      );

      return message.reply({ embeds: [successEmbed('Verification Setup', `Verified role: ${role}\nLogs channel: ${logs}`)] });
    }

    if (sub === 'send') {
      const channel = message.mentions.channels.first();
      if (!channel) return message.reply({ embeds: [errorEmbed('Error', 'Please mention a channel!')] });

      const embed = new EmbedBuilder()
        .setColor(0x2ecc71)
        .setTitle('✅ Verification')
        .setDescription('Click the button below to verify yourself!')
        .setFooter({ text: message.guild.name, iconURL: message.guild.iconURL() })
        .setTimestamp();

      const row = new ActionRowBuilder().addComponents(
        new ButtonBuilder()
          .setCustomId('verify_button')
          .setLabel('Verify Me!')
          .setStyle(ButtonStyle.Success)
          .setEmoji('✅')
      );

      await channel.send({ embeds: [embed], components: [row] });
      return message.reply({ embeds: [successEmbed('Panel Sent', `Verification panel sent to ${channel}`)] });
    }
  }
};
