/*
*this file is used to test the database features of the bot; if ok, then will be incorporated into index.js
*/
'use strict';
const Sequelize = require('sequelize');
const fs = require('fs')
const { Client, Collection, Intents, Message } = require('discord.js');
const theWords = ['ploy','deep state','population control','coronavirus is fake','chinavirus','covid agenda', 'fake vaccine'];
const tagDescriptions = ['spam','threat','misinformation']
const dotenv = require('dotenv');
const theInfo = ['https://www.cdc.gov/coronavirus/2019-ncov/index.html']
dotenv.config();
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

//allows us to use external files and data from command files through 'require()'
//"Collection" => scripts in the file called "commands"

const sequelize = new Sequelize('database', 'user', 'password', {
	host: 'localhost',
	dialect: 'sqlite',
	logging: false,
	// SQLite only
	storage: 'database.sqlite',
});
const Tags = sequelize.define('tags', {//each instance (row) in the database is called a Tag for some reason
    name: {
        type: Sequelize.STRING,
        unique: true,
    },

    description: Sequelize.TEXT,
    username: Sequelize.STRING,
    usage_count: {
        type: Sequelize.INTEGER,
        defaultValue: 1,
        allowNull: false,
    },
});


client.once('ready', () => {
	Tags.sync();
    console.log('bot is up and running')
});
client.on('messageCreate', async msg =>{
    if (theWords.some(word => msg.content.includes(word))) {
        //later on, this message will be modified to be dynanic and adaptive to type of malicious content detected
		msg.reply(`${msg.author.username}, this is detected to be a malicious/disruptive comment. Please do not spread misinformation or spam content on the server. Here is information to educate:${theInfo[0]}`);
        const fugitiveName = msg.author.id;//user id
        const Username = msg.author.username;

        const userKey = await Tags.findOne({where: {name: fugitiveName}})
        if (userKey) {
            return userKey.increment('usage_count');
        } 
        try {
            // equivalent to: INSERT INTO tags (name, description, username) values (?, ?, ?);
            const tag = await Tags.create({//creates a database and 
                name: fugitiveName,
                description: 'misinformation',
                username: Username,
                usage_count: 1,
            });

            return msg.reply(`Tag ${tag.name} added.`);
        } catch(error) {
            return msg.reply('something went wrong with adding tag')
        }
        //or display the miscellaneous error        }
	}
})
client.on('interactionCreate', async interaction => {
	if (!interaction.isCommand()) return;

	const { commandName } = interaction;
    if (commandName === 'discretion') {
        const identityBuffer = await Tags.findOne({where: {name: interaction.user.username}});
        if (identityBuffer) {//checks to see if the user isn't trying to get out of trouble
            return interaction.reply("Sorry, but you cannot bail yourself out.")
        }
		const tagName = interaction.options.getString('username');

        // takes the tag out of the system
        const rowCount = await Tags.destroy({ where: { username: tagName } });

        if (!rowCount) return interaction.reply('That tag did not exist.');
        console.log(`${tagName} has been wrongly convicted of spreading misinformation`)
        //show the changed list in the terminal
        const tagList = await Tags.findAll({ attributes: ['name'] });
        const tagString = tagList.map(t => t.name).join(', ') || 'No tags set.';

        console.log(`List of tags: ${tagString}`);
        return interaction.reply('Your request has been considered');

	} 
    if (commandName === 'poll') {
        const wordSuggestion = interaction.options.getString('word')
        //user types the word he/she wants to suggest
        const channel = client.channels.cache.get('953049903859396699')
        channel.send(`${wordSuggestion}: is this a key word that is uncaught? React with :thumbsup: up or :thumbsdown:`)
        return interaction.reply('your suggested key word is up for debate')
    
        // The suggested word by user is sent to the polling chat 
        //where the reactions can be seen and administrator can act upon the reactions
        
    }
    if (commandName === 'report') {
        const IDEntered = interaction.options.getString('userid');
        //User types in userid of the user he/she wants to report
        const usernameEntered = interaction.options.getString('username')
        //User types in actual username displayed in the server of the user he/she wants to report
        const descriptOpt = interaction.options.getString('description')
        //User explains the reason why he/she wants to report this user

        const userKey = await Tags.findOne({where: {name: IDEntered}})
        if (userKey) {//increments count if already in database
            return userKey.increment('usage_count');
        } 
        try {
            const tag = await Tags.create({
                //creates a database with inputted values from slash command
                name: IDEntered,
                description: descriptOpt,
                username: usernameEntered,
                usage_count: 1,
            });
            //show if its actually in there by getting all values and printing it in terminal
            const tagList = await Tags.findAll({ attributes: ['name'] });
            const tagString = tagList.map(t => t.name).join(', ') || 'No tags set.';
            console.log(`List of tags: ${tagString}`);

            return interaction.reply(`The user ${tag.username} has been added to the misinformer database`);
        } catch(error) {
            return interaction.reply(`something went wrong with adding tag. Error: ${error}`)
        }
        
    }
    if (commandName === 'newword') {
        if (interaction.member?.permissions.has("ADMINISTRATOR")) {
             theWords.push(interaction.options.getString('addition'))
             return interaction.reply('word added')
        }
        return interaction.reply('you don\'t have the right permissions to do this')
     }
    if (commandName === 'ping') {
        await interaction.reply('pong');
    }
});

client.login(process.env.TOKEN);