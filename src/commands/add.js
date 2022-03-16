const {SlashCommandBuilder} = require('@discordjs/builders');

module.exports = {
    data : new SlashCommandBuilder()
    .setName('newword')
    .setDefaultPermission(true)
    .setDescription('add something to word list, only use if you are part of admin')
    .addStringOption(option => 
        option.setName('addition')
        .setRequired(true)
        )
}