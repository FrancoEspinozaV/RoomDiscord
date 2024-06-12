import { SlashCommandBuilder } from 'discord.js'
import { categoryID } from '../../constants.js'

export default {
  data: new SlashCommandBuilder()
    .setName('show')
    .setDescription('Shows the temporary channel'),
  async execute(interaction) {
    const channel = interaction.member.voice.channel
    const tempCategoryId = categoryID

    if (channel && channel.parentId === tempCategoryId) {
      await channel.permissionOverwrites.edit(channel.guild.roles.everyone, {
        ViewChannel: true,
      })
      await interaction.reply({
        content: 'Channel visible to everyone.',
        ephemeral: true,
      })
    } else {
      await interaction.reply({
        content: 'You are not in a temporary channel.',
        ephemeral: true,
      })
    }
  },
}
