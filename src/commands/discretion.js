const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
      data: new SlashCommandBuilder()
            .setName('discretion')
            .setDefaultPermission(true)
            .setDescription('removes any wrongdoing actions by bot if it sees fit ')
            .addStringOption(option => 
                  option.setName('username')
                  .setDescription('Enter wronged user with the #XXXX')
                  .setRequired(true)
                  ),

}
