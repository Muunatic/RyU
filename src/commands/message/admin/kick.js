const { Permissions } = require('discord.js');

module.exports = {
    name: 'kick',
    execute(message, args) {
        if (!message.member.permissions.has(Permissions.FLAGS.KICK_MEMBERS)) return message.channel.send('Kamu tidak memiliki izin untuk menggunakan command ini');
        const user = message.mentions.users.first();
        if (user) {
            const member = message.guild.members.resolve(user);
            if (member) {
                member.kick(`Telah dikick dari server oleh ${message.author.username}`)
                .then(() => {
                    if (args[1]) return message.channel.send(`**${user.tag} Telah dikick dikarenakan ${args.slice(1).join(' ')}**`);
                    if (!args[1]) return message.channel.send(`**${user.tag} Telah dikick**`);
                });
            } else {
                message.channel.send('**User tidak ditemukan**');
            }
        } else {
            message.channel.send('**Mention user untuk melakukan kick**');
        }
    }
};
