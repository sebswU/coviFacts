/*
*this file is used to test the database features of the bot; if ok, then will be incorporated into index.js
*/
const Sequelize = require('sequelize');
const fs = require('fs')
const { Client, Collection, Intents, Message } = require('discord.js');
const theWords = ['ploy','deep state','population control','coronavirus is fake','chinavirus','covid agenda', 'fake vaccine'];
const tagDescriptions = ['spam','threat','misinformation']
const dotenv = require('dotenv');
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
const Tags = sequelize.define('tags', {
    name: {
        type: Sequelize.STRING,
        unique: true,
    },
    description: Sequelize.TEXT,
    username: Sequelize.STRING,
    strikes: {
        type: Sequelize.INTEGER,
        defaultValue: 1,
        allowNull: false,
    },
});

client.once('ready', () => {
	Tags.sync();
});
client.on('messageCreate', async msg =>{
    if (theWords.some(word => msg.content.includes(word))) {
		msg.reply(`${msg.author.username}, this is detected to be a malicious/disruptive comment. Please do not spread misinformation or spam content on the server. Here is information to educate:${theInfo[0]}`);
        const tagName = msg.author.id;
        const tagDescription = 'misinformation';
        const Username = msg.author.username;

        try {
            // equivalent to: INSERT INTO tags (name, description, username) values (?, ?, ?);
            const tag = await Tags.create({
                name: tagName,
                description: tagDescription,
                username: Username,
                strike: 1,
            });

            return interaction.reply(`Tag ${tag.name} added.`);
        }
        catch (error) {
            if (error.name === 'SequelizeUniqueConstraintError') {//if user already added on there
                const tagName = interaction.options.getString('name');//get the identifier for the tag and find it
                const tag = await Tags.findOne({where: {name: tagName}});
                if (tag) {
                    tag.increment('strike')//records the amount of times user has been caught
                    const addedDesc = await Tags.update({description: tagDescription + "\nmisinformation"}, {where: {name: tagName}});
                    if (!addedDesc) {//if the updating description process did not work...
                        console.log('something went wrong with updating')
                        return interaction.reply('not working at the moment')
                    }
                    if (tag.get('strike') >= 3) {//suggests user be kicked if the strike # is or is greater than 3
                        console.log(`${tag.get(username)} needs to be kicked. Please consider this decision.`)
                    }
                }
            }
            //or display the miscellaneous error
            return interaction.reply(`Something went wrong with adding a tag. Error: ${error}`);
        }
	}
})
client.on('interactionCreate', async interaction => {
	if (!interaction.isCommand()) return;
	const { commandName } = interaction;
    if (commandName === 'discretion') {
		const tagName = interaction.options.getString('username');

        // equivalent to: DELETE from tags WHERE name = ?;
        const rowCount = await Tags.destroy({ where: { name: tagName } });

        if (!rowCount) return interaction.reply('That tag did not exist.');
        console.log(`${tagName} has been wrongly convicted of spreading misinformation`)
        //show the changed list in the terminal
        const tagList = await Tags.findAll({ attributes: ['name'] });
        const tagString = tagList.map(t => t.name).join(', ') || 'No tags set.';

        console.log(`List of tags: ${tagString}`);
        return interaction.reply('Your request has been considered');

	} else if (commandName === 'showtags') {
		// equivalent to: SELECT name FROM tags;
        
	} 
});

client.login(process.env.TOKEN);