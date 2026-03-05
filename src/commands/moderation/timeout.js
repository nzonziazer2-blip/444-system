import { SlashCommandBuilder, PermissionFlagsBits } from 'discord.js';
import Guild from '../../models/Guild.js';
import User from '../../models/User.js';
import { sendLog, successEmbed, errorEmbed, logEmbed } from '../../utils/helpers.js';

const durations = {
  '60': 60 * 1000,
  '300': 5 * 60 * 1000,
  '600': 10 * 60 * 1000,
  '3600': 60 * 60 * 1000,
  '86400': 24 * 60 * 60 * 1000,
  '604800': 7 * 24 * 60 * 60 * 1000,
};

export default {
  data: new SlashCommandBuilder()
    .setName('timeout')
    .setDescription('Timeout a member')
    .addUserOption(opt => opt.setName('user').setDescription('The user to timeout').setRequired(true))
    .addStringOption(opt => opt.setName('duration').setDescription('Duration').setRequired(true)
      .addChoices(
        { name: '1 minute', value: '60' },
        { name: '5 minutes', value: '300' },
        { name: '10 minutes', value: '600' },
        { name: '1 hour', value: '3600' },
        { name: '1 day', value: '86400' },
        { name: '1 week', value: '604800' },
      ))
    .addStringOption(opt => opt.setName('reason').setDescription('Reason').setRequired(false))
    .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers),

  async execute(interaction) {
    const target = interaction.options.getUser('user');
    const durationKey = interaction.options.getString('duration');
    const reason = interaction.options.getString('reason') || 'No reason provided';
    const member = interaction.guild.members.cache.get(target.id);
    const ms = durations[durationKey];

    if (!member) return interaction.reply({ embeds: [errorEmbed('Error', 'User not found.')], ephemeral: true });
    if (!member.moderatable) return interaction.reply({ embeds: [errorEmbed('Error', 'I cannot timeout this user.')], ephemeral: true });

    await member.timeout(ms, reason);

    const durationLabel = Object.keys(durations).find(k => k === durationKey);
    await interaction.reply({ embeds: [successEmbed('Member Timed Out', `${target} has been timed out.\n**Duration:** ${durationKey}s\n**Reason:** ${reason}`)] });

    await User.findOneAndUpdate(
      { userId: target.id, guildId: interaction.guild.id },
      { $push: { timeouts: { reason, moderator: interaction.user.id, duration: `${durationKey}s` } } },
      { upsert: true }
    );

    const guildData = await Guild.findOne({ guildId: interaction.guild.id });
    if (guildData?.timeoutLogsChannel) {
      const log = logEmbed('⏱️ Member Timed Out', `**User:** ${target} (${target.id})\n**Moderator:** ${interaction.user}\n**Duration:** ${durationKey}s\n**Reason:** ${reason}`, 0x9b59b6);
      await sendLog(interaction.guild, guildData.timeoutLogsChannel, log);
    }
  }
};