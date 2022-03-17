const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
    data: new SlashCommandBuilder()
    .setName('poll')
    .setDefaultPermission(true)
    .setDescription('Input a word and the bot will make a poll in the polling channel')
    .addStringOption(option =>
        option.setName('word')
        .setDescription('Suggest new word to the administrator via a poll message')
        .setRequired(true)
        )
}