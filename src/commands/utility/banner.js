import { SlashCommandBuilder, EmbedBuilder } from 'discord.js';

export default {
  data: new SlashCommandBuilder()
    .setName('banner')
    .setDescription('Get banner of a user')
    .addUserOption(opt => opt.setName('user').setDescription('User').setRequired(false)),

  async execute(interaction) {
    await interaction.deferReply();
    const target = await interaction.client.users.fetch(
      interaction.options.getUser('user')?.id || interaction.user.id,
      { force: true }
    );

    if (!target.banner) {
      return interaction.editReply({ content: `❌ **${target.username}** has no banner.` });
    }

    const embed = new EmbedBuilder()
      .setColor(0x3498db)
      .setTitle(`🖼️ ${target.username}'s Banner`)
      .setImage(target.bannerURL({ dynamic: true, size: 1024 }))
      .setTimestamp();

    await interaction.editReply({ embeds: [embed] });
  }
};