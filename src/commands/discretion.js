const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
      data: new SlashCommandBuilder()
            .setName('discretion')
            .setDefaultPermission(true)
            .setDescription('removes any wrongdoing actions by bot if it sees fit'),
      async execute(interaction) {
            if (msg.author.bot) return//so that the bot does not react to itself
            await interaction.reply('we will look into it')

           
      }

}
