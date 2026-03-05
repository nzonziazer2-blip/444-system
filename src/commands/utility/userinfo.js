import { SlashCommandBuilder, EmbedBuilder } from 'discord.js';

export default {
  data: new SlashCommandBuilder()
    .setName('userinfo')
    .setDescription('Get info about a user')
    .addUserOption(opt => opt.setName('user').setDescription('User to check').setRequired(false)),

  async execute(interaction) {
    const target = interaction.options.getMember('user') || interaction.member;
    const user = target.user;

    const roles = target.roles.cache
      .filter(r => r.id !== interaction.guild.id)
      .sort((a, b) => b.position - a.position)
      .map(r => `${r}`)
      .slice(0, 10)
      .join(', ') || 'None';

    const embed = new EmbedBuilder()
      .setColor(target.displayHexColor || 0x3498db)
      .setTitle(`👤 ${user.username}`)
      .setThumbnail(user.displayAvatarURL({ dynamic: true }))
      .addFields(
        { name: '🆔 ID', value: user.id, inline: true },
        { name: '🤖 Bot', value: user.bot ? 'Yes' : 'No', inline: true },
        { name: '📅 Account Created', value: `<t:${Math.floor(user.createdTimestamp / 1000)}:R>`, inline: true },
        { name: '📥 Joined Server', value: `<t:${Math.floor(target.joinedTimestamp / 1000)}:R>`, inline: true },
        { name: '🎭 Roles', value: roles },
      )
      .setFooter({ text: `${interaction.guild.name}` })
      .setTimestamp();

    await interaction.reply({ embeds: [embed] });
  }
};