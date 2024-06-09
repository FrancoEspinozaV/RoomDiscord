import fs from 'fs'
import path from 'path'
import { fileURLToPath, pathToFileURL } from 'url'

export async function dyamicFiles(bot) {
  const __filename = fileURLToPath(import.meta.url)
  const __dirname = path.dirname(__filename)

  const foldersPath = path.join(__dirname, 'commands')
  const commandFolders = fs.readdirSync(foldersPath)
  const dataShowUser = []

  for (const folder of commandFolders) {
    const commandsPath = path.join(foldersPath, folder)
    const commandFiles = fs
      .readdirSync(commandsPath)
      .filter((file) => file.endsWith('.js'))

    for (const file of commandFiles) {
      const filePath = path.join(commandsPath, file)
      try {
        const { default: command } = await import(pathToFileURL(filePath))
        if (command) {
          const { data, execute } = command
          if (data && execute) {
            const { name, description, options } = data
            const filterData = { name, description, options }
            dataShowUser.push(filterData)
            bot.commands.set(data.name, command)
          } else {
            console.log(
              `[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`
            )
          }
        } else {
          console.log(
            `[WARNING] No default export found in the command at ${filePath}.`
          )
        }
      } catch (error) {
        console.error(`[ERROR] Failed to import command at ${filePath}:`, error)
      }
    }
  }

  return dataShowUser
}
