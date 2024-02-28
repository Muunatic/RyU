const { Permissions } = require('discord.js');
const { manager } = require('../../../../client');

module.exports = {
    name: 'end',
    /**
     * @param {import("../../../../client").message} message
     * @param {Array<string>} args
     */
    execute(message, args) {
        if (!message.member.permissions.has(Permissions.FLAGS.MANAGE_MESSAGES)) return message.channel.send('Kamu tidak memiliki izin untuk menggunakan command ini');
        if (!args.join(' ')) return message.channel.send(`${process.env.PREFIX}end <msgid>`);
        const msgId = args[0];
        manager.end(msgId).then(() => {
            message.channel.send('**Success !!**');
        }).catch(() => {
            message.channel.send('ID tidak ditemukan');
        });
    }
};
