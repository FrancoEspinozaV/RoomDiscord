import {
  GatewayIntentBits,
  Partials,
  Events,
  Client,
  Collection,
} from 'discord.js'

import { createTempChannelBot } from './tempRooms/main.js'
import { Token } from './constants.js'
import { dyamicFiles } from './dynamicFiles.js'

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
const dataShowUser = await dyamicFiles(bot)
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
