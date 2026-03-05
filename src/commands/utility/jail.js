import { PermissionFlagsBits } from 'discord.js';
import Guild from '../../models/Guild.js';
import { successEmbed, errorEmbed } from '../../utils/helpers.js';

export default {
  name: 'jail',
  description: 'Jail or unjail a member',
  usage: '²jail set @role #channel | ²jail add @user [reason] | ²jail remove @user',

  async execute(message, args, client) {
    if (!message.member.permissions.has(PermissionFlagsBits.ModerateMembers))
      return message.reply({ embeds: [errorEmbed('Error', 'You don\'t have permission!')] });

    const sub = args[0]?.toLowerCase();

    if (sub === 'set') {
      const role = message.mentions.roles.first();
      const channel = message.mentions.channels.first();

      if (!role) return message.reply({ embeds: [errorEmbed('Error', 'Please mention a role!')] });
      if (!channel) return message.reply({ embeds: [errorEmbed('Error', 'Please mention a channel!')] });

      await Guild.findOneAndUpdate(
        { guildId: message.guild.id },
        { $set: { jailRole: role.id, jailChannel: channel.id } },
        { upsert: true }
      );

      return message.reply({ embeds: [successEmbed('Jail Setup', `Jail role: ${role}\nJail channel: ${channel}`)] });
    }

    if (sub === 'add') {
      const target = message.mentions.users.first();
      const reason = args.slice(2).join(' ') || 'No reason provided';
      const member = message.guild.members.cache.get(target?.id);
      const guildData = await Guild.findOne({ guildId: message.guild.id });

      if (!guildData?.jailRole) return message.reply({ embeds: [errorEmbed('Error', 'Jail role not set. Use `²jail set` first.')] });
      if (!member) return message.reply({ embeds: [errorEmbed('Error', 'Member not found.')] });

      await member.roles.set([guildData.jailRole]);
      return message.reply({ embeds: [successEmbed('Member Jailed', `${target} has been jailed.\n**Reason:** ${reason}`)] });
    }

    if (sub === 'remove') {
      const target = message.mentions.users.first();
      const member = message.guild.members.cache.get(target?.id);
      const guildData = await Guild.findOne({ guildId: message.guild.id });

      if (!guildData?.jailRole) return message.reply({ embeds: [errorEmbed('Error', 'Jail role not set.')] });
      if (!member) return message.reply({ embeds: [errorEmbed('Error', 'Member not found.')] });

      await member.roles.remove(guildData.jailRole);
      return message.reply({ embeds: [successEmbed('Member Unjailed', `${target} has been unjailed.`)] });
    }
  }
};
