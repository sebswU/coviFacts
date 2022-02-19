const fs = require('fs');
const { Client, Collection, Intents } = require('discord.js');
const { SlashCommandBuilder } = require('@discordjs/builders');
const dotenv = require('dotenv');
dotenv.config();
const client = new Client({ 
		intents: [
			Intents.FLAGS.GUILDS, 
			Intents.FLAGS.GUILD_MESSAGES
		] 
	});
//discordjs command files
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
	const command = require(`./commands/${file}`);
	// Set a new item in the Collection
	// With the key as the command name and the value as the exported module
	client.commands.set(command.data.name, command);
}
//discordjs EventEmitter class
const eventFiles = fs.readdirSync('./events').filter(file => file.endsWith('.js'));

for (const file of eventFiles) {
	const event = require(`./events/${file}`);
	if (event.once) {
		client.once(event.name, (...args) => event.execute(...args));
	} else {
		client.on(event.name, (...args) => event.execute(...args));
	}
}
//allows us to use external files and data from command files through 'require()'
//"Collection" => scripts in the file called "commands"

client.commands = new Collection();


//runs when started/activated
client.once('ready', () => {//all client. functions are arrow functions
    console.log("active now");
})

client.on('interactionCreate', async interaction => {
	if (!interaction.isCommand()) return;
	const command = client.commands.get(interaction.commandName);

	if (!command) return;

	try {//bad practice to do if/else and the bot may crash under error
		await command.execute(interaction);
	} catch (error) {
		console.error(error);
		await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
	}
});

client.login(process.env.TOKEN);
