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
        const tagName = msg.author.id;
        const Username = msg.author.username;

        const userKey = await Tags.findOne({where: {tagName: IDEntered}})
            if (userKey) {
                return userKey.increment('usage_count');
            } 
            try {
                // equivalent to: INSERT INTO tags (name, description, username) values (?, ?, ?);
                const tag = await Tags.create({//creates a database and 
                    name: tagName,
                    description: 'misinformation',
                    username: Username,
                    usage_count: 1,
                });
    
                return msg.reply(`Tag ${tag.name} added.`);
            } catch(error) {
                return interaction.reply('something went wrong with adding tag')
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
        const rowCount = await Tags.destroy({ where: { name: tagName } });

        if (!rowCount) return interaction.reply('That tag did not exist.');
        console.log(`${tagName} has been wrongly convicted of spreading misinformation`)
        //show the changed list in the terminal
        const tagList = await Tags.findAll({ attributes: ['name'] });
        const tagString = tagList.map(t => t.name).join(', ') || 'No tags set.';

        console.log(`List of tags: ${tagString}`);
        return interaction.reply('Your request has been considered');

	} 
    if (commandName === 'report') {
        const IDEntered = interaction.options.getString('userid');
        const usernameEntered = interaction.options.getString('username')
        const descriptOpt = interaction.options.getString('description')
        const wordEntered = interaction.options.getString('word')
        
        if (wordEntered) {
            theWords.push(wordEntered)
            interaction.reply('your word has been recorded')
        }
        const userKey = await Tags.findOne({where: {tagName: IDEntered}})
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

            return msg.reply(`${msg.author.username}, this is detected to be a malicious/disruptive comment. Please do not spread misinformation or spam content on the server. Here is information to educate:${theInfo[0]}`);
        } catch(error) {
            return interaction.reply(`something went wrong with adding tag. Error: ${error}`)
        }
        
    }
    if (commandName === 'ping') {
        await interaction.reply('pong');
    }
});

client.login(process.env.TOKEN);