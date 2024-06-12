import { SlashCommandBuilder } from 'discord.js'
import { categoryID } from '../../constants.js'

export default {
  data: new SlashCommandBuilder()
    .setName('rename')
    .setDescription('Changes the name of the temporary channel')
    .addStringOption((option) =>
      option
        .setName('name')
        .setDescription('The new name for the channel')
        .setRequired(true)
    ),
  async execute(interaction) {
    const newName = interaction.options.getString('name')
    const channel = interaction.member.voice.channel
    const tempCategoryId = categoryID

    if (channel && channel.parentId === tempCategoryId) {
      await channel.setName(newName)
      await interaction.reply({
        content: `Channel name changed to: ${newName}`,
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
