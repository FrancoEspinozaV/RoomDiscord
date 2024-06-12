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
          PermissionsBitField.Flags.ManageChannels, // Permiso para gestionar el canal
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

// no la estoy usando pero se ve interesante de utilizar más adelante
export async function getChannelPermissions(channel) {
  const permissionOverwrites = channel.permissionOverwrites.cache

  permissionOverwrites.forEach((overwrite) => {
    const roleOrUserId = overwrite.id
    const allowPermissions = new PermissionsBitField(overwrite.allow)
    const denyPermissions = new PermissionsBitField(overwrite.deny)

    console.log(`Role/User ID: ${roleOrUserId}`)
    console.log(`Allowed Permissions: ${allowPermissions.toArray().join(', ')}`)
    console.log(`Denied Permissions: ${denyPermissions.toArray().join(', ')}`)
  })
}
