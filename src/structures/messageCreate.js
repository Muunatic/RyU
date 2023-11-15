const fs = require ('fs');
const { client } = require('../../client');

client.on('messageCreate', async (message) => {

    const args = message.content.slice(process.env.PREFIX.length).trim().split(/ +/);
    const command = args.shift().toLowerCase();

    if (!message.content.startsWith(process.env.PREFIX) || message.author.bot) return;
    if (!message.guild) return;

    if (!client.commands.has(command)) return;

    try {
        client.commands.get(command).execute(message, args, client);
    } catch (error) {
        console.error(error);
        message.reply(process.env.DEFAULT_ERROR);
    }

    const afkJson = require('../data/afk.json');

    if (afkJson.afkvalue.indexOf(message.author.id) !== -1) {
        afkJson.afkvalue.splice(afkJson.afkvalue.indexOf(message.author.id), 1);
        fs.writeFileSync('./src/data/afk.json', JSON.stringify(afkJson));
        message.member.setNickname(message.author.username);
        message.channel.send(`**\`${message.author.username}\` telah kembali dari AFK!**`);
    }

    let mentioned = message.mentions.members?.first();

    if (mentioned) {
        if (afkJson.afkvalue.indexOf(mentioned.id) !== -1) {
            return message.channel.send(`**\`${mentioned.user.username}\` sedang AFK!**`);
        } else {
            return;
        }
    } else if (mentioned == undefined) {
        return;
    }

});
