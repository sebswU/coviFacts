const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
    data: new SlashCommandBuilder()
        .setName("report")
        .setDescription("send a user that the bot should have caught or a word that raises a red flag")
        .addStringOption(option =>
            option.setName('word or username')
            .setDescription('puts new word into the list if not already there, or if it is a username, will put in database')
            .setRequired(true)
            )
}