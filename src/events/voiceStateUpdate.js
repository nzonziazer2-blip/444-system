import { ChannelType, PermissionFlagsBits } from 'discord.js';
import Guild from '../models/Guild.js';
import TempVoice from '../models/TempVoice.js';

export default {
  name: 'voiceStateUpdate',
  async execute(oldState, newState, client) {
    const guildData = await Guild.findOne({ guildId: newState.guild.id });
    if (!guildData) return;

    // Member joins the one tap channel
    if (newState.channelId === guildData.oneTapChannel) {
      const category = newState.guild.channels.cache.get(guildData.oneTapCategory);
      if (!category) return;

      const tempChannel = await newState.guild.channels.create({
        name: `🔊 ${newState.member.displayName}'s Room`,
        type: ChannelType.GuildVoice,
        parent: category.id,
        permissionOverwrites: [
          {
            id: newState.member.id,
            allow: [
              PermissionFlagsBits.ManageChannels,
              PermissionFlagsBits.MoveMembers,
              PermissionFlagsBits.MuteMembers,
            ]
          }
        ]
      });

      await newState.member.voice.setChannel(tempChannel);

      await TempVoice.create({
        channelId: tempChannel.id,
        ownerId: newState.member.id,
        guildId: newState.guild.id
      });
    }

    // Member leaves a temp channel
    if (oldState.channelId) {
      const tempVoice = await TempVoice.findOne({ channelId: oldState.channelId });
      if (!tempVoice) return;

      const channel = oldState.guild.channels.cache.get(oldState.channelId);
      if (!channel) return;

      if (channel.members.size === 0) {
        await channel.delete();
        await TempVoice.deleteOne({ channelId: oldState.channelId });
      }
    }
  }
};