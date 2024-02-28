const { manager } = require('../../../../client');
const { Permissions } = require('discord.js');

module.exports = {
    name: 'reroll',
    /**
     * @param {import("../../../../client").message} message
     * @param {Array<string>} args
     */
    execute(message, args) {
        if (!message.member.permissions.has(Permissions.FLAGS.MANAGE_MESSAGES)) return message.channel.send('Kamu tidak memiliki izin untuk menggunakan command ini');
        if (!args.join(' ')) return message.channel.send(`${process.env.PREFIX}reroll <msgid>`);
        const msgId = args[0];
        manager.reroll(msgId).then(() => {
            message.channel.send('Rerolled');
        }).catch(() => {
            message.channel.send('ID tidak ditemukan');
        });
    }
};
