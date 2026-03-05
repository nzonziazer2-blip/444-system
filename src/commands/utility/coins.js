import { SlashCommandBuilder, EmbedBuilder } from 'discord.js';
import User from '../../models/User.js';

export default {
  data: new SlashCommandBuilder()
    .setName('coins')
    .setDescription('Check your coins balance')
    .addUserOption(opt => opt.setName('user').setDescription('User to check').setRequired(false)),

  async execute(interaction) {
    const target = interaction.options.getUser('user') || interaction.user;
    const userData = await User.findOne({ userId: target.id, guildId: interaction.guild.id });

    const embed = new EmbedBuilder()
      .setColor(0xf1c40f)
      .setTitle('💰 Coins Balance')
      .setDescription(`${target} has **${userData?.coins || 0}** coins`)
      .setThumbnail(target.displayAvatarURL({ dynamic: true }))
      .setTimestamp();

    await interaction.reply({ embeds: [embed] });
  }
};