const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('report')
        .setDefaultPermission(true)
        .setDescription('send a user that the bot should have caught or a word that raises a red flag')
        .addStringOption(option => 
            option.setName('username')
            .setDescription('username, NOT USER ID')
            .setRequired(true)
            )
        .addStringOption(option => 
            option.setName('description')
            .setDescription('reason for reporting (spam, misinfo, or threat)')
            .setRequired(true)
            .addChoice('spam', 'spamming')
            .addChoice('misinfo', 'misinformation')
            .addChoice('threat', 'threats'))
        .addStringOption(option => 
            option.setName('userid')
            .setDescription('copy bad user id and paste here')
            .setRequired(true)
            )
        .addStringOption(option =>
            option.setName('word')
            .setDescription('new word that should have been used to catch someone')
            .setRequired(false)
            ),
};