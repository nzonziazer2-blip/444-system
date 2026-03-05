import { SlashCommandBuilder, EmbedBuilder } from 'discord.js';

export default {
  data: new SlashCommandBuilder()
    .setName('avatar')
    .setDescription('Get avatar of a user')
    .addUserOption(opt => opt.setName('user').setDescription('User').setRequired(false)),

  async execute(interaction) {
    const target = interaction.options.getUser('user') || interaction.user;

    const embed = new EmbedBuilder()
      .setColor(0x3498db)
      .setTitle(`🖼️ ${target.username}'s Avatar`)
      .setImage(target.displayAvatarURL({ dynamic: true, size: 1024 }))
      .addFields(
        { name: '🔗 Links', value: `[PNG](${target.displayAvatarURL({ extension: 'png', size: 1024 })}) | [JPG](${target.displayAvatarURL({ extension: 'jpg', size: 1024 })}) | [WEBP](${target.displayAvatarURL({ extension: 'webp', size: 1024 })})` }
      )
      .setTimestamp();

    await interaction.reply({ embeds: [embed] });
  }
};