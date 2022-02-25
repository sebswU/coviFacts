const fs = require('fs');
const { SlashCommandBuilder } = require('@discordjs/builders');
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');
const dotenv = require('dotenv');
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));
//address for the slash commands
const guildId = '868281145090003004';
const clientId = '868685027226038292';

const commands = [
	new SlashCommandBuilder().setName('ping').setDescription('Replies with pong!'),
	new SlashCommandBuilder().setName('discretion').setDescription('sends message to owner of wrong bot decision')
]
	.map(command => command.toJSON());

for (const file of commandFiles) {
	const command = require(`./commands/${file}`);
	commands.push(command.data.toJSON());
}
	
const rest = new REST({ version: '9' }).setToken(process.env.TOKEN);

(async () => {//mechanism applies new commands/updated commands to guild whenever file runs
	try {
		console.log('Started refreshing application (/) commands.');

		await rest.put(
			Routes.applicationGuildCommands(clientId, guildId),
			{ body: commands },
		);

		console.log('Successfully reloaded application (/) commands.');
	} catch (error) {
		console.error(error);
	}
})();
