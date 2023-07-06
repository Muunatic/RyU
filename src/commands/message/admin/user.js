const { client } = require('../../../../client');
const { Permissions } = require('discord.js');

module.exports = {
    name: 'user',
    execute(message, args) {
        if (!message.member.permissions.has(Permissions.FLAGS.MANAGE_MESSAGES)) return message.channel.send('Kamu tidak memiliki izin untuk menggunakan command ini');
        const dmuser = client.users.cache.get(args[0]);
        dmuser.send(args.slice(1).join(' '));
    }
};
