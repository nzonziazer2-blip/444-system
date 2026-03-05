import { readdirSync } from 'fs';
import { join, dirname } from 'path';
import { pathToFileURL, fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

export async function loadCommands(client) {
  const commandsPath = join(__dirname, '../commands');
  const folders = readdirSync(commandsPath);

  for (const folder of folders) {
    const files = readdirSync(join(commandsPath, folder)).filter(f => f.endsWith('.js'));
    for (const file of files) {
      const filePath = pathToFileURL(join(commandsPath, folder, file)).href;
      const command = await import(filePath);
      if (command.default?.name && command.default?.execute) {
        client.commands.set(command.default.name, command.default);
        console.log(`✅ Command loaded: ${command.default.name}`);
      }
    }
  }
}
