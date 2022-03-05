const fs = require('node:fs');
const { SlashCommandBuilder } = require('@discordjs/builders');
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');
const dotenv = require('dotenv').config();
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));
//address for the slash commands
const guildId = process.env.GUILDID;
const clientId = process.env.CLIENTID;

const commands = []
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
