import { SlashCommandBuilder } from 'discord.js'
import { categoryID } from '../../constants.js'

export default {
  data: new SlashCommandBuilder()
    .setName('limit')
    .setDescription('Set the user limit for the temporary channel')
    .addIntegerOption(
      (option) =>
        option
          .setName('userlimit')
          .setDescription('Set the user limit for the temporary channel')
          .setRequired(true) // Make the user limit option required
    ),
  async execute(interaction) {
    const channel = interaction.member.voice.channel
    const tempCategoryId = categoryID

    if (!channel || channel.parentId !== tempCategoryId) {
      return interaction.reply('You are not in a temporary channel.', {
        ephemeral: true,
      })
    }

    // Check if the user has necessary permissions to modify the channel settings
    if (!channel.permissionsFor(interaction.member).has('MANAGE_CHANNELS')) {
      return interaction.reply({
        conten: 'You do not have permission to configure this channel.',
        ephemeral: true,
      })
    }

    // Fetch the user limit provided by the user
    const userLimit = interaction.options.getInteger('userlimit')

    // Set the user limit for the channel
    await channel.setUserLimit(userLimit)

    await interaction.reply({
      content: 'User limit for the channel updated.',
      ephemeral: true,
    })
  },
}
