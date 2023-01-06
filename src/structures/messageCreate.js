const fs = require ('fs');
const { client } = require('../../client');
const prefix = process.env.PREFIX;

client.on('messageCreate', async (message) => {

    const args = message.content.slice(prefix.length).trim().split(/ +/);
    const command = args.shift().toLowerCase();

    const afkjson = require('../data/afk.json');

    if (afkjson.afkvalue.indexOf(message.author.id) != -1) {
        afkjson.afkvalue.splice(afkjson.afkvalue.indexOf(message.author.id), 1);
        fs.writeFileSync('./src/data/afk.json', JSON.stringify(afkjson));
        message.member.setNickname(message.author.username)
        message.channel.send(`**\`${message.author.username}\` telah kembali dari AFK!**`);
    }

    let mentioned = message.mentions.members.first();
    
    if (mentioned) {
        if (afkjson.afkvalue.indexOf(mentioned.id) != -1)
        message.channel.send(`**\`${mentioned.user.username}\` sedang AFK!**`);
    }

    if (!message.content.startsWith(prefix) || message.author.bot) return;
    if (!message.guild) return;

    if (!client.commands.has(command)) return;

    try {
        client.commands.get(command).execute(message, args, client);
    } catch (error) {
        console.error(error);
        message.reply(process.env.DEFAULT_ERROR);
    }

});