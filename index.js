import {
  GatewayIntentBits,
  Partials,
  Events,
  Client,
  Collection,
} from 'discord.js'
import fs from 'fs'
import path from 'path'
import { fileURLToPath, pathToFileURL } from 'url'
import { createTempChannelBot } from './tempRooms/main.js'
import { Token } from './constants.js'

const bot = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildVoiceStates,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
  partials: [Partials.Channel],
})

bot.commands = new Collection()

/* -------- Intanciar comandos -------- */
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

/* -------- Interecciones Bot -------- */
bot.on(Events.InteractionCreate, async (interaction) => {
  if (!interaction.isChatInputCommand()) return

  const command = bot.commands.get(interaction.commandName)
  if (!command) {
    console.error(`No command matching ${interaction.commandName} was found.`)
    return
  }

  try {
    await command.execute(interaction)
  } catch (error) {
    console.error(error)
    if (interaction.replied || interaction.deferred) {
      await interaction.followUp({
        content: 'There was an error while executing this command!',
        ephemeral: true,
      })
    } else {
      await interaction.reply({
        content: 'There was an error while executing this command!',
        ephemeral: true,
      })
    }
  }
})
/* -------- Logia de las Salas -------- */
bot.on(
  'voiceStateUpdate',
  async (oldState, newState) => await createTempChannelBot(oldState, newState)
)

/* -------- ready -------- */
bot.once(Events.ClientReady, async (readyClient) => {
  console.log(`Logged in as ${readyClient.user.tag}!`)

  const data = dataShowUser
  await bot.application.commands.set(data)
})

bot.login(Token)
