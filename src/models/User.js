import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  guildId: { type: String, required: true },
  // Levels
  xp: { type: Number, default: 0 },
  level: { type: Number, default: 0 },
  // Economy
  coins: { type: Number, default: 0 },
  // Warns
  warns: [{
    reason: String,
    moderator: String,
    date: { type: Date, default: Date.now }
  }],
  // Timeouts
  timeouts: [{
    reason: String,
    moderator: String,
    duration: String,
    date: { type: Date, default: Date.now }
  }],
});

userSchema.index({ userId: 1, guildId: 1 }, { unique: true });

export default mongoose.model('User', userSchema);