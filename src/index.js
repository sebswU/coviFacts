const discord = require('discord.js');
const client = new Client({ intents: [Intents.FLAGS.GUILDS] });


const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('ping')
		.setDescription('Replies with Pong!'),
	async execute(interaction) {
		await interaction.reply('Pong!');
	},
};
client.on('ready', () => {//all client. functions are arrow functions
    console.log("active now")
})

client.commands = new Collection();
const client = new Client({ intents: [Intents.FLAGS.GUILDS] });
client.login(process.env['TOKEN'])
