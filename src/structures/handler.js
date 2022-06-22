const fs = require('fs');
const { Collection } = require('discord.js');
const { client} = require('../../client');

client.commands = new Collection();

fs.readdirSync('./src/commands/interaction/').forEach(dir => {
    const interactionFiles = fs.readdirSync(`./src/commands/interaction/${dir}`).filter(file => file.endsWith('.js'));
    for (const file of interactionFiles) {
        const command = require(`../commands/interaction/${dir}/${file}`);
        client.commands.set(command.data.name, command);
    }
});

fs.readdirSync('./src/commands/message/').forEach(dir => {
    const commandFiles = fs.readdirSync(`./src/commands/message/${dir}`).filter(file => file.endsWith('.js'));
    for (const file of commandFiles) {
        const command = require(`../commands/message/${dir}/${file}`);
        client.commands.set(command.name, command);
    }
});