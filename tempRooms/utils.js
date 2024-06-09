import { ChannelType, PermissionsBitField } from 'discord.js'
import { categoryID } from '../constants.js'

export async function createTempChannel(guild, user) {
  const tempChannel = await guild.channels.create({
    name: `temp channel (${user.username})`,
    type: ChannelType.GuildVoice,
    parent: categoryID, // Coloca el canal en la categoría especificada
    permissionOverwrites: [
      {
        id: guild.id,
        deny: [PermissionsBitField.Flags.ViewChannel],
      },
      {
        id: user.id,
        allow: [
          PermissionsBitField.Flags.ViewChannel,
          PermissionsBitField.Flags.Connect,
          PermissionsBitField.Flags.Speak,
        ],
      },
    ],
  })
  return tempChannel
}

export async function moveUserToChannel(user, channel) {
  if (user.voice.channel) {
    await user.voice.setChannel(channel)
  }
}

export async function deleteChannel(channel) {
  await channel.delete()
}
