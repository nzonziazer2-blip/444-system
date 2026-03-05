import { SlashCommandBuilder, EmbedBuilder } from 'discord.js';

export default {
  data: new SlashCommandBuilder()
    .setName('stats')
    .setDescription('Show server statistics'),

  async execute(interaction) {
    const guild = interaction.guild;
    await guild.members.fetch();

    const totalMembers = guild.memberCount;
    const humans = guild.members.cache.filter(m => !m.user.bot).size;
    const bots = guild.members.cache.filter(m => m.user.bot).size;
    const online = guild.members.cache.filter(m => m.presence?.status === 'online').size;
    const textChannels = guild.channels.cache.filter(c => c.type === 0).size;
    const voiceChannels = guild.channels.cache.filter(c => c.type === 2).size;
    const roles = guild.roles.cache.size - 1;
    const emojis = guild.emojis.cache.size;
    const boosts = guild.premiumSubscriptionCount;
    const boostLevel = guild.premiumTier;

    const embed = new EmbedBuilder()
      .setColor(0x3498db)
      .setTitle(`📊 ${guild.name} — Server Stats`)
      .setThumbnail(guild.iconURL({ dynamic: true }))
      .addFields(
        { name: '👥 Total Members', value: `${totalMembers}`, inline: true },
        { name: '👤 Humans', value: `${humans}`, inline: true },
        { name: '🤖 Bots', value: `${bots}`, inline: true },
        { name: '🟢 Online', value: `${online}`, inline: true },
        { name: '💬 Text Channels', value: `${textChannels}`, inline: true },
        { name: '🔊 Voice Channels', value: `${voiceChannels}`, inline: true },
        { name: '🎭 Roles', value: `${roles}`, inline: true },
        { name: '😀 Emojis', value: `${emojis}`, inline: true },
        { name: '🚀 Boosts', value: `${boosts} (Level ${boostLevel})`, inline: true },
        { name: '📅 Created', value: `<t:${Math.floor(guild.createdTimestamp / 1000)}:R>`, inline: true },
        { name: '👑 Owner', value: `<@${guild.ownerId}>`, inline: true },
      )
      .setFooter({ text: `ID: ${guild.id}` })
      .setTimestamp();

    await interaction.reply({ embeds: [embed] });
  }
};