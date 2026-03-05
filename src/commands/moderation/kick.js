import { SlashCommandBuilder, PermissionFlagsBits } from 'discord.js';
import Guild from '../../models/Guild.js';
import { sendLog, successEmbed, errorEmbed, logEmbed } from '../../utils/helpers.js';

export default {
  data: new SlashCommandBuilder()
    .setName('kick')
    .setDescription('Kick a member from the server')
    .addUserOption(opt => opt.setName('user').setDescription('The user to kick').setRequired(true))
    .addStringOption(opt => opt.setName('reason').setDescription('Reason for the kick').setRequired(false))
    .setDefaultMemberPermissions(PermissionFlagsBits.KickMembers),

  async execute(interaction) {
    const target = interaction.options.getUser('user');
    const reason = interaction.options.getString('reason') || 'No reason provided';
    const member = interaction.guild.members.cache.get(target.id);

    if (!member) return interaction.reply({ embeds: [errorEmbed('Error', 'User not found.')], ephemeral: true });
    if (!member.kickable) return interaction.reply({ embeds: [errorEmbed('Error', 'I cannot kick this user.')], ephemeral: true });

    await member.kick(reason);
    await interaction.reply({ embeds: [successEmbed('Member Kicked', `${target} has been kicked.\n**Reason:** ${reason}`)] });

    const guildData = await Guild.findOne({ guildId: interaction.guild.id });
    if (guildData?.kickLogsChannel) {
      const log = logEmbed('👢 Member Kicked', `**User:** ${target} (${target.id})\n**Moderator:** ${interaction.user}\n**Reason:** ${reason}`, 0xe67e22);
      await sendLog(interaction.guild, guildData.kickLogsChannel, log);
    }
  }
};