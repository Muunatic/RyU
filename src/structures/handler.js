const fs = require('fs');
const { Collection } = require('discord.js');
const { client} = require('../../client');

client.commands = new Collection();

const interactionFiles = fs.readdirSync('./src/commands/interaction').filter(file => file.endsWith('.js'));
for (const file of interactionFiles) {
    const command = require(`../commands/interaction/${file}`);
    client.commands.set(command.data.name, command);
}

fs.readdirSync('./src/commands/message/').forEach(dir => {
    const commandFiles = fs.readdirSync(`./src/commands/message/${dir}`).filter(file => file.endsWith('.js'));
    for (const file of commandFiles) {
        const command = require(`../commands/message/${dir}/${file}`);
        client.commands.set(command.name, command);
    }
});
