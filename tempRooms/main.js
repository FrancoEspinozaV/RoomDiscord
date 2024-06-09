import { creatorChannelID } from '../constants.js'
import { createTempChannel, deleteChannel, moveUserToChannel } from './utils.js'

export async function createTempChannelBot(oldState, newState) {
  // Verifica si un usuario se ha unido a un canal de voz específico
  const user = newState.member.user
  const guild = newState.guild

  // Verifica si un usuario se ha unido al canal "Creador de salas"
  if (newState.channelId === creatorChannelID && !oldState.channelId) {
    const tempChannel = await createTempChannel(guild, user)
    await moveUserToChannel(newState.member, tempChannel)
  }

  // Si un usuario se desconecta de un canal o se mueve a otro canal
  if (oldState.channelId && !newState.channelId) {
    const oldChannel = oldState.channel

    // Verifica si el canal es un canal temporal y está vacío
    if (
      oldChannel.members.size === 0 &&
      oldChannel.name.startsWith('temp channel')
    ) {
      await deleteChannel(oldChannel)
    }
  }
}
