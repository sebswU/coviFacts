const {SlashCommandBuilder} = require('@discordjs/builders');
//only admin can use
module.exports = {
    data : new SlashCommandBuilder()
    .setName('newword')
    .setDefaultPermission(true)
    .setDescription('add something to word list, only use if you are part of admin')
    .addStringOption(option => 
        option.setName('addition')
        .setDescription('word to be added')
        .setRequired(true)
        )
}