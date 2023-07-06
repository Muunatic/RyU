const { manager } = require('../../../../client');
const { Permissions } = require('discord.js');

module.exports = {
    name: 'reroll',
    execute(message, args) {
        if (!message.member.permissions.has(Permissions.FLAGS.MANAGE_MESSAGES)) return message.channel.send('Kamu tidak memiliki izin untuk menggunakan command ini');
        if (!args.join(' ')) return message.channel.send(`${process.env.PREFIX}reroll <msgid>`);
        const messageID = args[0];
        manager.reroll(messageID).then(() => {
            message.channel.send('Rerolled');
        }).catch(() => {
            message.channel.send('ID tidak ditemukan');
        });
    }
};
