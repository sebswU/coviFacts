const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
      data: new SlashCommandBuilder()
            .setName('discretion')
            .setDefaultPermission(true)
            .setDescription('removes any wrongdoing actions by bot if it sees fit')
            .addStringOption(option => 
                  option.setName('username')// the option is the black box that is required
                  .setDescription('Enter wronged user')
                  .setRequired(true)// if set to true you cant use the slash command without putting sometning in
                  ),

}
