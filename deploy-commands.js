import { REST, Routes } from 'discord.js';
import { readdirSync } from 'fs';
import { join, dirname } from 'path';
import { pathToFileURL, fileURLToPath } from 'url';
import dotenv from 'dotenv';

dotenv.config();

const __dirname = dirname(fileURLToPath(import.meta.url));
const commands = [];
const foldersPath = join(__dirname, 'src/commands');
const folders = readdirSync(foldersPath);

for (const folder of folders) {
  const files = readdirSync(join(foldersPath, folder)).filter(f => f.endsWith('.js'));
  for (const file of files) {
    const filePath = pathToFileURL(join(foldersPath, folder, file)).href;
    const command = await import(filePath);
    if (command.default?.data) {
      commands.push(command.default.data.toJSON());
    }
  }
}

const rest = new REST().setToken(process.env.DISCORD_TOKEN);

try {
  console.log(`🔄 Registering ${commands.length} slash commands...`);
  await rest.put(
    Routes.applicationCommands(process.env.CLIENT_ID),
    { body: commands }
  );
  console.log('✅ Slash commands registered successfully!');
} catch (error) {
  console.error('❌ Error:', error);
}