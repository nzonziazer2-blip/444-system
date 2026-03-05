import { Client, GatewayIntentBits, Collection } from 'discord.js';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { loadCommands } from './src/handlers/commandHandler.js';
import { loadEvents } from './src/handlers/eventHandler.js';

dotenv.config();

export const PREFIX = '²';

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildVoiceStates,
    GatewayIntentBits.GuildMessageReactions,
    GatewayIntentBits.GuildPresences,
  ]
});

client.commands = new Collection();

mongoose.connect(process.env.MONGO_URI, {
  serverSelectionTimeoutMS: 10000,
  family: 4
})
  .then(() => console.log('✅ MongoDB connected'))
  .catch(err => console.error('❌ MongoDB error:', err));

await loadCommands(client);
await loadEvents(client);

client.login(process.env.DISCORD_TOKEN);
