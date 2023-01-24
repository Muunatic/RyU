const { manager } = require('../../../../client');
const { Permissions } = require('discord.js');
const prefix = process.env.PREFIX;

module.exports = {
    name: 'end',
    execute(message, args) {
        if (!message.member.permissions.has(Permissions.FLAGS.MANAGE_MESSAGES)) return message.channel.send('Kamu tidak memiliki izin untuk menggunakan command ini');
        if (!args.join(' ')) return message.channel.send(`${prefix}end <msgid>`);
        const messageID = args[0];
        manager.end(messageID).then(() => {
            message.channel.send('**Success !!**');
        }).catch(() => {
            message.channel.send('ID tidak ditemukan');
        });
    },
};
