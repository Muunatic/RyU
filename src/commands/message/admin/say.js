const { client } = require('../../../../client');
const { Permissions } = require('discord.js');

module.exports = {
    name: 'say',
    execute(message, args) {
        if (!message.member.permissions.has(Permissions.FLAGS.MANAGE_MESSAGES)) return message.channel.send('Kamu tidak memiliki izin untuk menggunakan command ini');
        const channel = client.channels.cache.get(args[0]);
        if (!client.channels.cache.get(args[0])) return message.channel.send(process.env.DEFAULT_ERROR);
        if (!args[1]) return message.channel.send('**Berikan args**');
        channel.send(args.slice(1).join(' '));
        message.react('✅');
    },
};
