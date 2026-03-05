import mongoose from 'mongoose';

const guildSchema = new mongoose.Schema({
  guildId: { type: String, required: true, unique: true },
  // Channels
  welcomeChannel: { type: String, default: null },
  leaveChannel: { type: String, default: null },
  logsChannel: { type: String, default: null },
  warnLogsChannel: { type: String, default: null },
  timeoutLogsChannel: { type: String, default: null },
  kickLogsChannel: { type: String, default: null },
  banLogsChannel: { type: String, default: null },
  unbanLogsChannel: { type: String, default: null },
  moveLogsChannel: { type: String, default: null },
  muteLogsChannel: { type: String, default: null },
  nickLogsChannel: { type: String, default: null },
  roleLogsChannel: { type: String, default: null },
  channelLogsChannel: { type: String, default: null },
  messageLogsChannel: { type: String, default: null },
  verificationChannel: { type: String, default: null },
  jailChannel: { type: String, default: null },
  disconnectLogsChannel: { type: String, default: null },
  // Roles
  verifiedRole: { type: String, default: null },
  jailRole: { type: String, default: null },
  selfRoles: [{ roleId: String, label: String, emoji: String }],
  // Voice
  oneTapChannel: { type: String, default: null },
  oneTapCategory: { type: String, default: null },
  // Welcome
  welcomeMessage: { type: String, default: 'Welcome {user} to {server}!' },
  leaveMessage: { type: String, default: '{user} has left the server.' },
});

export default mongoose.model('Guild', guildSchema);