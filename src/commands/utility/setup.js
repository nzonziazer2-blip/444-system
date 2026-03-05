import { PermissionFlagsBits } from 'discord.js';
import Guild from '../../models/Guild.js';
import { successEmbed, errorEmbed } from '../../utils/helpers.js';

const fieldMap = {
  welcome: 'welcomeChannel',
  leave: 'leaveChannel',
  warnlogs: 'warnLogsChannel',
  timeoutlogs: 'timeoutLogsChannel',
  kicklogs: 'kickLogsChannel',
  banlogs: 'banLogsChannel',
  unbanlogs: 'unbanLogsChannel',
  movelogs: 'moveLogsChannel',
  mutelogs: 'muteLogsChannel',
  messagelogs: 'messageLogsChannel',
  rolelogs: 'roleLogsChannel',
  channellogs: 'channelLogsChannel',
  nicklogs: 'nickLogsChannel',
  disconnectlogs: 'disconnectLogsChannel',
};

export default {
  name: 'setup',
  description: 'Setup bot channels',
  usage: '²setup [type] [#channel]',

  async execute(message, args, client) {
    if (!message.member.permissions.has(PermissionFlagsBits.Administrator))
      return message.reply({ embeds: [errorEmbed('Error', 'You need Administrator permission!')] });

    const sub = args[0]?.toLowerCase();
    const channel = message.mentions.channels.first();

    if (!sub || !fieldMap[sub])
      return message.reply({ embeds: [errorEmbed('Error', `Invalid type! Use: \`${Object.keys(fieldMap).join('` `')}\``)] });

    if (!channel)
      return message.reply({ embeds: [errorEmbed('Error', 'Please mention a channel!')] });

    await Guild.findOneAndUpdate(
      { guildId: message.guild.id },
      { $set: { [fieldMap[sub]]: channel.id } },
      { upsert: true }
    );

    await message.reply({ embeds: [successEmbed('Setup Complete', `${channel} has been set as the **${sub}** channel.`)] });
  }
};
