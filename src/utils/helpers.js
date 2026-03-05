import { EmbedBuilder } from 'discord.js';

// Send a log to a specific channel
export async function sendLog(guild, channelId, embed) {
  if (!channelId) return;
  const channel = guild.channels.cache.get(channelId);
  if (!channel) return;
  await channel.send({ embeds: [embed] });
}

// Format duration (ms to readable)
export function formatDuration(ms) {
  const seconds = Math.floor(ms / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  if (days > 0) return `${days}d`;
  if (hours > 0) return `${hours}h`;
  if (minutes > 0) return `${minutes}m`;
  return `${seconds}s`;
}

// XP needed for next level
export function xpForLevel(level) {
  return level * 100 + 100;
}

// Success embed
export function successEmbed(title, description) {
  return new EmbedBuilder()
    .setColor(0x2ecc71)
    .setTitle(`✅ ${title}`)
    .setDescription(description)
    .setTimestamp();
}

// Error embed
export function errorEmbed(title, description) {
  return new EmbedBuilder()
    .setColor(0xe74c3c)
    .setTitle(`❌ ${title}`)
    .setDescription(description)
    .setTimestamp();
}

// Log embed
export function logEmbed(title, description, color = 0x3498db) {
  return new EmbedBuilder()
    .setColor(color)
    .setTitle(title)
    .setDescription(description)
    .setTimestamp();
}