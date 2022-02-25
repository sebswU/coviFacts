const fs = require('fs');
const { Client, Collection, Intents, Message } = require('discord.js');
const { SlashCommandBuilder } = require('@discordjs/builders');
const dotenv = require('dotenv');
//const { computeOutShape } = require('@tensorflow/tfjs-core/dist/ops/slice_util');
dotenv.config();
const theWords = ['ploy','deep state','population control','coronavirus is fake','chinavirus','covid agenda', 'fake vaccine'];
const theInfo = ['https://www.cdc.gov/coronavirus/2019-ncov/index.html']
const client = new Client({ 
		intents: [
			Intents.FLAGS.GUILDS, 
			Intents.FLAGS.GUILD_MESSAGES
		] 
	});

client.commands = new Collection();
//discordjs command files
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
	const command = require(`./commands/${file}`);
	// Set a new item in the Collection
	// With the key as the command name and the value as the exported module
	console.log(command);
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



//runs when started/activated
client.once('ready', () => {//all client. functions are arrow functions
    console.log("active now");
})
//runs when message is created
client.on('messageCreate', msg => {
	if (msg.author.bot) return;
	if (theWords.some(word => msg.content.includes(word))) {
		msg.reply(`${msg.author.username}, this is detected to be a malicious/disruptive comment. Please do not spread misinformation or spam content on the server. Here is information to educate:${theInfo[0]}`)
	}
})
client.on('interactionCreate', async interaction => {

	const command = client.commands.get(interaction.commandName);

	if (!command) return;

	try {//bad practice to do if/else and the bot may crash under error
		await command.execute(interaction);
	} catch (error) {
		console.error(error);
		await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
	}
	if (interaction.commandName === 'discretion') {
		await interaction.reply({content:'We will look into it!', ephemeral: true});
		const string = interaction.options.getString('input');
		console.log(`discretionary wants to release ${string}`);
	}
});

client.login(process.env.TOKEN);
